import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

import { DAYS } from "./config.js";
import { planDay } from "./planner.js";
import { buildDailyMessages } from "./messages.js";
import { sendAll } from "./whatsapp.js";

dayjs.extend(utc);
dayjs.extend(timezone);

/** Converte una data in chiave giorno ("mon".."sun") nel fuso della famiglia. */
export function dayKeyFor(config, when = "today") {
  const tz = config.timezone || "Europe/Rome";
  let d = dayjs().tz(tz);
  if (when === "tomorrow") d = d.add(1, "day");
  // dayjs: 0 = domenica ... 6 = sabato
  const map = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[d.day()];
}

/**
 * Pianifica e invia i reminder per un giorno ("today"/"tomorrow"/"mon"..."sun").
 */
export async function sendReminders(config, when = "today") {
  const day = DAYS.includes(when) ? when : dayKeyFor(config, when);
  const plan = planDay(config, day);
  const messages = buildDailyMessages(config, plan);

  if (!messages.length) {
    return { day, plan, messages: [], results: [], note: "Nessun impegno per questo giorno." };
  }

  const results = await sendAll(messages);
  return { day, plan, messages, results };
}
