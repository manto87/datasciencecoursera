# 12 — Config Betaflight di partenza (build AIO cinewhoop)

Configurazione iniziale **su misura** per la build del [capitolo 11](11-piano-rivisto-cinewhoop-acquisti-cina.md):
**SpeedyBee F405 AIO 40A** + motori **GR2004 2550KV** (4S) + eliche **D90** in
condotto + ricevitore **ELRS RP1** + camera **Caddx Ratel 2** + VTX **TX800**.

> 🛑 **PERCHÉ QUI NON TROVI UN `diff all` DA INCOLLARE ALLA CIECA**
> Un `diff all` completo contiene le **mappature resource/timer** (quale pin =
> quale motore/UART) che sono **specifiche della singola scheda e del firmware**.
> Incollare quelle di un'altra scheda **rimappa i motori e le porte** e può far
> partire i motori in modo imprevisto. Quelle mappature **arrivano già corrette
> dal target del firmware**: non vanno toccate.
> Qui trovi quindi: (1) le **impostazioni GUI** specifiche di questa build e
> (2) un **blocco CLI di soli parametri sicuri**, spiegato riga per riga.

> ⚠️ **Prima di tutto, sempre:**
> - 🔌 **ELICHE SMONTATE** per tutta la configurazione.
> - 💾 **Backup:** apri la **CLI**, digita `diff all`, **copia tutto** in un file
>   di testo. È il tuo "punto di ripristino".
> - 🎯 Questa è una **base di partenza**, non oro colato. I **PID di default di
>   Betaflight volano benissimo**: non toccarli finché non hai esperienza.

---

## 12.1 — Firmware e target

1. **Betaflight Configurator** → tab **Firmware Flasher**.
2. **Target:** seleziona quello del **SpeedyBee F405 AIO** (il Configurator
   recente lo **rileva in automatico** collegando la scheda; in alternativa cerca
   il target SpeedyBee corrispondente al tuo modello sulla pagina prodotto
   SpeedyBee). ⚠️ **Non** usare il target dello stack "V3 30x30": è un'altra
   scheda.
3. Flasha l'ultima **release stabile**. (Procedura dettagliata: [cap. 4](04-configurazione-software.md).)

> 🔧 **ESC Bluejay (importante per il cinewhoop):** la F405 AIO 40A monta un ESC
> **BLHeli_S** che con il firmware **Bluejay** abilita il **filtro RPM** — fa una
> differenza enorme sulla fluidità nei condotti. In **BLHeli Suite / Bluejay
> Configurator** verifica che gli ESC abbiano **Bluejay** e imposta **48 kHz**.
> Poi attiva il bidirectional DShot (sotto).

---

## 12.2 — Impostazioni GUI (specifiche di questa build)

> Ricorda la regola dell'incrocio del [cap. 10](10-cablaggio-speedybee-f405v3.md):
> ricevitore su **UART1** (R1/T1). Se hai saldato su un altro UART, configura quello.

### Tab **Ports**
- Sull'**UART del ricevitore** (es. **UART1**): attiva **Serial RX**.
- Sull'**UART dello SmartAudio** del VTX (es. **UART2 TX**): imposta **Peripherals → TBS SmartAudio**.

### Tab **Configuration**
- **Receiver:** *Serial-based receiver* → provider **CRSF** (è ExpressLRS).
- **ESC/Motor protocol:** **DShot300** (ideale per BLHeli_S su AIO piccolo).
- **Bidirectional DShot:** **ON** (serve per il filtro RPM — richiede ESC Bluejay).
- **Motor poles:** **14** (i GR2004 sono 12N**14**P).
- **Craft name:** es. `CINEWHOOP-DIY`.
- Lascia **Airmode** gestito dallo stick/arm di default.

### Tab **Receiver**
- **Bind** ELRS (procedura della radio Pocket) → muovendo gli stick le barre
  Roll/Pitch/Yaw/Throttle si muovono.
- Channel map tipica ELRS: **AETR**.

### Tab **Modes** (gli interruttori)
- **ARM** → un interruttore dedicato.
- **ANGLE** (auto-livellante) → assegnalo: per iniziare voli **sempre** in Angle.
- **BEEPER** → utile per ritrovare il drone.
- (Più avanti) un interruttore per passare **Angle ↔ Acro**.

### Tab **VTX (SmartAudio)**
- Banda/canale a piacere; **potenza 25 mW per i test** ravvicinati (vedi
  [cap. 8 – regole](08-regole-e-legge.md)). Antenna **sempre collegata**.

### Tab **OSD**
- Attiva almeno: **tensione pacco**, **timer**, **potenza VTX**, **RSSI/LQ**
  (qualità link ELRS), **avviso batteria**, **nome craft**.

---

## 12.3 — Blocco CLI di soli parametri (sicuro da incollare)

Apri la tab **CLI** e incolla **questo blocco** (sono **solo `set`/`feature`**,
**nessun `resource`/`timer`**: non rimappa nulla). Poi digita `save`.

> 📋 Le righe con `#` sono commenti esplicativi: puoi incollarle, Betaflight le ignora.

