# MMH – Multimomentaufnahme App

Lokaler Next.js-Prototyp zur Erfassung von Studien, Produktionssystemen,
Stationen, Rundgängen, Ablaufarten und Stationsnotizen. Die aktuelle App nutzt
SQLite (`local.db`) und hat keine Anmeldung. PostgreSQL und NextAuth sind trotz
verbliebener Pakete derzeit nicht aktiv eingebunden.

## Lokal starten

Voraussetzung: Node.js **22 oder neuer**, npm und gegebenenfalls eine lokale
C++-Build-Umgebung für `better-sqlite3`.

```bash
cd mmh-app
npm ci
npm run db:push
npm run dev
```

Öffnen: <http://localhost:3000>. Für diesen Stand sind keine `.env`-Datei,
PostgreSQL-Datenbank oder Zugangsdaten erforderlich. `db:push` richtet die
Tabellen der lokalen Entwicklungsdatenbank ein; bestehende Datenbanken vorher
sichern. Der Produktionsbuild setzt ebenfalls eine eingerichtete Datenbank
voraus:

```bash
npm run build
npm start
```

## AP3 – fortgeführter Arbeitsstand 16.11.2026

AP3 besitzt eine erste unabhängige TypeScript-Regelbaseline mit einem
versionierten AP1-Ausschnitt, expliziter Missingness, Kandidaten, Memo-Fundstellen,
Kontextprüfung und Abstain-Diagnosen. Rohscores sind **keine Wahrscheinlichkeiten**.
Kalibrierung und endgültige Klassenauflösung sind noch offen. Der nächste
Entwicklungsschritt ergänzt individuelle Evidenzrevisionen, KI-Replay und eine
erste Referenzauswertung.

Nach Aktualisierung einer vorhandenen Installation zuerst `npm run db:push`
ausführen: Die neue Tabelle `observation_evidence` speichert Ergänzungen separat
von den ursprünglichen Beobachtungen und Rundgangsnotizen.

Über **Auswertung → Individuelle Evidenz erfassen** lassen sich Merkmale,
Missingness, Qualität, Prozessschritt und Textmemo je Beobachtung nacherfassen.
Jede Speicherung erzeugt eine neue Revision; veraltete Browserstände werden
abgewiesen. Der Export übernimmt jeweils die neueste Revision.

Die Auswertung bietet folgende studienweite Downloads:

- `GET /observations/annotation-export?studyId=…`: AP3-Eingaben als JSONL.
- `GET /observations/annotation-export?studyId=…&mode=baseline`: Ergebnisse mit Audit-Daten.
- `GET /observations/annotation-export?studyId=…&mode=bundle`: JSON-Paket mit Eingaben, Ergebnissen, Ontologie und Manifest-Prüfsummen.

Die Diagrammfilter gelten für diese Downloads nicht. Alte Ablaufarten bleiben
als Quelldaten erhalten; fehlende AP2-Merkmale werden nicht daraus abgeleitet.
Stationsnotizen werden nicht einzelnen gezählten Beobachtungen zugeordnet.
Deshalb ergibt die Baseline für unveränderte Altdaten normalerweise
`ABSTAIN_INSUFFICIENT_EVIDENCE`.

Eine technische Demonstration mit zehn ausdrücklich synthetischen Fällen:

```bash
npm run --silent ap3:annotate -- tests/fixtures/ap3/observations.jsonl
npm run --silent ap3:ai-request -- tests/fixtures/ap3/observations.jsonl
npm run --silent ap3:evaluate -- tests/fixtures/ap3/observations.jsonl tests/fixtures/ap3/references.jsonl
```

Die zweite Ausgabe enthält kontrollierte Modellanfragen als JSONL, führt aber
keinen externen KI-Aufruf aus. Vorliegende Antworten können reproduzierbar
eingelesen werden:

```bash
npm run --silent ap3:annotate -- observations.jsonl --ai-responses responses.jsonl
npm run --silent ap3:evaluate -- observations.jsonl references.jsonl --ai-responses responses.jsonl
```

Antworten benötigen Input- und Anfrage-Hash sowie Promptversion
`memo-evidence/0.2.0`. Fehlende, doppelte, fremde oder unpassende Antworten lassen
den Lauf fehlschlagen. Die Evaluation trennt synthetische Beispiele und
geprüfte Realdaten. Rohscore-Rangfolgen sind diagnostische Baselines.

Details und Grenzen: [aktueller Entwicklungsschritt](docs/AP3_Arbeitsstand_2026-11-16.md)
und [Ausgangsstand vom 11.11.](docs/AP3_Arbeitsstand_2026-11-11.md).

## Prüfen

```bash
npm run test:ap3
npm run typecheck
npm run lint
npm run build
```

`db:generate` und `db:migrate` sind weiterhin vorhanden; im Repository liegen
noch keine versionierten Migrationen. Für eine neue lokale Entwicklungsdatenbank
ist daher aktuell `db:push` der nutzbare Weg.
