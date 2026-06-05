# 7 — Risoluzione problemi (troubleshooting)

Tabella di pronto soccorso per i problemi più comuni. Quando sei bloccato,
cerca anche il **codice di beep** del tuo ESC/FC e i forum (r/fpv, IntoFPV).

---

## 7.1 — Alimentazione / accensione

| Sintomo | Cause probabili | Cosa fare |
|---|---|---|
| **Fumo / scintilla** all'accensione | Cortocircuito, polarità XT60 invertita, condensatore al contrario | Stacca SUBITO. Multimetro tra + e −: continuità = corto. Ricontrolla saldature. |
| Niente LED, niente vita | Saldatura batteria fredda, FC bruciato | Verifica continuità XT60→FC, ricontrolla flash firmware. |
| Il PC non vede il FC via USB | Cavo "solo carica", driver mancanti | Cambia cavo, installa driver (Zadig/Impulse RC), prova altra porta USB. |

## 7.2 — Radio / comandi

| Sintomo | Cause probabili | Cosa fare |
|---|---|---|
| Non si abbina (bind) | Protocollo errato, firmware ELRS TX/RX diversi | Stesso protocollo CRSF, aggiorna ELRS a versioni **compatibili** TX e RX. |
| Stick non muovono le barre (tab Receiver) | UART/Serial RX non abilitato, provider sbagliato | Ports → Serial RX sull'UART giusto; Configuration → CRSF. |
| Canali invertiti / centrati male | Endpoint e trim del radiocomando | Calibra/limita gli endpoint dal menu del radiocomando. |

## 7.3 — Motori

| Sintomo | Cause probabili | Cosa fare |
|---|---|---|
| Un motore non gira | Saldatura, motore bruciato, assegnazione errata | Tab Motors (senza eliche!) testa singolarmente; ricontrolla saldature dei 3 fili. |
| Motore gira nel verso sbagliato | Direzione software | Inverti senso via Configurator/BLHeli — **non** ri-saldare. |
| Al decollo si ribalta subito | Ordine motori errato, orientamento FC errato, eliche montate al contrario | Verifica mappa motori, freccia FC, verso eliche CW/CCW. |
| Vibrazioni forti / "twitch" | Elica danneggiata, gommini, PID | Cambia eliche, controlla bilanciamento, valori PID di default. |

## 7.4 — Video FPV

| Sintomo | Cause probabili | Cosa fare |
|---|---|---|
| Schermo nero / no segnale | Antenna VTX scollegata, canale diverso tra VTX e visore | **Mai accendere VTX senza antenna!** Allinea banda/canale. |
| Immagine disturbata da vicino | Potenza VTX troppo alta vicino al visore | Abbassa a 25 mW per i test ravvicinati. |
| Portata video scarsa | Antenne danneggiate, posizionamento | Antenne integre e libere dal carbonio, non schiacciate. |

## 7.5 — In volo

| Sintomo | Cause probabili | Cosa fare |
|---|---|---|
| Il drone "scappa" da un lato | Orientamento FC, trim, calibrazione accelerometro | Calibra accelerometro su superficie piana (tab Setup). |
| Non si arma (non parte) | Condizioni di arming non soddisfatte | Guarda l'OSD: mostra il motivo (es. "throttle high", "angle", "no RX"). Risolvi quello. |
| Cade di colpo / perde segnale | Failsafe scattato, batteria scarica | È il **failsafe** che protegge: controlla portata radio e tensione batteria. |
| Video "a gelatina" (jello) | Eliche sbilanciate, vibrazioni | Sostituisci eliche, controlla gommini, serra i motori. |

## 7.6 — Quando proprio non capisci

1. **Guarda l'OSD / ascolta i beep:** quasi sempre ti dicono *cosa* manca per armare.
2. **`diff all` in CLI:** copia la config e chiedi aiuto sui forum (IntoFPV, r/fpv,
   gruppi FB italiani "FPV Italia").
3. **Isola il problema:** un componente alla volta. Procedi per esclusione.
4. **Backup salva-vita:** se hai esportato la config (cap. 4.5), puoi sempre tornare
   a uno stato funzionante.

➡️ **Prossimo capitolo:** [Regole e legge in Italia](08-regole-e-legge.md)
