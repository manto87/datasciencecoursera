import "dotenv/config";
import { loadConfig } from "./config.js";
import { createServer } from "./server.js";
import { startScheduler } from "./scheduler.js";

const config = loadConfig();
const app = createServer();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Family Schedule Reminders in ascolto su http://localhost:${port}`);
  console.log(`Configurazione: ${config._sourcePath}`);
  if (process.env.DRY_RUN === "1") {
    console.log("⚠️  DRY_RUN attivo: i messaggi WhatsApp NON vengono inviati davvero.");
  }
});

// Avvia l'invio automatico giornaliero (disattivabile con DISABLE_SCHEDULER=1)
if (process.env.DISABLE_SCHEDULER !== "1") {
  startScheduler(config);
}
