#!/usr/bin/env python3
"""Genera un PDF unico dalla guida drone (cartella drone/)."""
import re
from pathlib import Path
import markdown
from xhtml2pdf import pisa

DRONE = Path(__file__).parent / "drone"
OUT = DRONE / "Guida-Drone-FAI-DA-TE.pdf"

# Ordine dei capitoli
FILES = [
    "README.md",
    "01-componenti.md",
    "02-strumenti-e-sicurezza.md",
    "03-assemblaggio.md",
    "04-configurazione-software.md",
    "05-primo-volo.md",
    "06-riprese-aeree.md",
    "07-troubleshooting.md",
    "08-regole-e-legge.md",
    "09-lista-acquisto-definitiva.md",
]

# Le emoji non sono renderizzabili dai font core PDF: le rimuoviamo per pulizia.
EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\U00002600-\U000027BF\U0001F1E6-\U0001F1FF"
    "\U00002190-\U000021FF\U00002B00-\U00002BFF\U0000FE0F\U000020E3]",
    flags=re.UNICODE,
)

def clean(md: str) -> str:
    # Rimuove emoji e collega i link relativi tra capitoli (li trasformiamo in testo)
    md = EMOJI.sub("", md)
    # link interni tra capitoli .md -> rimuovi (restano come testo del link)
    md = re.sub(r"\[([^\]]+)\]\((?:\./)?\d[\w\-]*\.md\)", r"\1", md)
    md = re.sub(r"\[([^\]]+)\]\(README\.md\)", r"\1", md)
    md = re.sub(r"\[([^\]]+)\]\(bom\.csv\)", r"\1", md)
    return md

parts = []
for i, name in enumerate(FILES):
    text = clean((DRONE / name).read_text(encoding="utf-8"))
    html = markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists"])
    pb = ' style="page-break-before: always;"' if i else ''
    parts.append(f'<section{pb}>{html}</section>')

CSS = """
@page { size: A4; margin: 1.8cm 1.6cm; }
body { font-family: Helvetica, Arial, sans-serif; font-size: 10.5pt; color: #1a1a1a; line-height: 1.45; }
h1 { font-size: 19pt; color: #0b5394; border-bottom: 2px solid #0b5394; padding-bottom: 4px; margin-top: 4px; }
h2 { font-size: 14pt; color: #0b5394; margin-top: 16px; }
h3 { font-size: 11.5pt; color: #333; margin-top: 12px; }
p, li { font-size: 10.5pt; }
a { color: #1155cc; text-decoration: none; }
code { font-family: Courier, monospace; background: #f2f2f2; font-size: 9pt; }
pre { background: #f5f5f5; border: 1px solid #ddd; padding: 8px; font-size: 8.5pt;
      font-family: Courier, monospace; white-space: pre-wrap; }
blockquote { border-left: 3px solid #0b5394; background: #eef4fb; margin: 8px 0;
             padding: 6px 10px; color: #222; }
table { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 8.8pt; }
th, td { border: 1px solid #bbb; padding: 4px 6px; text-align: left; vertical-align: top; }
th { background: #0b5394; color: #fff; }
tr:nth-child(even) td { background: #f4f7fb; }
hr { border: none; border-top: 1px solid #ccc; margin: 14px 0; }
"""

COVER = """
<div style="text-align:center; padding-top:170px;">
  <div style="font-size:30pt; color:#0b5394; font-weight:bold;">Guida Drone FAI-DA-TE</div>
  <div style="font-size:15pt; color:#444; margin-top:10px;">Progetta e costruisci un quadricottero 5" per riprese e divertimento</div>
  <div style="font-size:11pt; color:#666; margin-top:28px;">Profilo: principiante &middot; budget ~150-300&euro; &middot; uso ibrido</div>
  <div style="font-size:10pt; color:#888; margin-top:120px;">Guida divulgativa - verifica sempre prezzi e normative aggiornate</div>
</div>
"""

doc = f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{COVER}{''.join(parts)}</body></html>"

with open(OUT, "wb") as f:
    res = pisa.CreatePDF(doc, dest=f, encoding="utf-8")

print("ERRORE" if res.err else f"OK -> {OUT}")
