# 4 — Configurazione software (Betaflight)

Il drone ha un cervello, ma va "istruito". Useremo **Betaflight**, il software
gratuito e standard per i droni FPV. È la parte che spaventa di più i
principianti, ma seguendo l'ordine giusto è solo una serie di clic.

> 🧰 **Cosa ti serve:** un PC, il **Betaflight Configurator** (app/estensione
> gratuita), un **cavo USB** dato, e il drone **SENZA ELICHE**.

---

## 4.1 — Installazione

1. Scarica **Betaflight Configurator** dal sito ufficiale di Betaflight.
2. (Windows) installa i driver **Zadig/Impulse RC Driver Fixer** se il PC non
   riconosce il FC.
3. Collega il drone via USB → in alto a destra clicca **Connect**.

> Se non si connette: prova un altro cavo (molti cavi sono "solo carica"), e
> controlla i driver. È il problema #1 dei principianti.

---

## 4.2 — Aggiornare il firmware (flash)

1. Tab **Firmware Flasher**.
2. Seleziona il **target esatto** del tuo FC (es. `SPEEDYBEEF405V3`). Sbagliare
   target può rendere il FC non rispondente: controlla bene la sigla.
3. Flash dell'ultima versione **stabile**. Attendi senza scollegare.

---

## 4.3 — Ordine di configurazione (segui questa sequenza!)

### 1) Tab **Setup** — orientamento
- Solleva e ruota il drone: il modellino 3D deve muoversi **uguale**.
- Se è capovolto o storto, sistemerai l'orientamento nella tab Configuration
  (parametro "Board and Sensor Alignment").

### 2) Tab **Ports** — abilita la radio
- Abilita **Serial RX** sull'UART **a cui hai saldato il ricevitore** (cap. 3, passo 6).
- Abilita la porta **peripheral** per il VTX se usi SmartAudio (TX dell'UART scelto).

### 3) Tab **Configuration**
- **Receiver:** modalità **Serial-based**, provider **CRSF** (è quello di ExpressLRS).
- Imposta **ESC/Motor Protocol:** di norma **DSHOT600**.
- Attiva, se vuoi, **Motor Stop** (i motori si fermano quando l'acceleratore è a zero — più sicuro da fermi).

### 4) Tab **Receiver** — verifica i comandi
- Accendi il radiocomando e **abbinalo (bind)** al ricevitore (procedura ELRS:
  di solito 3 accensioni rapide o tramite Lua script — vedi manuale radio).
- Muovi gli stick: le barre **Roll / Pitch / Yaw / Throttle** devono muoversi.
- Verifica i **canali AUX** per gli interruttori (ti servono per "arm" e modalità di volo).

### 5) Tab **Modes** — gli interruttori
- **ARM:** assegna un interruttore. ⚠️ Questo "arma" i motori: **gestiscilo con
  rispetto**, sempre senza eliche durante i test.
- **Angle (Self-Level):** assegna una modalità **auto-livellante** — perfetta per
  iniziare: il drone si rimette dritto da solo quando lasci gli stick.
- (Opzionale) **Beeper** su un interruttore per ritrovare il drone se cade.

### 6) Tab **Motors** — direzione e ordine ⚠️
> **ELICHE RIMOSSE. Sempre.**
- Spunta la casella di sicurezza, alza **un motore alla volta** col cursore.
- Verifica che giri il **motore giusto** (M1, M2, M3, M4 nelle posizioni corrette)
  e nel **verso giusto** (schema "props in" o "props out").
- Versi/posizioni sbagliati si correggono **via software** (Betaflight Configurator
  → riordino motori, o BLHeli Suite per invertire il senso). **Non** ri-saldare.

### 7) Tab **Video Transmitter** (se SmartAudio)
- Imposta banda, canale e **potenza** (in Italia rispetta i limiti — vedi
  [capitolo 8](08-regole-e-legge.md)). Parti con potenza bassa (25 mW) per i test ravvicinati.

### 8) Tab **OSD**
- Attiva le info a schermo: **tensione batteria** (la più importante!), timer,
  potenza VTX, indicatore RSSI (qualità segnale radio).

---

## 4.4 — Sicurezza nel software (failsafe)

> Il **failsafe** è ciò che il drone fa se perde il segnale radio. **Configuralo
> sempre.**

- Tab **Failsafe:** imposta **Drop / Motori OFF** (il drone "si spegne" e cade
  sul posto invece di volare via incontrollato). Per un principiante è la scelta
  più sicura.
- Imposta gli **allarmi di batteria scarica** (es. avviso a 3.5 V/cella) nella
  tab Power & Battery → così atterri prima di rovinare la LiPo.

---

## 4.5 — Salva sempre

Ogni tab ha **Save and Reboot**. Salva spesso. Quando tutto funziona, esporta
un **backup** della configurazione (CLI → comando `diff all` → copia il testo in
un file di testo). Ti salverà la vita se devi riconfigurare.

✅ A questo punto il drone risponde ai comandi, conosce il suo orientamento, ha
un failsafe e mostra la batteria a schermo. **Pronti al collaudo.**

➡️ **Prossimo capitolo:** [Primo volo e collaudo](05-primo-volo.md)
