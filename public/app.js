const ACTION = { dropoff: "Accompagna", pickup: "Ritira" };

async function loadWeek() {
  setStatus("Carico il piano...");
  try {
    const res = await fetch("/api/week");
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    render(data.week, data.people);
    setStatus("");
  } catch (err) {
    setStatus("Errore: " + err.message);
  }
}

function render(week, people) {
  const weekEl = document.getElementById("week");
  const alertsEl = document.getElementById("alerts");
  weekEl.innerHTML = "";
  alertsEl.innerHTML = "";

  const totalGaps = week.reduce((n, d) => n + d.gaps.length, 0);
  if (totalGaps > 0) {
    const div = document.createElement("div");
    div.className = "alert";
    div.innerHTML = `🚨 <strong>${totalGaps}</strong> impegno/i senza nessuno disponibile questa settimana. Controlla i riquadri rossi e coinvolgi i nonni.`;
    alertsEl.appendChild(div);
  }

  for (const day of week) {
    const card = document.createElement("div");
    card.className = "day-card";
    const h3 = document.createElement("h3");
    h3.textContent = day.label;
    card.appendChild(h3);

    for (const t of day.tasks) {
      const el = document.createElement("div");
      el.className = "task";
      const who = t.assignee ? people[t.assignee].name : "⚠️ DA COPRIRE";
      const cls = t.assignee ? "assigned" : "gap";
      el.innerHTML =
        `<div><span class="time">${t.time}</span> · <span class="badge">${ACTION[t.type]}</span></div>` +
        `<div>${t.childName} — ${t.location}</div>` +
        `<div class="who ${cls}">→ ${who}</div>`;
      card.appendChild(el);
    }
    weekEl.appendChild(card);
  }
}

async function sendNow() {
  const when = document.getElementById("when").value;
  setStatus("Invio in corso...");
  try {
    const res = await fetch(`/api/send?when=${when}`, { method: "POST" });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    if (data.note) { setStatus(data.note); return; }
    const ok = data.results.filter((r) => r.ok).length;
    const fail = data.results.length - ok;
    setStatus(`Inviati ${ok} messaggio/i${fail ? `, ${fail} falliti` : ""} (${data.day}).`);
  } catch (err) {
    setStatus("Errore: " + err.message);
  }
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

document.getElementById("refresh").addEventListener("click", loadWeek);
document.getElementById("send").addEventListener("click", sendNow);
loadWeek();