```bash
# ====== BUILD: SpeedyBee F405 AIO 40A - Cinewhoop 3.5" 4S ======
# (incollare in CLI, poi: save)  -- ELICHE SMONTATE

# --- Identità ---
set name = CINEWHOOP-DIY

# --- Motori / ESC (BLHeli_S Bluejay) ---
set motor_pwm_protocol = DSHOT300
set dshot_bidir = ON            # filtro RPM (richiede ESC Bluejay)
set motor_poles = 14            # GR2004 = 14 poli (per RPM corretto)
set motor_output_reordering = # (NON toccare: lascia il default del target)

# --- Idle motori: un filo piu' alto per il cinewhoop (anti-desync) ---
set dyn_idle_min_rpm = 35       # 35 (x100 = 3500 rpm) tipico per ducted 4S

# --- Batteria 4S (taratura tensioni e capacita') ---
set vbat_max_cell_voltage = 435
set vbat_full_cell_voltage = 410
set vbat_warning_cell_voltage = 350   # avviso "atterra" a 3.5V/cella
set vbat_min_cell_voltage = 330
set battery_capacity = 1100           # mAh del tuo pacco (adatta se diverso)

# --- Sicurezza in volo ---
set failsafe_procedure = DROP   # alla perdita segnale: motori OFF, cade sul posto
set small_angle = 180           # consente l'arming a terra anche se non perfettamente piano

# --- Tornare rapidamente a casa col beeper ---
set beeper_dshot_beacon_tone = 1

# (NB: PID e filtri lasciati ai default di Betaflight: volano benissimo.
#  Il filtro RPM sopra fa gia' la differenza piu' grossa nei condotti.)
```

Dopo `save` la scheda si riavvia. Se incolli e qualcosa dà errore "unknown
command", **non è grave**: significa solo che quel parametro ha un nome diverso
nella tua versione di Betaflight — salta quella riga e impostala dalla GUI.

> ⚠️ **`dyn_idle_min_rpm` vs idle classico:** nelle Betaflight recenti l'idle è
> "dynamic idle" (richiede bidir DShot, che abbiamo attivato). Se la tua versione
> non lo avesse, userai `dshot_idle_value` dalla GUI (parti da ~5,5%).

---

## 12.4 — Rate "cinematic" (volo morbido) — dalla tab PID Tuning → Rates

Per riprese fluide vuoi un drone **meno nervoso**. Nella tab **Rates**:

| Parametro | Valore di partenza | Effetto |
|---|---|---|
| **Rates type** | Actual | più intuitivo (in °/s) |
| **Max vel. Roll/Pitch** | ~**500 °/s** | rotazioni dolci (default ~670 è più nervoso) |
| **Max vel. Yaw** | ~**400 °/s** | imbardata morbida per panoramiche |
| **Center Sensitivity** | ~**150–200** | reattività al centro stick bassa = precisione |
| **Expo** | ~**0.20** | stick centrali ancora più morbidi |

> 🎚️ **Trucco pro:** crea **due rate profile** — uno "cinematic" (valori sopra) e
> uno "fun" (più reattivo) — e passa dall'uno all'altro con un interruttore
> (Modes → Rate Profile). Stessa macchina, due caratteri.

E nella tab **PID Tuning → Filters**: con il **filtro RPM attivo** lascia i
filtri **di default**. Non abbassarli "per istinto": rischi motori caldi.

---

## 12.5 — Throttle e "feel" per il principiante

- **Throttle Limit (tab Rates):** tipo **SCALE**, valore **~85–90%**. Toglie un po'
  di punta (che non ti serve) e rende tutto più gestibile e fluido.
- **Throttle Mid / Expo (tab Receiver):** un leggero expo sul throttle (~0.2) aiuta
  l'hover preciso.

---

## 12.6 — Sequenza di verifica finale (ELICHE ANCORA SMONTATE)

1. Tab **Setup:** muovi il drone → il modellino 3D segue. Se è storto, correggi
   **Board Alignment** (Configuration).
2. Tab **Motors** (spunta sicurezza, **senza eliche**): prova **un motore alla
   volta** → gira il motore giusto (M1=post-dx, M2=ant-dx, M3=post-sx, M4=ant-sx)
   nel **verso** corretto. Correzioni **via software**, mai ri-saldando.
3. **Calibra l'accelerometro** su superficie piana (Setup → Calibrate Accelerometer).
4. Verifica **ARM/ANGLE/BEEPER** dagli interruttori (guarda l'OSD: se non arma, ti
   dice il perché).
5. **Esporta di nuovo** `diff all` → salvalo: è la tua config "buona".

Solo ora monta le eliche (verso **CW/CCW** giusto, ben serrate) e vai al
**[primo volo](05-primo-volo.md)** — dopo esserti allenato al **simulatore**.

---

## 12.7 — Cosa NON fare (errori da principiante)

- ❌ Incollare un `diff all` trovato online di un'**altra** scheda (rimappa tutto).
- ❌ Abbassare i filtri "per ridurre la latenza" senza esperienza → **motori
  bollenti**, rischio incendio.
- ❌ Stravolgere i PID al primo volo. Vola **stock**, capisci come si comporta,
  poi semmai ritocca **un** parametro alla volta.
- ❌ Dimenticare il **failsafe** o l'**antenna VTX**.
- ❌ Volare con la **batteria oltre il limite** inseguendo l'inquadratura.

---

## 12.8 — Per approfondire la messa a punto
- Documentazione ufficiale **Betaflight** (sezioni Rates, Filtering, RPM Filter).
- Guide **Bluejay** per BLHeli_S 48 kHz.
- I tutorial di **Joshua Bardwell** sul tuning per principianti.

⬅️ Torna all'[indice](README.md) · Cablaggio: [cap. 10](10-cablaggio-speedybee-f405v3.md) · Primo volo: [cap. 5](05-primo-volo.md)
