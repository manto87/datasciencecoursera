# 6 — Riprese aeree: ottenere video belli

Il tuo obiettivo "ibrido" è anche **filmare dall'alto**. Un drone che vola non
basta: i video belli vengono da **volo morbido + buona camera + montaggio**.

---

## 6.1 — Due "camere" diverse, non confonderle

| | Camera **FPV** | **Action cam** |
|---|---|---|
| A cosa serve | Vedere in tempo reale dove voli | Registrare il video finale di qualità |
| Qualità | Bassa, latenza minima | Alta (1080p/4K) |
| Esempi | Caddx Ratel | GoPro, Caddx Peanut, action cam economiche |

Per le riprese che pubblicherai conta la **action cam**. Se sei a budget zero,
puoi registrare temporaneamente il segnale FPV (con un visore/registratore DVR),
ma la qualità è molto inferiore.

---

## 6.2 — Montare la action cam senza rovinare il volo

- **Peso e bilanciamento:** la cam aggiunge peso davanti/sopra. Montala
  **centrata** e più in basso possibile → meno instabilità.
- **Antivibrazione:** usa un supportino in **TPU stampato** o gommini. È la
  differenza tra un video fluido e uno "tremolante".
- **Aerodinamica:** angolo cam coerente con la velocità (più veloce = più inclinata).
- Ricorda: più peso = **meno autonomia** e meno agilità. Per i 5" economici, una
  cam leggera ("naked"/Peanut ~30 g) è l'ideale.

---

## 6.3 — Impostazioni camera per video fluidi

- **Frame rate alto** (50/60 fps) → rallenti morbidi in post.
- **Shutter/otturatore:** regola "180°" (es. 1/120 s a 60 fps) con **filtri ND**
  se c'è molta luce → niente immagine "a scatti".
- **Stabilizzazione** elettronica (es. tipo HyperSmooth/RockSteady) **attiva**: salva moltissimo.
- Gira con **luce laterale/morbida** (mattino o tardo pomeriggio, "golden hour").

---

## 6.4 — Tecniche di volo cinematiche

Il segreto dei video professionali è **volare LENTI e MORBIDI**:

- **Reveal:** sali piano dietro un ostacolo (albero, muretto) che "rivela" il panorama.
- **Orbit:** giro lento attorno a un soggetto (combina yaw + roll dolci).
- **Fly-through/Push-in:** avvicinamento lento e dritto verso il soggetto.
- **Top-down:** camera a 90° verso il basso per riprese geometriche del terreno.
- **Movimenti su un asse alla volta:** all'inizio muovi solo avanti, *poi* aggiungi
  rotazione. Due movimenti combinati male = video nauseante.

> 🎚️ **Rate bassi per il cinematic:** in Betaflight puoi creare un **profilo
> "rate" dolce** (meno reattivo) da richiamare con un interruttore: stick morbidi
> = riprese morbide.

---

## 6.5 — Montaggio (post-produzione)

- Software gratuiti: **DaVinci Resolve** (potentissimo e gratis), CapCut, iMovie.
- **Stabilizza** ulteriormente in post se serve.
- **Color grading** leggero: alza un po' contrasto e saturazione, raddrizza l'orizzonte.
- Taglia spietato: **clip brevi** montate a ritmo di musica > un lungo volo noioso.
- Esporta in 1080p/4K a 25–30 fps per la pubblicazione.

---

## 6.6 — Errori tipici da evitare

- ❌ Volare nelle ore centrali con sole a picco (ombre dure, niente filtri ND).
- ❌ Movimenti bruschi e combinati.
- ❌ Eliche rovinate → "jello". Cambiale spesso.
- ❌ Orizzonte storto (cam non livellata).
- ❌ Batteria al limite mentre insegui "l'inquadratura perfetta": **la sicurezza prima**.

➡️ **Prossimo capitolo:** [Risoluzione problemi](07-troubleshooting.md)
