import twilio from "twilio";

let client = null;

function getClient() {
  if (client) return client;
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error(
      "Credenziali Twilio mancanti. Imposta TWILIO_ACCOUNT_SID e TWILIO_AUTH_TOKEN."
    );
  }
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  return client;
}

function fromNumber() {
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!from) {
    throw new Error(
      "TWILIO_WHATSAPP_FROM mancante (es. 'whatsapp:+14155238886' per la sandbox)."
    );
  }
  return from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;
}

function toWhatsApp(phone) {
  return phone.startsWith("whatsapp:") ? phone : `whatsapp:${phone}`;
}

/**
 * Invia un messaggio WhatsApp. In modalità DRY_RUN (o senza credenziali in test)
 * non invia nulla ma logga il contenuto, così è sicuro da provare.
 */
export async function sendWhatsApp({ to, body }) {
  if (process.env.DRY_RUN === "1") {
    console.log(`\n[DRY_RUN] WhatsApp → ${to}\n${body}\n`);
    return { dryRun: true, to };
  }
  const msg = await getClient().messages.create({
    from: fromNumber(),
    to: toWhatsApp(to),
    body,
  });
  return { sid: msg.sid, to };
}

/** Invia una lista di messaggi { phone, body, name } in sequenza, raccogliendo gli esiti. */
export async function sendAll(messages) {
  const results = [];
  for (const m of messages) {
    try {
      const res = await sendWhatsApp({ to: m.phone, body: m.body });
      results.push({ ...res, name: m.name, ok: true });
    } catch (err) {
      results.push({ to: m.phone, name: m.name, ok: false, error: err.message });
    }
  }
  return results;
}
