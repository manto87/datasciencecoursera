import cron from "node-cron";
import { sendReminders } from "./send.js";

/**
 * Avvia il job giornaliero che invia i reminder all'orario indicato in config.reminderTime
 * nel fuso orario della famiglia.
 */
export function startScheduler(config) {
  const [hh, mm] = (config.reminderTime || "07:00").split(":");
  const expr = `${Number(mm)} ${Number(hh)} * * *`;
  const tz = config.timezone || "Europe/Rome";

  const task = cron.schedule(
    expr,
    async () => {
      console.log(`[${new Date().toISOString()}] Esecuzione reminder giornaliero...`);
      try {
        const { results, note } = await sendReminders(config, "today");
        if (note) console.log(note);
        for (const r of results) {
          console.log(r.ok ? `  ✓ ${r.name}` : `  ✗ ${r.name}: ${r.error}`);
        }
      } catch (err) {
        console.error("Errore nell'invio dei reminder:", err.message);
      }
    },
    { timezone: tz }
  );

  console.log(`Scheduler attivo: reminder ogni giorno alle ${config.reminderTime || "07:00"} (${tz}).`);
  return task;
}
