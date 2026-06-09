# 11 — PIANO RIVISTO: build con eliche protette (cinewhoop 3.5") + acquisti dalla Cina

> 🔄 **Questo capitolo sostituisce la build 5" dei capitoli 1 e 9.**
> Requisito nuovo: **eliche protette da una struttura integrata** (condotti).
> La soluzione giusta non è aggiungere paraeliche a un 5" (pesanti, fragili,
> peggiorano il volo), ma partire da un telaio **nato protetto**: il
> **cinewhoop**. I capitoli 2–8 (sicurezza, assemblaggio, Betaflight, primo
> volo, riprese, troubleshooting, legge) restano tutti validi.

---

## 11.1 — Perché il cinewhoop è perfetto per te

Un **cinewhoop 3.5"** (eliche da 90 mm dentro condotti/"ducts" integrati nel telaio):

| | Cinewhoop 3.5" (nuovo piano) | 5" freestyle (piano vecchio) |
|---|---|---|
| **Eliche protette** | ✅ condotti integrati nel telaio | ❌ esposte |
| **Sicurezza** vicino a persone/oggetti | ✅ molto più sicuro | ⚠️ pericoloso |
| **Riprese ravvicinate/indoor** | ✅ il suo mestiere (è nato per il cinema FPV) | ❌ solo spazi aperti |
| **Robustezza agli urti** | ✅ rimbalza sui muri | ⚠️ rompe eliche/bracci |
| **Per un principiante** | ✅ perdona gli errori | ⚠️ meno |
| Velocità/agilità pura | ⚠️ minore | ✅ massima |
| Resistenza al vento forte | ⚠️ minore | ✅ migliore |

Per **uso ibrido riprese + divertimento da principiante** con eliche protette, è
la scelta oggettivamente migliore. È la categoria usata dai professionisti per
le riprese ravvicinate (matrimoni, interni, fly-through).

---

## 11.2 — La nuova build: "CineLog35 DIY 4S"

Telaio di riferimento: **GEPRC CineLog35** — condotti paraelica **integrati**
nella struttura, predisposto per action cam leggere (naked GoPro, Insta360 GO,
Caddx Peanut), dimensioni 203x203x42 mm.

**Cosa cambia rispetto al 5"** (il resto — radio, RX, camera, VTX, caricabatterie — resta identico):

| Componente | Prima (5") | **Ora (cinewhoop 3.5")** | Perché |
|---|---|---|---|
| Telaio | GEPRC Mark5 | **GEPRC CineLog35 frame kit** | condotti paraelica integrati |
| FC+ESC | Stack 30x30 SpeedyBee F405 V3 | **SpeedyBee F405 AIO 40A** (25.5x25.5) | il CineLog35 monta schede 25.5x25.5: un AIO (FC+ESC in una scheda sola) è più semplice e leggero |
| Motori | 2207 2400KV | **GEPRC GR2004 2550KV** (versione 2-4S) | misura giusta per eliche 3.5" su 4S |
| Eliche | 5" Gemfan 51466 | **Gemfan D90** 3 pale (90 mm, da condotto) | disegnate per girare nei condotti |
| Batterie | 4S 1500 mAh | **4S 850–1100 mAh** | il cinewhoop è più leggero, batterie più piccole |

> ✅ **Il cablaggio del cap. 10 resta quasi identico:** stessi pad (5V/G, R1/T1,
> CAM, VTX, T2) sulla scheda AIO. Unica differenza: **non c'è il cavo 8 pin**
> FC↔ESC — i 12 pad dei motori e i pad batteria B+/B- sono **direttamente
> sull'AIO**. Un connettore in meno, ancora più semplice.

---

## 11.3 — 🇨🇳 Comprare dalla Cina: come funziona davvero

I canali principali: **Banggood**, **AliExpress**, store ufficiali dei brand
(SpeedyBee, GEPRC hanno store su AliExpress) e **ChinaHobbyLine** (batterie CNHL).

### Regole doganali UE (da sapere PRIMA di ordinare)
- 🧾 **IVA:** per ordini fino a **150 €** l'IVA italiana (22%) viene **già
  riscossa al checkout** (sistema IOSS): il prezzo che vedi è quasi sempre
  IVA inclusa, nessuna sorpresa alla consegna.
- 💰 **Sopra 150 €** per spedizione: si aggiungono **dazi doganali** (0–4,7% per
  questa merce) + spese di sdoganamento del corriere (5–15 €). **Trucco:
  spezza gli ordini sotto i 150 €.**
- 📦 **Tempi:** spedizione standard dalla Cina **10–25 giorni**; molti articoli
  sono disponibili da **magazzini UE** (CZ/ES/PL) con consegna **3–7 giorni**
  allo stesso prezzo o poco più — filtra per "Ship from: Europe".
