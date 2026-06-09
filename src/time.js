/** Utility per gestire orari in formato "HH:MM" come minuti dalla mezzanotte. */

export function toMinutes(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm).trim());
  if (!m) throw new Error(`Orario non valido: "${hhmm}" (atteso "HH:MM")`);
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new Error(`Orario fuori range: "${hhmm}"`);
  return h * 60 + min;
}

export function fromMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** True se il minuto `t` è contenuto in uno degli intervalli [start, end]. */
export function within(t, intervals = []) {
  return intervals.some(([start, end]) => t >= toMinutes(start) && t <= toMinutes(end));
}

/**
 * Una persona è disponibile a un certo orario in un certo giorno se:
 * - ha definito intervalli 'available' per quel giorno → l'orario deve cadere dentro;
 * - altrimenti, se ha 'work' per quel giorno → l'orario NON deve cadere dentro;
 * - altrimenti → assunta disponibile.
 */
export function isAvailableAt(availability, day, hhmm) {
  if (!availability) return true;
  const t = toMinutes(hhmm);
  if (availability.available && availability.available[day] !== undefined) {
    return within(t, availability.available[day]);
  }
  if (availability.work && availability.work[day] !== undefined) {
    return !within(t, availability.work[day]);
  }
  return true;
}
