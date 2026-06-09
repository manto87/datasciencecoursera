import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const DAY_LABELS_IT = {
  mon: "Lunedì",
  tue: "Martedì",
  wed: "Mercoledì",
  thu: "Giovedì",
  fri: "Venerdì",
  sat: "Sabato",
  sun: "Domenica",
};

/**
 * Carica la configurazione della famiglia.
 * Cerca prima il file indicato da FAMILY_CONFIG, poi data/family.json,
 * infine il file di esempio data/family.example.json.
 */
export function loadConfig(customPath) {
  const candidates = [
    customPath,
    process.env.FAMILY_CONFIG,
    join(ROOT, "data", "family.json"),
    join(ROOT, "data", "family.example.json"),
  ].filter(Boolean);

  const path = candidates.find((p) => existsSync(p));
  if (!path) {
    throw new Error(
      "Nessun file di configurazione trovato. Crea data/family.json (vedi data/family.example.json)."
    );
  }

  const raw = readFileSync(path, "utf8");
  let config;
  try {
    config = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Configurazione non valida (${path}): ${err.message}`);
  }

  validateConfig(config, path);
  config._sourcePath = path;
  return config;
}

function validateConfig(config, path) {
  const errors = [];
  if (!config.people || Object.keys(config.people).length === 0) {
    errors.push("manca la sezione 'people'");
  }
  if (!config.children || Object.keys(config.children).length === 0) {
    errors.push("manca la sezione 'children'");
  }
  for (const [id, person] of Object.entries(config.people || {})) {
    if (!person.name) errors.push(`la persona '${id}' non ha 'name'`);
    if (!person.role) errors.push(`la persona '${id}' non ha 'role'`);
  }
  if (errors.length) {
    throw new Error(`Configurazione non valida (${path}):\n - ${errors.join("\n - ")}`);
  }
}

export { ROOT };
