# 👨‍👩‍👧‍👦 Family Schedule Reminders

App per **pianificare la settimana della famiglia** e inviare **reminder WhatsApp giornalieri**.
Gestisce gli orari di scuola e doposcuola dei figli, gli orari di lavoro dei genitori e la
disponibilità dei nonni, e calcola automaticamente **chi accompagna e chi ritira** ogni giorno,
segnalando i **buchi** (momenti in cui nessuno è disponibile).

## Cosa fa

- 🗓️ **Orari ricorrenti settimanali** — definisci una "settimana tipo" in un file di configurazione.
- 📲 **Reminder WhatsApp giornalieri** — ogni mattina ognuno riceve la sua parte di impegni (via Twilio).
- 🚨 **Alert su buchi e conflitti** — se nessuno può accompagnare/ritirare, l'app lo segnala ai genitori.
- 👪 **Multi-persona** — messaggi personalizzati per papà, mamma e nonni; i genitori ricevono anche il riepilogo completo.
- 🖥️ **Web UI** — vista settimanale e pulsante per inviare un messaggio di prova.

## Come funziona l'assegnazione

Per ogni figlio e ogni giorno l'app crea due "attività": **accompagnamento** (all'orario di inizio
scuola) e **ritiro** (alla fine del doposcuola, o della scuola se non c'è doposcuola). Per ognuna
sceglie la persona disponibile a quell'orario, **preferendo i genitori** e usando i **nonni come
ripiego**. Se nessuno è disponibile → è un **buco** da coprire.

La disponibilità di ciascuno si esprime in `data/family.json`:
- `work`: gli intervalli in cui la persona **lavora** (quindi NON è disponibile).
- `available`: gli intervalli in cui la persona **è disponibile** (utile per i nonni).

## Setup

### 1. Installa le dipendenze
```bash
npm install
```

### 2. Configura la famiglia
Copia l'esempio e personalizzalo con i tuoi orari e numeri di telefono:
```bash
cp data/family.example.json data/family.json
```
> `data/family.json` è in `.gitignore` perché contiene numeri di telefono: resta privato.

### 3. Configura Twilio (WhatsApp)
```bash
cp .env.example .env
```
Poi compila `.env`:
- `TWILIO_ACCOUNT_SID` e `TWILIO_AUTH_TOKEN` — dalla [Console Twilio](https://console.twilio.com).
- `TWILIO_WHATSAPP_FROM` — per i test usa il numero della **Sandbox** (`whatsapp:+14155238886`);
  in produzione il tuo numero WhatsApp Business approvato.

**Sandbox (per provare subito):** in Twilio Console → Messaging → Try it out → WhatsApp.
Ogni destinatario deve inviare una volta il messaggio di "join" indicato (es. `join <parola>`)
al numero della sandbox, altrimenti Twilio non può scrivergli.

### 4. Prova senza inviare davvero
```bash
DRY_RUN=1 npm run plan:week     # stampa il piano della settimana
DRY_RUN=1 npm run send:today    # mostra i messaggi senza inviarli
```

### 5. Avvia l'app
```bash
npm start
```
Apri http://localhost:3000 per la web UI. Lo scheduler invia i reminder ogni giorno
all'orario indicato in `reminderTime` (fuso `timezone`).

## Comandi utili

| Comando | Cosa fa |
|---|---|
| `npm start` | Avvia web UI + scheduler giornaliero |
| `npm run plan:week` | Stampa il piano settimanale e il numero di buchi |
| `npm run send:today` | Invia (o simula con `DRY_RUN=1`) i reminder di oggi |
| `npm run send:tomorrow` | Idem per domani |
| `node src/cli.js send mon` | Invia i reminder di un giorno specifico (`mon`..`sun`) |
| `npm test` | Esegue i test |

## API (web)

- `GET /api/week` — piano settimanale calcolato
- `GET /api/day/:day` — piano di un singolo giorno (`mon`..`sun`)
- `GET /api/config` / `PUT /api/config` — leggi/salva la configurazione
- `POST /api/send?when=today` — invio manuale (utile per test)
- `GET /api/health` — stato del servizio

## Deploy su cloud (Railway / Fly.io)

Questo ambiente è temporaneo: per l'invio automatico giornaliero serve un hosting sempre attivo.

### Railway
1. Crea un nuovo progetto e collega questo repository.
2. Railway rileva Node.js e usa il `Procfile` (`web: node src/index.js`).
3. Imposta le variabili d'ambiente (`TWILIO_*`, eventualmente `FAMILY_CONFIG`).
4. Per mantenere privata la configurazione su cloud puoi montare un volume e puntarci con
   `FAMILY_CONFIG=/data/family.json`, oppure committare `data/family.json` solo in un repo privato.

### Fly.io
1. `fly launch` (genera la config), poi `fly secrets set TWILIO_ACCOUNT_SID=... TWILIO_AUTH_TOKEN=... TWILIO_WHATSAPP_FROM=...`.
2. `fly deploy`.

> Lo scheduler interno (`node-cron`) gira finché il processo è attivo. Se preferisci uno scheduler
> esterno (es. cron del provider) imposta `DISABLE_SCHEDULER=1` e lancia `node src/cli.js send today`
> all'orario voluto.

## Struttura

```
src/
  config.js     caricamento/validazione configurazione
  time.js       utilità orari e calcolo disponibilità
  planner.js    motore: assegnazioni + rilevamento buchi
  messages.js   formattazione messaggi WhatsApp
  whatsapp.js   invio via Twilio (con DRY_RUN)
  send.js       orchestrazione invio per un giorno
  scheduler.js  job giornaliero (node-cron)
  server.js     web server + API
  cli.js        comandi da terminale
  index.js      entry point (web + scheduler)
public/         web UI
data/           configurazione (family.example.json)
test/           test
```
