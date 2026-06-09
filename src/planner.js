import { DAYS, DAY_LABELS_IT } from "./config.js";
import { isAvailableAt } from "./time.js";

/**
 * Calcola tutte le "attività" (accompagnamento e ritiro) per un dato giorno,
 * assegnando a ciascuna la persona più adatta secondo l'ordine di preferenza.
 *
 * Ritorna { day, label, tasks: [...], gaps: [...] }
 * Ogni task: { childId, childName, type: "dropoff"|"pickup", time, location, assignee, candidates }
 * Un gap è un task senza nessun assegnatario disponibile.
 */
export function planDay(config, day) {
  const tasks = [];
  const order = preferenceOrder(config);

  for (const [childId, child] of Object.entries(config.children)) {
    const dayPlan = child.schedule?.[day];
    if (!dayPlan || !dayPlan.school) continue;

    const [schoolStart, schoolEnd] = dayPlan.school;

    // Accompagnamento a scuola
    tasks.push(buildTask(config, order, day, {
      childId,
      childName: child.name,
      type: "dropoff",
      time: schoolStart,
      location: "scuola",
    }));

    // Ritiro: dal doposcuola se presente, altrimenti da scuola
    const after = dayPlan.afterschool;
    const pickupTime = after ? after[1] : schoolEnd;
    const pickupLocation = after
      ? `doposcuola${dayPlan.activity ? ` (${dayPlan.activity})` : ""}`
      : "scuola";

    tasks.push(buildTask(config, order, day, {
      childId,
      childName: child.name,
      type: "pickup",
      time: pickupTime,
      location: pickupLocation,
    }));
  }

  tasks.sort((a, b) => a.time.localeCompare(b.time));
  const gaps = tasks.filter((t) => !t.assignee);

  return { day, label: DAY_LABELS_IT[day], tasks, gaps };
}

function buildTask(config, order, day, task) {
  const candidates = order.filter((id) =>
    isAvailableAt(config.availability?.[id], day, task.time)
  );

  // Preferisci i genitori; usa i nonni solo se nessun genitore è disponibile.
  const parents = candidates.filter((id) => config.people[id]?.role === "parent");
  const assignee = (parents[0] ?? candidates[0]) ?? null;

  return { ...task, candidates, assignee };
}

/** Ordine di preferenza: usa config.preferenceOrder, completato con eventuali persone mancanti. */
function preferenceOrder(config) {
  const all = Object.keys(config.people);
  const pref = (config.preferenceOrder || []).filter((id) => all.includes(id));
  return [...pref, ...all.filter((id) => !pref.includes(id))];
}

/** Pianifica l'intera settimana (lun-dom). */
export function planWeek(config) {
  return DAYS.map((day) => planDay(config, day)).filter((d) => d.tasks.length > 0);
}

/** Raggruppa i task di un giorno per persona assegnata. */
export function tasksByPerson(plan) {
  const map = {};
  for (const task of plan.tasks) {
    if (!task.assignee) continue;
    (map[task.assignee] ??= []).push(task);
  }
  return map;
}
