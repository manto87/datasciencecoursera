import { test } from "node:test";
import assert from "node:assert/strict";

import { planDay, planWeek } from "../src/planner.js";
import { isAvailableAt, toMinutes, within } from "../src/time.js";
import { buildDailyMessages, messageForPerson } from "../src/messages.js";

const config = {
  timezone: "Europe/Rome",
  preferenceOrder: ["mamma", "papa", "nonna", "nonno"],
  people: {
    papa: { name: "Papà", role: "parent", phone: "+391" },
    mamma: { name: "Mamma", role: "parent", phone: "+392" },
    nonna: { name: "Nonna", role: "grandparent", phone: "+393" },
  },
  availability: {
    papa: { work: { mon: [["09:00", "18:00"]] } },
    mamma: { work: { mon: [["08:00", "16:00"]] } },
    nonna: { available: { mon: [["07:00", "19:00"]] } },
  },
  children: {
    giulia: {
      name: "Giulia",
      schedule: {
        mon: { school: ["08:30", "16:30"], afterschool: ["16:30", "17:30"], activity: "Calcio" },
      },
    },
  },
};

test("toMinutes e within", () => {
  assert.equal(toMinutes("08:30"), 510);
  assert.ok(within(toMinutes("09:00"), [["08:00", "16:00"]]));
  assert.ok(!within(toMinutes("17:00"), [["08:00", "16:00"]]));
});

test("isAvailableAt: lavoro vs disponibilità", () => {
  // Mamma lavora 08-16: non disponibile alle 08:30
  assert.equal(isAvailableAt(config.availability.mamma, "mon", "08:30"), false);
  // Nonna disponibile tutto il giorno
  assert.equal(isAvailableAt(config.availability.nonna, "mon", "08:30"), true);
  // Persona senza vincoli → disponibile
  assert.equal(isAvailableAt(undefined, "mon", "08:30"), true);
});

test("planDay assegna drop-off e pickup", () => {
  const plan = planDay(config, "mon");
  assert.equal(plan.tasks.length, 2);

  const dropoff = plan.tasks.find((t) => t.type === "dropoff");
  const pickup = plan.tasks.find((t) => t.type === "pickup");

  // 08:30: papà lavora (09-18 → in realtà libero alle 08:30), mamma lavora (08-16 → occupata).
  // Preferenza genitori: papà è libero alle 08:30 → assegnato papà.
  assert.equal(dropoff.time, "08:30");
  assert.equal(dropoff.assignee, "papa");

  // Pickup 17:30: papà occupato (09-18), mamma libera (dalle 16) → mamma.
  assert.equal(pickup.time, "17:30");
  assert.equal(pickup.assignee, "mamma");
  assert.match(pickup.location, /doposcuola/);
});

test("gap quando nessuno è disponibile", () => {
  const noOne = structuredClone(config);
  // Tutti occupati alle 08:30, nonna non disponibile
  noOne.availability.papa.work.mon = [["00:00", "23:59"]];
  noOne.availability.mamma.work.mon = [["00:00", "23:59"]];
  noOne.availability.nonna.available.mon = [];
  const plan = planDay(noOne, "mon");
  assert.ok(plan.gaps.length >= 1);
  const dropoff = plan.tasks.find((t) => t.type === "dropoff");
  assert.equal(dropoff.assignee, null);
});

test("messaggi: i genitori ricevono il riepilogo, i nonni solo i propri impegni", () => {
  const plan = planDay(config, "mon");
  const msgs = buildDailyMessages(config, plan);
  const papaMsg = msgs.find((m) => m.personId === "papa");
  assert.ok(papaMsg.body.includes("Riepilogo giornata"));

  // Nonna non ha impegni il lunedì in questa config → nessun messaggio
  assert.ok(!msgs.find((m) => m.personId === "nonna"));
});

test("planWeek include solo i giorni con impegni", () => {
  const week = planWeek(config);
  assert.equal(week.length, 1);
  assert.equal(week[0].day, "mon");
});
