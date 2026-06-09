import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync } from "node:fs";

import { loadConfig, ROOT } from "./config.js";
import { planWeek, planDay } from "./planner.js";
import { sendReminders } from "./send.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createServer() {
  const app = express();
  app.use(express.json());
  app.use(express.static(join(__dirname, "..", "public")));

  // Stato/diagnostica
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
  });

  // Configurazione corrente (senza credenziali)
  app.get("/api/config", (_req, res) => {
    try {
      const config = loadConfig();
      res.json(config);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Piano settimanale calcolato
  app.get("/api/week", (_req, res) => {
    try {
      const config = loadConfig();
      res.json({ week: planWeek(config), people: config.people });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Piano di un singolo giorno
  app.get("/api/day/:day", (req, res) => {
    try {
      const config = loadConfig();
      res.json({ plan: planDay(config, req.params.day), people: config.people });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Salva una nuova configurazione su data/family.json
  app.put("/api/config", (req, res) => {
    try {
      const target = process.env.FAMILY_CONFIG || join(ROOT, "data", "family.json");
      writeFileSync(target, JSON.stringify(req.body, null, 2), "utf8");
      res.json({ ok: true, path: target });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Invio manuale (test) — accetta ?when=today|tomorrow|mon..sun
  app.post("/api/send", async (req, res) => {
    try {
      const config = loadConfig();
      const when = req.query.when || req.body?.when || "today";
      const { day, results, note } = await sendReminders(config, when);
      res.json({ day, results, note });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}
