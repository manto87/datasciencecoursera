import "dotenv/config";
import { loadConfig } from "./config.js";
import { planWeek } from "./planner.js";
import { weekSummary } from "./messages.js";
import { sendReminders } from "./send.js";

const [, , command, arg] = process.argv;

async function main() {
  const config = loadConfig();

  switch (command) {
    case "send": {
      const when = arg || "today";
      const { day, results, note } = await sendReminders(config, when);
      console.log(`Reminder per "${when}" (${day}).`);
      if (note) console.log(note);
      for (const r of results) {
        console.log(r.ok ? `  ✓ ${r.name} (${r.to})${r.dryRun ? " [dry-run]" : ""}` : `  ✗ ${r.name}: ${r.error}`);
      }
      break;
    }
    case "plan": {
      const week = planWeek(config);
      console.log(weekSummary(config, week));
      const totalGaps = week.reduce((n, d) => n + d.gaps.length, 0);
      console.log(`\nBuchi da coprire nella settimana: ${totalGaps}`);
      break;
    }
    default:
      console.log("Uso: node src/cli.js <send [today|tomorrow|mon..sun] | plan week>");
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("Errore:", err.message);
  process.exit(1);
});
