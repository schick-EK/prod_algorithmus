# AP3 – Code-Arbeitsstand am 11.11.2026

Dieser experimentelle Prototyp wurde am 11.11.2026 auf Grundlage der vorhandenen
Codebasis und Konzepte entwickelt. Die Prüfung beruht auf technischen
Regressionstests; empirische Evaluation und Kalibrierung stehen noch aus.

## Ausgangsbasis und Einordnung

Geprüft wurde `schick-EK/prod_algorithmus`, Basiscommit
`da96495d3b37911a17546f8f10f6ff84dd86592c` vom 11.11.2026. Die Historie zeigt:

| Datum | Im Repository belegter Stand |
| --- | --- |
| 03.09.2026 | AP2-Konzept v0.3 mit beobachtungsnahen Merkmalen, Memos und Missingness |
| 17.09.2026 | Next.js-/SQLite-Erfassungs-App; bisher einziger fachlicher App-Codecommit |
| 20.10.2026 | Erstes AP3-Konzept |
| 27.10.2026 | AP3-Konzept v0.2 |
| 04.11.2026 | AP3-Konzept v0.3 |
| 11.11.2026 | AP3-Konzept v0.4; noch keine AP3-Implementierung |

Maßgebliche fachliche Quellen sind `AP1_Ontologie_Ausfuehrlich_v7.md` (v0.7.0,
Arbeitsentwurf), `AP2_Konzept_Erfassungs_App_v3.md` und `AP3_Konzept_v4.md`.
Die älteren AP3-Fassungen bestätigen insbesondere die Trennung von semantischer
Evidenz in AP3 und latentem Zustand in AP5.

AP3 v4 sieht Oktober 2026 bis März 2027 und 875 Stunden vor. Im November stehen
Candidate Generator, Regeln, Textverarbeitung und eine erste kontrollierte
KI-Komponente an. Ein anschlussfähiger Schnittstellen- und Regelprototyp ist
dafür ein plausibler Arbeitsstand. Daraus lässt sich kein geleisteter
Stundenumfang oder belastbarer Fertigstellungsprozentsatz ableiten.

## Tatsächliche Lücken zwischen Konzept und Ausgangscode

Die vorhandenen `observations` speichern Zeitpunkt, Studie, Bereich, Station,
Rundgang und eine verpflichtende Ablaufart. `round_notes` speichern Text und
„keine Auffälligkeiten“ je Station/Rundgang. Es fehlen insbesondere:

- beobachtungsnahe Maschinen-, Personen- und Materialmerkmale;
- explizite Beobachtungsqualität und Missingness;
- Beobachtungsstatus sowie vollständiges Sampling-/Verzugsmodell;
- eindeutige Memo-Zuordnung zur einzelnen Beobachtung, Audio und Transkripte;
- maschinenlesbare AP1-Ontologie und alle AP3-Komponenten.

HT/NT/VS/FK und frei konfigurierte Ablaufarten sind keine ausreichend definierte
AP1-Übersetzung. Eine Station kann mehrere gezählte Beobachtungen besitzen,
die dieselbe Rundgangsnotiz teilen. Deren Text ungeprüft jedem Datensatz als
individuelle Evidenz zu geben würde Scheingenauigkeit erzeugen.

## Implementierter Umfang

| Baustein | Stand und Grenze |
| --- | --- |
| Inputvertrag | `ap3-input/0.1.0`, Laufzeitprüfung, ISO-Zeitbezug, explizite Missingness, Memo-Status/-Scope, Qualität und Provenienz |
| AP1-Anbindung | Versionierter JSON-Ausschnitt mit 19 ProductionState-Klassen, Definitionen, Parent-/Fallback-Referenzen, Disjunktheit und einem expliziten Pflichtkontext |
| Kandidaten | Evidenzbezogene Familien einschließlich Geschwistern, Oberklassen und `PS_UNKNOWN`; ohne Signal kompletter Ausschnitt |
| Regelbaseline | Beobachtungsmerkmale und enge deutsche Memo-Muster; Fundstellen im Originaltext; einfacher Negations-, Frage-, Zeit- und Unsicherheitsfilter |
| KI-Vertrag | Memo-Kandidatenanfrage und validierte Antwort mit Modell-/Promptversion, Input-Hash, geschlossenen Klassen, endlichen Rohscores und exakten Zitaten |
| Kombination | Kanalgetrennte Beiträge; Regel und KI zum gleichen Memo werden nicht als unabhängige Stimmen aufsummiert |
| Constraints | Pflichtkontext wird markiert; widersprüchliche Vorzeichen und disjunkte Klassen über die Hierarchie werden diagnostiziert |
| Nichtentscheidung | Reproduzierbare Status für ungültige Eingabe, unzureichende Evidenz, Konflikt, fehlenden Pflichtkontext und fehlende Kalibrierung |
| Audit | Validierter Input-Snapshot, Kandidaten, Beiträge, Fundstellen, Kontextlücken, Versionsangaben, Ontologie-Hash und deterministische Annotation-ID |
| Altdaten | Verlustarme Adapterbrücke und studienweiter JSONL-Export über die bestehende App |
| Technische Beispiele | Zehn synthetische Szenarien; getrennte Regressionserwartungen, kein empirischer Referenzdatensatz |