- 🔋 **BATTERIE LiPo: NON dalla Cina.** Le LiPo viaggiano male per via aerea
  (restrizioni trasporto): o le trovi nel **magazzino UE** del venditore
  (es. CNHL EU warehouse) o le compri da un negozio europeo. Mai spedizione
  diretta Cina→Italia per le batterie.
- ⚠️ **Versioni EU/LBT:** per radio e ricevitori ELRS scegli la versione
  **LBT/CE** dove proposta (conformità europea 2.4 GHz).
- 🛡️ **Garanzia:** dalla Cina i resi sono lenti/costosi. Per i pezzi "critici"
  (radio, caricabatterie) valuta se i ~10-15 € risparmiati valgono il rischio.

---

## 11.4 — 💶 LISTA D'ACQUISTO DETTAGLIATA (Cina vs Europa)

Prezzi **indicativi a giugno 2026, IVA inclusa** dove IOSS. Verifica sempre al
carrello: su Banggood/AliExpress i prezzi oscillano ogni settimana (coupon,
flash sale). 🅒 = conviene dalla Cina, 🅔 = conviene/obbligatorio dall'Europa.

### A) Il drone

| # | Componente | Prodotto esatto | 🇨🇳 Cina ~€ | 🇪🇺 Europa ~€ | Link Cina | Note |
|---|---|---|---:|---:|---|---|
| 1 | Telaio con condotti 🅒 | **GEPRC CineLog35 frame kit** (GEP-CL35) | **33–40** | 40–48 | [GEPRC store/AliExpress](https://geprc.com/product/geprc-cinelog35-analog-cinewhoop-fpv-drone-4s-6s/) · [Banggood](https://www.banggood.com/) (cerca "GEPRC CL35 frame") | condotti paraelica integrati |
| 2 | FC+ESC AIO 🅒 | **SpeedyBee F405 AIO 40A** (25.5x25.5, 3-6S) | **50–55** | 58–65 | [Banggood ~52 €](https://usa-m.banggood.com/25_5+25_5mm-SpeedyBee-F405-AIO-40A-Flight-Controller-with-5V-9V-BEC-Output-40A-BL_S-3-6S-ESC-for-RC-FPV-Racing-Drones-Support-Betaflight-Inavflight-p-2023196.html) · [AliExpress](https://www.aliexpress.com/item/1005007978579456.html) | BEC 5V+9V, Bluetooth |
| 3 | Motori x4 🅒 | **GEPRC GR2004 2550KV** (versione 2-4S!) | **60–80** (15–20/cad) | 75–95 | [Banggood](https://www.banggood.com/GEPRC-GR2004-2004-1750KV-2-6S-or-2550KV-2-4S-1_5mm-Shaft-or-2150KV-4S-or-3150KV-6S-Brushless-Motor-for-Cinelog35-HD-Toothpick-Long-Range-RC-Drone-FPV-Racing-p-1847489.html) · AliExpress (cerca "GR2004 2550KV") | ⚠️ scegli 2550KV, non 1750/3150 |
| 3b | *Alternativa budget* | DarwinFPV/RCinPower 2004 ~2900KV x4 | **40–50** | — | AliExpress (cerca "2004 motor cinewhoop 4S") | qualità inferiore ma ok |
| 4 | Eliche da condotto 🅒 | **Gemfan D90** 3 pale (90 mm) — 8 paia | **10–14** | 14–18 | [AliExpress ~1,9 €/paio](https://www.aliexpress.com/item/1005002561582585.html) · [8 paia ~10 €](https://www.aliexpress.com/item/1005002276279702.html) | versione per albero 1.5mm/M5 in base ai motori |
| 5 | Camera FPV 🅒 | **Caddx Ratel 2** (analogica 1200TVL) | **26–32** | 30–35 | AliExpress store Caddx ufficiale | |
| 6 | VTX 🅒 | **SpeedyBee TX800** (5.8 GHz 25–800 mW) | **20–25** | 24–30 | Banggood/AliExpress (cerca "SpeedyBee TX800") | SmartAudio |
| 7 | Ricevitore 🅒 | **RadioMaster RP1** ELRS 2.4 GHz | **12–15** | 14–18 | AliExpress store RadioMaster ufficiale | versione **EU LBT** |
| 8 | Minuteria | XT60 pigtail, strap x2, gommini, viti M2/M3, guaina | **8–12** | 12–18 | AliExpress (kit) | |

**Subtotale drone: 🇨🇳 ~220–270 € · 🇪🇺 ~270–325 €**

### B) A terra

| # | Componente | Prodotto esatto | 🇨🇳 Cina ~€ | 🇪🇺 Europa ~€ | Note |
|---|---|---|---:|---:|---|
| 9 | Radiocomando 🅒/🅔 | **RadioMaster Pocket ELRS** (Mode 2, EU-LBT) | **62–72** (AliExpress store ufficiale / Banggood) | 70–85 | dalla Cina risparmi ~10 €; dall'EU garanzia facile — scegli tu |
| 10 | Batterie x3 🅔 | **CNHL MiniStar / GNB 4S 1100 mAh** XT60 | — *(no spedizione aerea)* | **14–18/cad → 45–54** | [ChinaHobbyLine **magazzino UE**](https://chinahobbyline.com/) o [VolaFPV](https://volafpv.com/) / [PersonalDrones](https://www.personaldrones.it/) |
| 11 | Caricabatterie 🅔 | **ISDT Q6 Nano** | 30–35 (Banggood) | **37–42** | consigliato EU (sicurezza/garanzia) |
| 11b | Alimentatore per Q6 | 12V 5A DC (o vecchio alim. laptop 12-19V) | **8–12** | 12–15 | il Q6 Nano non include la PSU |
| 12 | LiPo bag 🅒 | sacchetto ignifugo | **5–8** | 8–12 | |
| 13 | Smoke stopper 🅒 | limitatore di corrente XT60 | **6–10** | 10–15 | |

**Subtotale terra: ~155–185 €**

### C) 💶 TOTALI

| Scenario | Totale ~€ |
|---|---:|
| **Massimo risparmio** (tutto Cina dove possibile, motori budget, 2 batterie, attese 2-4 settimane) | **~340 €** |
| **Consigliato** (Cina per drone+accessori, EU per batterie/caricabatterie/radio, motori GEPRC, 3 batterie) | **~400–430 €** |
| Tutto Europa (consegne 2-5 giorni, garanzia facile) | ~460–500 € |

> 🎯 **Verso i 300 €:** con motori budget (3b), 2 batterie invece di 3,
> Pocket dalla Cina in offerta (~62 €) e saltando lo smoke stopper (sconsiglio)
> arrivi a **~320–340 €**. Sotto non si scende con componenti nuovi e
> radio/caricatore decenti. Ricorda che è spesa **spalmabile**: ordina il drone
> oggi, le batterie il mese prossimo.

### D) Costi "nascosti" da mettere in conto

| Voce | ~€ |
|---|---:|
| Spedizioni (2-3 ordini Cina, spesso gratis sopra ~40 €) | 0–15 |
| Eventuale sdoganamento se sfori i 150 €/ordine | 5–20 |
| Saldatore + stagno + multimetro (se non li hai — cap. 2) | 45–70 |
| Eliche di ricambio extra dopo i primi mesi | 10–15 |
| Supporto action cam in TPU stampato | 3–8 (AliExpress) |

---

## 11.5 — Strategia d'ordine consigliata (per non sforare i 150 €/pacco)

1. **Ordine 1 — Cina (~135 €):** telaio CineLog35 + AIO F405 40A + eliche D90 + minuteria.
2. **Ordine 2 — Cina (~130 €):** motori GR2004 2550KV + Caddx Ratel 2 + TX800 + RP1 + LiPo bag + smoke stopper.
3. **Ordine 3 — Radio (~62–85 €):** Pocket ELRS (Cina in offerta o EU per garanzia). **Ordinala per prima in assoluto**: ti serve subito per il simulatore!
4. **Ordine 4 — EU (~95–110 €):** batterie 4S 1100 + ISDT Q6 Nano + alimentatore.

Così nessun pacco supera i 150 € (niente dazi extra) e mentre aspetti i pacchi
dalla Cina (2-4 settimane) ti alleni al **simulatore** con la radio.

---

## 11.6 — Checklist anti-errore specifica per questa build

- [ ] CineLog35 **frame kit** (solo telaio), non il drone completo BNF
- [ ] AIO **25.5x25.5** (il F405 AIO 40A lo è) — non uno stack 30x30
- [ ] Motori GR2004 nella versione **2550KV (2-4S)** — non 1750KV/3150KV (sono per 6S)
- [ ] Eliche **D90** compatibili con l'albero dei motori (1.5 mm o M5 — guarda la scheda motore)
- [ ] RP1 e Pocket entrambi **ELRS 2.4 GHz versione EU/LBT**
- [ ] Batterie **4S 850–1100 mAh XT60** (non le 1500 del piano vecchio) — **solo da magazzino UE**
- [ ] Tensione VTX: il TX800 va a **5V** (pad 5V dell'AIO)

---

## 11.7 — Prestazioni attese (così sai cosa aspettarti)

- **Peso:** ~250 g a secco, ~360–400 g con batteria e action cam leggera
- **Autonomia:** 4–7 min per batteria (per questo ne consiglio 3)
- **Velocità:** più che sufficiente per riprese fluide e divertimento; non è un racer
- **Dove vola bene:** giardini, boschi, interni ampi, vicino a soggetti — *il regno del cinewhoop*
- **Dove soffre:** vento forte e voli lunghissimi in spazi aperti

⬅️ Torna all'[indice](README.md) · Il [cablaggio (cap. 10)](10-cablaggio-speedybee-f405v3.md) resta valido (vedi nota AIO in 11.2)
