# 10 — Schema di cablaggio pad-per-pad (SpeedyBee F405 V3)

Questo capitolo ti dice **dove saldare ogni filo** sullo stack SpeedyBee F405 V3
(FC + ESC 50A). È la mappa che useremo durante l'[assemblaggio](03-assemblaggio.md).

> ⚠️ **VERIFICA SEMPRE SULLA TUA SCHEDA.** Le sigle qui sotto seguono la
> serigrafia standard del SpeedyBee F405 V3, ma SpeedyBee aggiorna i layout. Prima
> di saldare, **leggi le scritte stampate accanto ai pad** e tieni aperto il
> **manuale ufficiale** (incluso nella scatola; in PDF "SpeedyBee F405 V3 Stack
> Manual"). Se un'etichetta non corrisponde, **vince la serigrafia della scheda**.

> 🔌 **Regola d'oro UART:** un dispositivo "seriale" (ricevitore, SmartAudio) si
> collega **incrociato**: il **TX** del dispositivo va sull'**RX** della FC e
> viceversa. L'alimentazione (5V/GND) invece va dritta.

---

## 10.1 — La buona notizia: FC ↔ ESC è plug-and-play

Lo stack include un **cavo a 8 pin** già pronto: collega la Flight Controller
all'ESC **senza saldare nulla**. Innesta il connettore da una parte e dall'altra,
rispettando il verso (è polarizzato). Quel cavo porta da solo: i 4 segnali motore,
**VBAT** (tensione batteria per la FC), **corrente** (per l'amperometro) e **GND**.

➡️ Quindi tu salderai **solo**: i **motori** sull'ESC, la **batteria** sull'ESC, e
**camera/VTX/ricevitore** sulla FC.

---

## 10.2 — Mappa generale (vista dall'alto)

```
                       MUSO (freccia FC in avanti)
                              ▲
        ┌─────────────────────────────────────────┐
   M4   │ FRONT-LEFT                  FRONT-RIGHT  │  M2
  (FL)  │      o                            o      │ (FR)
        │            ┌───────────────┐            │
        │            │   STACK FC+ESC │            │
        │   CAM →    │   (cavo 8 pin  │   → VTX    │
        │   RX  →    │   tra FC e ESC)│   → 5V/9V  │
        │            └───────────────┘            │
        │      o                            o      │
   M3   │ REAR-LEFT                    REAR-RIGHT  │  M1
  (RL)  │                                          │ (RR)
        └─────────────────────────────────────────┘
                    [ XT60 → B+ / B- sull'ESC ]
```

**Numerazione motori (default Betaflight, quad-X "props out"):**

| Motore | Posizione |
|---|---|
| **M1** | posteriore destro (rear-right) |
| **M2** | anteriore destro (front-right) |
| **M3** | posteriore sinistro (rear-left) |
| **M4** | anteriore sinistro (front-left) |

> ✅ Non ti preoccupare se sbagli l'abbinamento o il verso: **si correggono via
> software** nella tab **Motors** di Betaflight ([cap. 4](04-configurazione-software.md)),
> senza ri-saldare.

---

## 10.3 — ESC: motori + batteria (gli unici due saldaggi "di potenza")

### Motori → ESC
Ogni angolo dell'ESC ha **3 pad** (i 3 fili di un motore). Salda i 3 fili di ogni
motore sui 3 pad dell'angolo corrispondente alla sua posizione (M1…M4 come tabella sopra).

```
   ESC (4-in-1) — angoli con 3 pad ciascuno
   ┌───────────────────────────────────┐
   │ (M4) o o o            o o o (M2)   │
   │                                   │
   │            B+  ◎   ◎  B-           │  ← pad batteria + condensatore
   │                                   │
   │ (M3) o o o            o o o (M1)   │
   └───────────────────────────────────┘
```

- **L'ordine dei 3 fili non conta:** il senso di rotazione si inverte via software.
- Conta **quale motore su quale angolo** (M1–M4).

### Batteria (XT60) → ESC
- **Filo ROSSO → B+** (a volte etichettato `BAT+` o `VBAT`)
- **Filo NERO → B-** (a volte `GND`)
- **Condensatore** in dotazione saldato sugli stessi pad B+/B-: rispetta la
  polarità → la **striscia/banda sul condensatore = negativo (B-)**.

> ⚠️ **Polarità invertita = scheda bruciata.** Ricontrolla due volte. Usa lo
> **smoke stopper** al primo collegamento.

---

## 10.4 — FC: ricevitore ELRS (RadioMaster RP1)

L'ELRS parla **CRSF**, che è seriale e usa **TX + RX**: servono 4 fili.

| Filo dal ricevitore RP1 | Pad sulla FC |
|---|---|
| 5V (VCC) | **5V** |
| GND | **G** (GND) |
| **TX** (del ricevitore) | **R1** (RX1) ← *incrociato* |
| **RX** (del ricevitore) | **T1** (TX1) ← *incrociato* |

> Useremo **UART1 (R1/T1)**. In Betaflight → **Ports**: abilita **Serial RX** su
> UART1; in **Configuration** → Receiver: **Serial / CRSF** (vedi
> [cap. 4](04-configurazione-software.md)). Se UART1 fosse occupato, va bene
> qualsiasi altro UART completo (es. UART3 R3/T3): basta abilitarlo lì.

```
   RP1:  [5V] [GND] [TX] [RX]
            │    │     │    │
   FC:    [5V] [ G ] [R1] [T1]   (TX→R1, RX→T1 = incrocio)
```

Posiziona le **due antenne** del ricevitore a **"V" (90°)**, sporgenti dal telaio,
lontane da carbonio e cavi di potenza.

---

## 10.5 — FC: camera FPV (Caddx Ratel)

3 fili, dritti (nessun incrocio):

| Filo dalla camera | Pad sulla FC |
|---|---|
| Alimentazione (VCC) | **5V** |
| GND | **G** |
| Video OUT | **CAM** (ingresso video della FC) |

> La Caddx Ratel si alimenta a 5V → pad **5V**. Alcune camere accettano un range
> più ampio: in dubbio, **5V** è quasi sempre sicuro. Il filo dati extra (OSD/menu
> camera) è opzionale e non serve per volare.

---

## 10.6 — FC: trasmettitore video (SpeedyBee TX800)

Il VTX vuole **alimentazione + segnale video + (opzionale) controllo SmartAudio**:

| Filo dal VTX | Pad sulla FC | Note |
|---|---|---|
| Alimentazione (VCC) | **5V** *(per il TX800)* | ⚠️ **verifica la tensione del TUO VTX!** |
| GND | **G** | |
| Video IN | **VTX** (uscita video della FC) | il segnale video che il VTX trasmette |
| SmartAudio | **T2** (TX2) o altro **TX** libero | per cambiare canale/potenza dalla radio |

> ⚡ **Tensione VTX = errore n°1.** Il **SpeedyBee TX800** si alimenta a **5V** →
> usa il pad **5V**. **Molti altri VTX** vogliono invece **9V** o **VBAT**: in quel
> caso usa il pad **9V** della FC (BEC dedicato), **mai** il 5V. Controlla il
> manuale del tuo VTX prima di saldare.

> 📡 **Antenna SEMPRE collegata prima di alimentare**, altrimenti il VTX si brucia.
> Per i test ravvicinati imposta **25 mW** (vedi [cap. 8 — regole](08-regole-e-legge.md)).

```
   TX800: [5V] [GND] [Video] [SmartAudio]
             │    │      │        │
   FC:     [5V] [ G ]  [VTX]    [T2]
```

---

## 10.7 — Pad utili extra (opzionali)

| Pad sulla FC | A cosa serve |
|---|---|
| **9V** | BEC 9V dedicato (per VTX da 9V) |
| **BZ+ / BZ-** | Cicalino (buzzer) per ritrovare il drone |
| **LED** | Striscia LED indirizzabile (WS2812) |
| **R3/T3, R4/T4, R6/T6** | UART liberi (GPS, secondo VTX, ecc.) |
| **SDA / SCL** | Bus I2C (magnetometro/baro esterni) |

> Per la nostra build "versatile" **non** servono: li elenco solo perché li vedrai
> stampati sulla scheda e così sai cosa sono.

---

## 10.8 — Riepilogo: tutti i collegamenti in una tabella

| Da | Filo | A (pad FC/ESC) | Tipo |
|---|---|---|---|
| Batteria XT60 rosso | + | **B+** (ESC) | potenza |
| Batteria XT60 nero | − | **B-** (ESC) | potenza |
| Condensatore | striscia = − | **B+ / B-** (ESC) | potenza |
| Motore 1 (RR) | 3 fili | angolo **M1** (ESC) | potenza |
| Motore 2 (FR) | 3 fili | angolo **M2** (ESC) | potenza |
| Motore 3 (RL) | 3 fili | angolo **M3** (ESC) | potenza |
| Motore 4 (FL) | 3 fili | angolo **M4** (ESC) | potenza |
| FC ↔ ESC | cavo 8 pin | connettore (no saldatura) | dati+potenza |
| Ricevitore RP1 | 5V / GND | **5V / G** | alim. |
| Ricevitore RP1 | TX / RX | **R1 / T1** (incrociato) | dati |
| Camera | 5V / GND | **5V / G** | alim. |
| Camera | Video out | **CAM** | video |
| VTX TX800 | 5V / GND | **5V / G** | alim. |
| VTX TX800 | Video in | **VTX** | video |
| VTX TX800 | SmartAudio | **T2** | dati |

---

## 10.9 — Checklist prima di alimentare ⚡

- [ ] Polarità batteria **B+/B-** corretta (multimetro: nessun corto + ↔ −)
- [ ] Condensatore con la **striscia su B-**
- [ ] Cavo **8 pin FC↔ESC** inserito bene nel verso giusto
- [ ] Ricevitore **incrociato** (TX→R1, RX→T1)
- [ ] VTX alla **tensione giusta** (TX800 = 5V) e **antenna collegata**
- [ ] Nessun filo vicino alle eliche; **ELICHE NON montate**
- [ ] Primo collegamento con **smoke stopper**

Se al primo "smoke test" non esce fumo, non scotta nulla e i LED si accendono →
passa alla [configurazione Betaflight](04-configurazione-software.md). 🎉

---

## 🔗 Manuale ufficiale (verifica la serigrafia!)
- Cerca **"SpeedyBee F405 V3 Stack Manual PDF"** sul sito SpeedyBee o nella scatola.
- Documentazione ArduPilot/Betaflight del target **SPEEDYBEEF405V3**.

⬅️ Torna all'[indice](README.md)