Die maschinenlesbare Ontologie heißt bewusst `ap1-v0.7-subset/0.1.0`.
Nur `PS_UNKNOWN` übernimmt den ausdrücklich dokumentierten Status `accepted`;
die übrigen Klassen bleiben im Ausschnitt `candidate`. Die übrigen
AP1-ProductionStates sowie LossClass, CauseClass und MeasureClass sind noch
nicht vollständig übertragen. Vor produktiver Nutzung sind sämtliche
Klassensteckbriefe und Constraints fachlich zu prüfen.

Die Inputstruktur ist ein technischer AP3-Arbeitsvertrag, kein Anspruch auf
vollständige Umsetzung des vorgeschlagenen AP2-v1.0-Schemas. Der Legacy-Adapter
kennzeichnet Herkunft und fehlende Merkmale ausdrücklich. Gemeinsame
Stationsnotizen bleiben im Input erhalten und werden im ersten Stand nicht
als individuelle Memo-Evidenz ausgewertet. „Keine Auffälligkeiten“ ist kein
positiver Zustandsnachweis.

## Ergebnisvertrag und konservative Entscheidung

Ein Fall mit Wartebeobachtung und „Material fehlt.“ kann beispielsweise enthalten:

```json
{
  "candidates": [
    { "class_id": "PS_WAIT_MATERIAL", "raw_score": 0.7 },
    { "class_id": "PS_WAITING", "raw_score": 0.8 }
  ],
  "candidate_distribution": null,
  "resolved": null,
  "decision": { "status": "ABSTAIN_UNCALIBRATED", "abstain": true }
}
```

Dies ist ein gekürztes Beispiel; die vollständige Ausgabe enthält weitere
Kandidaten und Audit-Daten. Scores verschiedener Hierarchieebenen sind keine
disjunkte Verteilung. Sie werden weder normiert noch als AP5-Wahrscheinlichkeiten
ausgegeben. Missingness erzeugt keine negativen Regelbeiträge.

Statuspriorität: ungültige Eingabe, unzureichende Evidenz/niedrige Qualität,
Konflikt, fehlender Pflichtkontext, anschließend fehlende Kalibrierung.
Alle weiteren Diagnosen bleiben zusätzlich erhalten. Die hierarchische
Kandidatenbildung ist vorhanden; eine empirisch tragfähige G3/G2/G1-Auswahl
ist noch nicht implementiert. Fehlender Pflichtkontext eines gestützten
Kandidaten führt daher vorläufig konservativ zur Nichtentscheidung.

`out_of_scope` bleibt `null`: Ein fehlender Treffer in 19 Klassen beweist
keine Ontologiegrenze. Auch ein korrektes KI-Zitat beweist noch keine fachlich
richtige KI-Interpretation. Die Antwortprüfung ist eine technische Begrenzung;
fachliche Evaluation und Kalibrierung fehlen weiterhin.

## Ausführen und prüfen

Aus `mmh-app/` nach `npm ci`:

```bash
npm run test:ap3
npm run typecheck
npm run lint
npm run db:push
npm run build
```

Demo und kontrollierte Anfragen ohne externen Modellaufruf:

```bash
npm run --silent ap3:annotate -- tests/fixtures/ap3/observations.jsonl
npm run --silent ap3:ai-request -- tests/fixtures/ap3/observations.jsonl
```

