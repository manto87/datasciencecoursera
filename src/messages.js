import { tasksByPerson } from "./planner.js";

const ACTION = { dropoff: "accompagna", pickup: "ritira" };
const ACTION_NOUN = { dropoff: "Accompagnamento", pickup: "Ritiro" };

/**
 * Costruisce il messaggio personale per una persona, relativo a un giorno pianificato.
 * Ritorna null se la persona non ha impegni e non ci sono buchi da segnalare ai genitori.
 */
export function messageForPerson(config, plan, personId) {
  const person = config.people[personId];
  if (!person) return null;

  const byPerson = tasksByPerson(plan);
  const myTasks = byPerson[personId] || [];
  const isParent = person.role === "parent";

  const lines = [];
  lines.push(`👨‍👩‍👧‍👦 *Piano famiglia — ${plan.label}*`);
  lines.push(`Ciao ${person.name}!`);
  lines.push("");

  if (myTasks.length) {
    lines.push("📋 *I tuoi impegni:*");
    for (const t of myTasks) {
      lines.push(`• ${t.time} — ${ACTION[t.type]} ${t.childName} (${t.location})`);
    }
  } else {
    lines.push("📋 Oggi non hai accompagnamenti/ritiri assegnati.");
  }

  // I genitori vedono il quadro completo della giornata e gli eventuali buchi.
  if (isParent) {
    lines.push("");
    lines.push("🗓️ *Riepilogo giornata:*");
    for (const t of plan.tasks) {
      const who = t.assignee ? config.people[t.assignee].name : "⚠️ DA COPRIRE";
      lines.push(`• ${t.time} — ${ACTION_NOUN[t.type]} ${t.childName} (${t.location}) → ${who}`);
    }

    if (plan.gaps.length) {
      lines.push("");
      lines.push("🚨 *Attenzione, buchi da coprire:*");
      for (const g of plan.gaps) {
        lines.push(`• ${g.time} — ${ACTION_NOUN[g.type]} ${g.childName} (${g.location})`);
      }
      lines.push("→ Nessuno risulta disponibile: organizzatevi o chiedete ai nonni.");
    }
  }

  return lines.join("\n");
}

/** Genera i messaggi per tutti i destinatari che hanno qualcosa da ricevere. */
export function buildDailyMessages(config, plan) {
  const out = [];
  for (const [personId, person] of Object.entries(config.people)) {
    if (!person.phone) continue;
    const byPerson = tasksByPerson(plan);
    const hasTasks = (byPerson[personId] || []).length > 0;
    const isParent = person.role === "parent";
    // Invia ai genitori sempre (riepilogo + alert); ai nonni solo se hanno impegni.
    if (!isParent && !hasTasks) continue;
    const body = messageForPerson(config, plan, personId);
    if (body) out.push({ personId, name: person.name, phone: person.phone, body });
  }
  return out;
}

/** Sintesi testuale della settimana, utile per la CLI e la web UI. */
export function weekSummary(config, week) {
  const lines = [];
  for (const plan of week) {
    lines.push(`\n=== ${plan.label} ===`);
    for (const t of plan.tasks) {
      const who = t.assignee ? config.people[t.assignee].name : "⚠️ DA COPRIRE";
      lines.push(`  ${t.time}  ${ACTION_NOUN[t.type].padEnd(15)} ${t.childName.padEnd(10)} ${t.location.padEnd(22)} → ${who}`);
    }
  }
  return lines.join("\n");
}
