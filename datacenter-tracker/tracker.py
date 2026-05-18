#!/usr/bin/env python3
"""
US Datacenter Construction Tracker
Fetches daily data from Cleanview API (or public page fallback),
diffs against the previous day's snapshot, and notifies via email + Slack.
"""

import json
import os
import smtplib
import sys
import urllib.error
import urllib.request
from datetime import date, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from html.parser import HTMLParser
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

API_ENDPOINT = "https://api.cleanview.co/api/v1/data-centers"
PUBLIC_PAGE = "https://cleanview.co/public/data-centers/us"

STATUS_LABELS = {
    "planned": "Planned",
    "under_construction": "Under Construction",
    "operating": "Operating",
    "cancelled": "Cancelled",
    "announced": "Announced",
}

# ---------------------------------------------------------------------------
# Data fetching
# ---------------------------------------------------------------------------

def fetch_via_api(api_key: str) -> list[dict]:
    req = urllib.request.Request(
        API_ENDPOINT,
        headers={"x-api-key": api_key, "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        payload = json.loads(resp.read().decode())
    # API returns either a list or {"data": [...]}
    if isinstance(payload, list):
        return payload
    return payload.get("data", payload.get("results", []))


class _TableParser(HTMLParser):
    """Minimal HTML parser that extracts rows from the first <table>."""

    def __init__(self):
        super().__init__()
        self.in_table = False
        self.in_cell = False
        self.headers: list[str] = []
        self.rows: list[list[str]] = []
        self._current_row: list[str] = []
        self._current_cell: list[str] = []
        self._header_done = False

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.in_table = True
        elif tag in ("tr",) and self.in_table:
            self._current_row = []
        elif tag in ("th", "td") and self.in_table:
            self.in_cell = True
            self._current_cell = []

    def handle_endtag(self, tag):
        if tag in ("th", "td") and self.in_table:
            text = " ".join(self._current_cell).strip()
            self._current_row.append(text)
            self.in_cell = False
        elif tag == "tr" and self.in_table:
            if self._current_row:
                if not self._header_done:
                    self.headers = self._current_row
                    self._header_done = True
                else:
                    self.rows.append(self._current_row)
        elif tag == "table":
            self.in_table = False

    def handle_data(self, data):
        if self.in_cell:
            self._current_cell.append(data)


def fetch_via_scrape() -> list[dict]:
    req = urllib.request.Request(
        PUBLIC_PAGE,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; DCTracker/1.0)",
            "Accept": "text/html",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        html = resp.read().decode("utf-8", errors="replace")

    parser = _TableParser()
    parser.feed(html)

    if not parser.headers or not parser.rows:
        raise RuntimeError(
            "Scrape fallback: could not parse a table from the public page. "
            "The page layout may have changed."
        )

    headers = [h.lower().replace(" ", "_") for h in parser.headers]
    return [dict(zip(headers, row)) for row in parser.rows]


def fetch_datacenters() -> list[dict]:
    api_key = os.environ.get("CLEANVIEW_API_KEY", "").strip()
    if api_key:
        print("[fetch] Using Cleanview API key…")
        try:
            data = fetch_via_api(api_key)
            print(f"[fetch] API returned {len(data)} records.")
            return data
        except Exception as exc:
            print(f"[fetch] API call failed ({exc}), falling back to scrape…")

    print("[fetch] Scraping public page…")
    data = fetch_via_scrape()
    print(f"[fetch] Scraped {len(data)} records.")
    return data


# ---------------------------------------------------------------------------
# Snapshot storage
# ---------------------------------------------------------------------------

def snapshot_path(day: date) -> Path:
    return DATA_DIR / f"{day.isoformat()}.json"


def load_snapshot(day: date) -> list[dict] | None:
    p = snapshot_path(day)
    if p.exists():
        return json.loads(p.read_text())
    return None


def save_snapshot(day: date, data: list[dict]) -> None:
    snapshot_path(day).write_text(json.dumps(data, indent=2))


# ---------------------------------------------------------------------------
# Diffing
# ---------------------------------------------------------------------------

def _project_id(record: dict) -> str:
    """Best-effort stable ID from a record."""
    for key in ("id", "project_id", "slug", "name"):
        if record.get(key):
            return str(record[key])
    return json.dumps(record, sort_keys=True)


def _status(record: dict) -> str:
    raw = record.get("status", record.get("project_status", "unknown"))
    return STATUS_LABELS.get(str(raw).lower(), str(raw))


def _mw(record: dict) -> str:
    v = record.get("capacity_mw", record.get("power_mw", record.get("mw", "")))
    return f"{v} MW" if v else "—"


def _location(record: dict) -> str:
    state = record.get("state", record.get("state_name", ""))
    city = record.get("city", record.get("city_name", ""))
    parts = [p for p in (city, state) if p]
    return ", ".join(parts) or "Unknown"


def _developer(record: dict) -> str:
    return record.get("developer", record.get("company", record.get("owner", "—")))


def diff_snapshots(old: list[dict], new: list[dict]) -> dict:
    old_map = {_project_id(r): r for r in old}
    new_map = {_project_id(r): r for r in new}

    added = [new_map[k] for k in new_map if k not in old_map]
    removed = [old_map[k] for k in old_map if k not in new_map]
    status_changes = []

    for pid, new_rec in new_map.items():
        if pid in old_map:
            old_status = _status(old_map[pid])
            new_status = _status(new_rec)
            if old_status != new_status:
                status_changes.append(
                    {"record": new_rec, "old_status": old_status, "new_status": new_status}
                )

    return {"added": added, "removed": removed, "status_changes": status_changes}


# ---------------------------------------------------------------------------
# Summary stats
# ---------------------------------------------------------------------------

def summary_stats(data: list[dict]) -> dict:
    from collections import Counter
    statuses = Counter(_status(r) for r in data)
    states = Counter(r.get("state", r.get("state_name", "Unknown")) for r in data)
    top_states = states.most_common(5)
    total_mw = 0
    for r in data:
        try:
            total_mw += float(r.get("capacity_mw", r.get("power_mw", r.get("mw", 0))) or 0)
        except (TypeError, ValueError):
            pass
    return {"statuses": dict(statuses), "top_states": top_states, "total_mw": total_mw}


# ---------------------------------------------------------------------------
# Notification formatting
# ---------------------------------------------------------------------------

def _project_line(r: dict, prefix: str = "") -> str:
    name = r.get("name", r.get("project_name", "Unnamed project"))
    return f"{prefix}{name} | {_location(r)} | {_mw(r)} | {_developer(r)} | {_status(r)}"


def build_text_report(today: date, data: list[dict], diff: dict | None) -> str:
    lines = [f"US Datacenter Tracker — {today.isoformat()}", "=" * 60]

    stats = summary_stats(data)
    lines.append(f"Total tracked projects: {len(data)}")
    lines.append(f"Total planned capacity:  {stats['total_mw']:,.0f} MW")
    lines.append("")
    lines.append("By status:")
    for status, count in sorted(stats["statuses"].items(), key=lambda x: -x[1]):
        lines.append(f"  {status:<22} {count:>4}")
    lines.append("")
    lines.append("Top 5 states by project count:")
    for state, count in stats["top_states"]:
        lines.append(f"  {state:<20} {count:>4}")

    if diff is None:
        lines.append("")
        lines.append("(No previous snapshot found — this is the first run.)")
        return "\n".join(lines)

    lines.append("")
    lines.append(f"Changes since yesterday ({(today - timedelta(days=1)).isoformat()}):")
    lines.append(f"  New projects:      {len(diff['added'])}")
    lines.append(f"  Removed projects:  {len(diff['removed'])}")
    lines.append(f"  Status changes:    {len(diff['status_changes'])}")

    if diff["added"]:
        lines.append("")
        lines.append("NEW PROJECTS:")
        for r in diff["added"]:
            lines.append(_project_line(r, "  + "))

    if diff["removed"]:
        lines.append("")
        lines.append("REMOVED FROM TRACKER:")
        for r in diff["removed"]:
            lines.append(_project_line(r, "  - "))

    if diff["status_changes"]:
        lines.append("")
        lines.append("STATUS CHANGES:")
        for sc in diff["status_changes"]:
            name = sc["record"].get("name", sc["record"].get("project_name", "Unnamed"))
            loc = _location(sc["record"])
            lines.append(f"  {name} ({loc}): {sc['old_status']} → {sc['new_status']}")

    return "\n".join(lines)


def build_html_report(today: date, data: list[dict], diff: dict | None) -> str:
    text = build_text_report(today, data, diff)
    # Wrap plain text in a simple HTML shell
    escaped = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return (
        "<html><body>"
        "<pre style='font-family:monospace;font-size:13px;line-height:1.5'>"
        f"{escaped}"
        "</pre></body></html>"
    )


def build_slack_payload(today: date, data: list[dict], diff: dict | None) -> dict:
    stats = summary_stats(data)
    header = f":building_construction: *US Datacenter Tracker — {today.isoformat()}*"

    bullet_stats = (
        f"*{len(data)}* total projects tracked | "
        f"*{stats['total_mw']:,.0f} MW* planned capacity"
    )

    if diff is None:
        change_line = "_First run — no diff available._"
    else:
        parts = []
        if diff["added"]:
            parts.append(f":new: {len(diff['added'])} new project(s)")
        if diff["removed"]:
            parts.append(f":wastebasket: {len(diff['removed'])} removed")
        if diff["status_changes"]:
            parts.append(f":arrows_counterclockwise: {len(diff['status_changes'])} status change(s)")
        change_line = " | ".join(parts) if parts else ":white_check_mark: No changes since yesterday"

    details_lines = []
    if diff:
        for r in diff["added"][:5]:
            name = r.get("name", r.get("project_name", "Unnamed"))
            details_lines.append(f"  • *NEW* {name} — {_location(r)}, {_mw(r)}")
        for sc in diff["status_changes"][:5]:
            name = sc["record"].get("name", sc["record"].get("project_name", "Unnamed"))
            details_lines.append(
                f"  • *STATUS* {name}: {sc['old_status']} → {sc['new_status']}"
            )

    blocks = [
        {"type": "header", "text": {"type": "plain_text", "text": f"US Datacenter Tracker — {today.isoformat()}"}},
        {"type": "section", "text": {"type": "mrkdwn", "text": f"{header}\n{bullet_stats}"}},
        {"type": "section", "text": {"type": "mrkdwn", "text": change_line}},
    ]

    if details_lines:
        blocks.append({
            "type": "section",
            "text": {"type": "mrkdwn", "text": "\n".join(details_lines)},
        })

    top_states_text = " | ".join(f"{s}: {c}" for s, c in stats["top_states"])
    blocks.append({
        "type": "context",
        "elements": [{"type": "mrkdwn", "text": f"Top states: {top_states_text}"}],
    })

    return {"blocks": blocks}


# ---------------------------------------------------------------------------
# Notification sending
# ---------------------------------------------------------------------------

def send_email(subject: str, text_body: str, html_body: str) -> None:
    host = os.environ["SMTP_HOST"]
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ["SMTP_USER"]
    password = os.environ["SMTP_PASSWORD"]
    to_addr = os.environ["EMAIL_TO"]

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = os.environ.get("EMAIL_FROM", user)
    msg["To"] = to_addr
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(host, port) as server:
        server.ehlo()
        server.starttls()
        server.login(user, password)
        server.sendmail(msg["From"], [to_addr], msg.as_string())
    print(f"[email] Sent to {to_addr}")


def send_slack(payload: dict) -> None:
    webhook_url = os.environ["SLACK_WEBHOOK_URL"]
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        webhook_url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        status = resp.getcode()
    print(f"[slack] Webhook response: {status}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    today = date.today()
    yesterday = today - timedelta(days=1)

    print(f"[run] Date: {today.isoformat()}")

    # Fetch
    try:
        current = fetch_datacenters()
    except Exception as exc:
        print(f"[error] Could not fetch data: {exc}", file=sys.stderr)
        sys.exit(1)

    # Diff
    previous = load_snapshot(yesterday)
    diff = diff_snapshots(previous, current) if previous is not None else None

    # Save snapshot
    save_snapshot(today, current)
    print(f"[snapshot] Saved {len(current)} records to {snapshot_path(today)}")

    # Build reports
    text_report = build_text_report(today, current, diff)
    html_report = build_html_report(today, current, diff)
    slack_payload = build_slack_payload(today, current, diff)

    print("\n" + text_report + "\n")

    # Notify — skip if env vars are absent (useful for dry runs)
    errors = []

    email_vars = {"SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "EMAIL_TO"}
    if email_vars.issubset(os.environ):
        subject = f"US Datacenter Tracker — {today.isoformat()}"
        try:
            send_email(subject, text_report, html_report)
        except Exception as exc:
            errors.append(f"Email failed: {exc}")
            print(f"[email] ERROR: {exc}", file=sys.stderr)
    else:
        missing = email_vars - set(os.environ)
        print(f"[email] Skipped — missing env vars: {', '.join(sorted(missing))}")

    if os.environ.get("SLACK_WEBHOOK_URL"):
        try:
            send_slack(slack_payload)
        except Exception as exc:
            errors.append(f"Slack failed: {exc}")
            print(f"[slack] ERROR: {exc}", file=sys.stderr)
    else:
        print("[slack] Skipped — SLACK_WEBHOOK_URL not set")

    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