`--silent` verhindert npm-Banner vor den JSONL-Daten. Die CLI verarbeitet jede
nichtleere Zeile, meldet Syntax-/Validierungsfehler mit Zeilennummern, lehnt
doppelte Observation-IDs ab und beendet fehlerhafte Läufe mit Exitcode 1.
Im Annotationsmodus bleiben strukturierte `INVALID_INPUT`-Ergebnisse erhalten;
syntaktisch ungültige JSON-Zeilen und Duplikate werden mit Fehlermeldung
übersprungen. Nachfolgende gültige Datensätze werden weiterverarbeitet.

Für eine externe, selbst gewählte KI lässt sich der erzeugte Anfragevertrag
später anbinden. Bereits jetzt kann `annotate(input, response)` eine lokal
vorliegende Antwort prüfen und protokollieren. Der externe Modellbetrieb ist
für einen folgenden Implementierungsschritt vorgesehen.

Der neue HTTP-Export liest innerhalb einer SQLite-Transaktion und schreibt
keine Beobachtungen oder Annotationen in die Datenbank. Notizverweise werden
vor der Zuordnung dedupliziert. Das Ergebnis ist für dieselben Quelldaten und
Versionen stabil; Erzeugungszeitpunkte werden nicht in Annotation-IDs gemischt.
Die Vollausgabe ist derzeit im Speicher aufgebaut und für kleine Pilotstudien
gedacht. Ein vollständiges AP2-Manifest mit Audio-/Sampling-Dateien fehlt noch.

## Geprüft am 11.11.2026

- 29 automatisierte Tests erfolgreich, einschließlich JSONL-CLI, Missingness,
  Negation, Konflikten, Reproduzierbarkeit und ungültigen KI-Antworten.
- TypeScript-Prüfung und Produktionsbuild erfolgreich nach lokalem `db:push`.
- ESLint ohne Fehler; zwei bereits im Ausgangsstand vorhandene Warnungen zu
  ungenutzten Symbolen in `work-areas/new/page.tsx` und `BarChart.tsx`.
- Chromium-/Playwright-Prüfung gegen den Produktionsserver erfolgreich:
  HTTP-Fehlerfälle, leere Studie, drei synthetische Beobachtungen, gemeinsame
  Notiz ohne Duplikate, fehlende Station, Studientrennung, stabiler Export und
  tatsächlicher Browserdownload; keine JavaScript-Seitenfehler.

Die Browserprüfung verwendete ausschließlich lokal angelegte synthetische
SQLite-Daten. Das Ergebnis ist ein technischer Funktionsnachweis, keine
Validierung der semantischen Zuverlässigkeit oder Kalibrierung.

## Nächste fachlich sinnvolle Entwicklung

1. **AP1/AP2 vervollständigen:** Klassensteckbriefe fachlich abnehmen und vollständig
   exportieren; beobachtungsnahe Merkmale, Qualität, Status, Samplingbezug und
   individuelle Memo-Verknüpfung in der Erfassung ergänzen. Neue Daten getrennt
   von Altdaten versionieren; keine nachträgliche automatische Umetikettierung.
2. **November fortsetzen:** Candidate Recall an manuell geprüften Fällen testen,
   weitere Regeln und Sprachvarianten ergänzen, echten Modelladapter mit
   festgehaltenem Modell/Prompt implementieren und Referenzannotation beginnen.
3. **Dezember:** vollständige Constraints, feinere Konfliktbehandlung und
   Varianten Rule-Gated/Ensemble/Constraint Projection untersuchen. Abhängigkeiten
   zwischen Regeln, Memo und KI explizit behandeln.
4. **Januar:** auf getrennten Trainings-/Kalibrier-/Testgruppen eine belastbare
   Evidenzkombination, Kalibrierung, hierarchischen Fallback und Abstain-Schwellen
   entwickeln; gemeinsame Stations-/Rundgangsquellen gegen Datenleckage gruppieren.
5. **Februar/März:** Baselines, Brier/Log Loss/ECE, Risk-Coverage, Missingness-,
   Konflikt- und Sensitivitätsexperimente durchführen; erst danach die endgültige
   probabilistische AP5-Übergabe und ihre dokumentierten Grenzen festlegen.

QG1–QG4 sind damit teilweise vorbereitet, QG5 ist strukturell abgesichert
(Rohscores bleiben Rohscores), QG6/QG7 besitzen Vorstufen. QG8 und die endgültige
probabilistische QG9-Abnahme stehen aus. AP3 ist mit diesem Stand nicht abgeschlossen.
