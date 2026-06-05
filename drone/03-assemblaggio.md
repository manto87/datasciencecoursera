# 3 — Assemblaggio passo-passo

Ci siamo: trasformiamo una scatola di pezzi in un drone. Prenditi **una serata
intera senza fretta**. Tieni accanto il [capitolo sicurezza](02-strumenti-e-sicurezza.md).

> 📷 **Consiglio:** scatta una foto a ogni passaggio. Ti servirà per rimontare e
> per chiedere aiuto online se qualcosa non torna.

---

## Panoramica dell'ordine di montaggio

```
1. Telaio (base)      →  4. Camera FPV
2. Motori sui bracci  →  5. VTX (trasmettitore video)
3. Stack FC+ESC       →  6. Ricevitore ELRS
                         7. Connettore batteria + controllo finale
```

---

## Passo 1 — Montare il telaio

1. Avvita la **piastra inferiore** ai 4 bracci e ai distanziali (standoff) M3.
   **Non** chiudere ancora la piastra superiore: ti serve accesso all'interno.
2. Verifica che i bracci siano orientati simmetricamente (configurazione "X").

## Passo 2 — Montare i motori

1. Fissa ogni motore all'estremità del braccio con le **viti corte** in dotazione
   (di solito M3x6 o x8). ⚠️ **Viti troppo lunghe possono bucare gli avvolgimenti
   del motore** e bruciarlo: usa quelle giuste.
2. Fai passare i 3 fili di ogni motore verso il centro, dove ci sarà l'ESC.
3. Per ora **non** saldarli, accorcia i fili alla lunghezza giusta più tardi.

## Passo 3 — Lo stack (ESC + Flight Controller)

> Se hai comprato uno **stack abbinato** (es. SpeedyBee F405 V3), ESC e FC sono
> già fatti per parlarsi: enorme vantaggio.

1. Monta l'**ESC** sui distanziali con le **gomme antivibrazione** (gommini): isolano
   il giroscopio dalle vibrazioni → video più stabile.
2. **Salda i 12 fili dei motori** ai pad dell'ESC (3 per motore). L'ordine dei 3 fili
   per ora non conta: **inverti la direzione via software** in Betaflight (vedi cap. 4).
   Conta invece **quale motore va su quale pad** (M1, M2, M3, M4).
3. Collega l'ESC al **Flight Controller** con il **cavo a nastro** in dotazione
   (o saldando i pad indicati: alimentazione + segnali motori).
4. Monta il FC **sopra** l'ESC, sempre su gommini. **Attenzione alla freccia**
   stampata sul FC: deve puntare **in avanti** (verso il muso del drone).

> 🔌 **Saldature pulite:** ogni giunzione deve essere lucida e bombata, non
> opaca/granulosa. Controlla col multimetro che pad adiacenti **non** siano in
> corto (continuità = problema).

## Passo 4 — Camera FPV

1. Monta la camera nella culla anteriore del telaio, regolando l'inclinazione
   (per ora ~20–30°).
2. Salda i fili secondo lo schema del tuo FC: di solito **Camera → pad "Cam/VIN"**.
   Tipicamente 3 fili: **+ (5V o batteria), − (GND), segnale video**.

## Passo 5 — VTX (trasmettitore video)

1. Salda **alimentazione (+/−)** e **ingresso video** del VTX ai pad del FC.
2. Collega il **filo di controllo (SmartAudio/Tramp)** al pad TX indicato: ti
   permette di cambiare canale/potenza dal radiocomando.
3. **Antenna SEMPRE collegata prima di alimentare:** un VTX acceso senza antenna
   **si brucia**.
4. Fissa il VTX con biadesivo e fascette, lontano da fonti di calore, antenna
   protetta verso l'alto/retro.

## Passo 6 — Ricevitore ELRS

1. Salda **3–4 fili**: **5V, GND, e i pin TX/RX** ai pad UART liberi del FC
   (es. RX1/TX1). Annota **quale UART** hai usato: ti serve nel software.
2. Posiziona le **due antennine a "V"** (90° tra loro), sporgenti dal telaio,
   lontane da carbonio e cavi di potenza.

## Passo 7 — Connettore batteria e controllo finale

1. Salda il **cavo XT60** ai pad di alimentazione principale (**rosso = +, nero = −**).
   ⚠️ **Polarità invertita = scheda morta.** Ricontrolla due volte.
2. Molti ESC includono un **condensatore**: saldalo ai pad batteria (riduce
   disturbi e protegge l'elettronica). Rispetta la polarità (striscia = −).
3. Rimetti i **fili dei motori in ordine**, fascetta tutto, niente cavi vicini alle eliche.
4. **Checklist pre-accensione:**
   - [ ] Nessun corto tra + e − (multimetro)
   - [ ] Freccia del FC verso il muso
   - [ ] Antenna VTX collegata
   - [ ] **ELICHE NON montate**
   - [ ] Saldature lucide e salde

## Passo 8 — Primo "smoke test"

1. **Senza eliche.** Usa lo **smoke stopper** se ce l'hai.
2. Collega la batteria: nessun fumo, nessun fischio, i LED si accendono → 👍
3. Se vedi/senti/odori fumo: **stacca subito** e cerca il corto col multimetro.

🎉 Se i LED si accendono e nulla scotta, hai costruito un drone! Ora va
**configurato**.

➡️ **Prossimo capitolo:** [Configurazione software (Betaflight)](04-configurazione-software.md)
