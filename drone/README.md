# 🚁 Progetto Drone FAI-DA-TE — "Versatile 5 pollici"

Guida completa per progettare e costruire da zero un quadricottero economico,
divertente da pilotare e capace di fare riprese dall'alto. Pensata per chi
parte **da principiante**.

> **Profilo di questo progetto**
> - 🎯 **Uso:** ibrido/versatile (riprese decenti + divertimento nel pilotaggio)
> - 💶 **Budget:** ~150–300 € (vedi note sotto)
> - 🧰 **Esperienza richiesta:** nessuna — si parte dalle basi
> - 🛠️ **Tipo:** quadricottero freestyle/cinematic 5"

---

## Perché un quadricottero 5"

Il "5 pollici" (riferito al diametro delle eliche) è il formato più diffuso al
mondo per l'autocostruzione. Motivi:

- **Ricambi ovunque** ed economici (è lo standard de facto).
- **Equilibrio perfetto** tra stabilità per le riprese e agilità per divertirsi.
- **Potenza** sufficiente a sollevare una piccola action cam.
- **Enorme community** online: ogni problema che incontrerai è già stato risolto da qualcun altro.

---

## ⚠️ Aspettative oneste sul budget

Costruire **tutto** da zero (drone + radiocomando + visore FPV + batterie +
caricabatterie) sotto i 300 € è **molto difficile**. Per questo proponiamo un
**approccio a fasi**: parti da una base solida e aggiungi pezzi col tempo.

| Fase | Cosa ottieni | Costo indicativo |
|------|--------------|------------------|
| **Fase 0 — Simulatore** | Impari a volare senza rompere nulla | 0–15 € |
| **Fase 1 — Il drone + radio** | Drone completo + radiocomando, volo "a vista" con action cam | ~230–280 € |
| **Fase 2 — FPV (opzionale)** | Visore per volo immersivo in prima persona | +80–250 € |

👉 **Consiglio:** la Fase 0 è obbligatoria e gratis. Inizia da lì *oggi stesso*,
mentre aspetti che arrivino i pezzi.

---

## 📚 Indice della guida

1. [Componenti e lista della spesa (BOM)](01-componenti.md)
2. [Strumenti necessari e sicurezza](02-strumenti-e-sicurezza.md)
3. [Assemblaggio passo-passo](03-assemblaggio.md)
4. [Configurazione software (Betaflight)](04-configurazione-software.md)
5. [Primo volo e collaudo](05-primo-volo.md)
6. [Riprese aeree: ottenere video belli](06-riprese-aeree.md)
7. [Risoluzione problemi (troubleshooting)](07-troubleshooting.md)
8. [Regole, legge e volo sicuro in Italia](08-regole-e-legge.md)

📄 Lista componenti in formato tabella: [`bom.csv`](bom.csv)

---

## 🗺️ Schema del drone in 30 secondi

```
                     ELICHE (x4)
                        │
        MOTORI (x4) ────┤  trasformano corrente in spinta
                        │
   ESC (4-in-1) ────────┤  regola la velocità dei motori
                        │
   FLIGHT CONTROLLER ───┤  il "cervello": stabilizza il volo
                        │
        ├── Ricevitore  →  riceve i comandi dal radiocomando
        ├── VTX + Camera →  trasmette il video a terra
        └── Batteria     →  alimenta tutto (LiPo 4S)
```

Ogni componente è spiegato in dettaglio nel [capitolo 1](01-componenti.md).

---

## Come usare questa guida

Leggi i capitoli **in ordine**. Non saltare il capitolo sicurezza (2) né il
simulatore: le batterie LiPo e le eliche rotanti vanno rispettate. Quando hai
dubbi, il capitolo [troubleshooting](07-troubleshooting.md) è il tuo amico.

Buona costruzione e buon volo! 🛫
