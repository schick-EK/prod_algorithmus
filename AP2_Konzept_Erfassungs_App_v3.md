# AP2 – Konzept für eine schlanke Erfassungs-App als Versuchsinfrastruktur

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP2 – Schlanke Erfassungs-App als Versuchsinfrastruktur  
**Dokumenttyp:** Fachlich-technisches Umsetzungskonzept / Versuchsspezifikation  
**Version:** 0.3.0  
**Soll-Zeitfenster:** September 2026  
**Aufwand:** 130 Stunden  
**Primäre Eingänge:** Ontologie, Beobachtungsschema und Constraints aus AP1  
**Primäre Ausgänge:** strukturierte Beobachtungen, Samplingdaten, Sprachmemos, Kontext-, Qualitäts- und Provenienzinformationen für AP3

# 1. Zielsetzung

AP2 entwickelt eine bewusst schlanke Erfassungs-App als Versuchsinfrastruktur für Multimomentaufnahmen in Produktionssystemen. Ziel ist nicht die Entwicklung eines produktionsreifen Softwareprodukts, sondern eines technisch belastbaren Instruments, mit dem unter realistischen Einsatzbedingungen Beobachtungen so erhoben werden können, dass sie anschließend in AP3 probabilistisch auf die in AP1 definierte Ontologie abgebildet werden können.

Die App muss insbesondere sicherstellen, dass Beobachtungen zu definierten bzw. zufällig ausgelösten Zeitpunkten erhoben werden können, die Erfassung den Beobachtungsprozess nur minimal beeinflusst, Beobachtung und spätere fachliche Interpretation getrennt bleiben, unvollständige oder mehrdeutige Situationen explizit speicherbar sind, Sprachmemos als eigenständige Evidenzquelle referenzierbar bleiben und alle Daten reproduzierbar an AP3 übergeben werden können.

> **Leitfrage:** Welche minimale technische und semantische Erfassungsstruktur ist erforderlich, um stichprobenartige Produktionsbeobachtungen mit ausreichender Qualität, Kontexttiefe und Unsicherheitsinformation für die nachfolgende probabilistische Annotation zu erzeugen?

# 2. Forschungs- und Entwicklungsgegenstand

AP2 ist nicht nur technische Implementierung. Untersucht werden insbesondere die minimale notwendige Erfassungsstruktur, die Trennlinie zwischen beobachtbaren Merkmalen und bereits interpretierenden Kategorien, der Einfluss von Samplingverzug, der Informationsgewinn durch Sprachmemos, der Nutzen einzelner Kontextfelder sowie die geeignete Abbildung von Missingness und Beobachtungsqualität.

Die App ist damit das **Versuchsinstrument**; die Erkenntnisse zur geeigneten Erfassungsstruktur sind das methodische Ergebnis des Arbeitspakets.

# 3. Rolle im Gesamtverfahren

```text
AP1
Ontologie + Beobachtungsschema + Constraints
        ↓
AP2
Sampling + Beobachtung + Sprachmemo + Kontext + Qualität + Provenienz
        ↓
AP3
probabilistische Annotation + Kandidatenklassen + Wahrscheinlichkeiten + Abstain
        ↓
AP5
latentes Mehrkanal-Messmodell
```

Grundsatz: **Capture first – classify later.**

# 4. Zielergebnisse

Am Ende von AP2 sollen ein lauffähiger App-Prototyp, ein konfigurierbares Samplingmodell, ein reproduzierbarer Triggermechanismus, die technische Umsetzung des AP1-Beobachtungsschemas, beobachtungsnahe strukturierte Merkmale, Sprachmemo-Erfassung, Kontext-, Qualitäts- und Missingness-Modell, Zeit- und Provenienzmodell, Versionierung, ein maschinenlesbarer Export, ein Pilotdatensatz sowie eine dokumentierte Übergabe an AP3 vorliegen.

# 5. Scope und Abgrenzung

## In Scope

- Study bzw. Versuch konfigurieren
- SamplingPlan definieren
- SamplingEvents generieren
- Trigger auslösen
- Observation erfassen
- Kontext speichern bzw. vorausfüllen
- beobachtbare Merkmale erfassen
- Sprachmemo aufnehmen
- Beobachtungsqualität erfassen
- Missingness explizit speichern
- Samplingverzug dokumentieren
- Daten exportieren
- Pilot- und Testfälle durchführen

## Out of Scope

Nicht Bestandteil sind automatische Transkription, NLP-Klassifikation, Klassenwahrscheinlichkeiten, Abstain-Kalibrierung, MES-/ERP-Datenfusion, KPI-Berechnung, Ursachen- oder Maßnahmenbewertung, produktionsreife Skalierung sowie komplexe Enterprise-Berechtigungsmodelle.

# 6. Designprinzipien

## P1 – Beobachtungsnähe
Die App erfasst direkte Beobachtungsmerkmale, nicht finale Ontologieklassen.

## P2 – Minimale Interaktionslast
Wenige Pflichtfelder, große Auswahlflächen, vorausgefüllter Kontext, keine Freitextpflicht, Memo optional.

## P3 – Unsicherheit explizit zulassen
`unknown`, `not_visible`, `not_observed`, `not_applicable` und `capture_failed` sind gültige Datenzustände.

## P4 – Samplingintegrität erhalten
Geplante, ausgelöste, verpasste, übersprungene und verspätete SamplingEvents bleiben dokumentiert.

## P5 – Zeitbezug als Kerneigenschaft
Samplingzeit, Triggerzeit, Beobachtungszeit, Memozeit und Speicherzeit bleiben unterscheidbar.

## P6 – Provenienz erhalten
Jede Observation referenziert Study, SamplingPlan, SamplingEvent, Observer, Schema-, Ontologie- und App-Version.

## P7 – technische Einfachheit
Nur Funktionen mit direktem Nutzen für AP2 oder AP3 werden umgesetzt.

# 7. Nutzerrollen

## Observer
Trigger sehen, Observation öffnen, Merkmale erfassen, optional Memo aufnehmen, Qualitätsstatus setzen, speichern.

## Study Admin / Researcher
Study konfigurieren, SamplingPlan pflegen, Kontextlisten verwalten, Testtrigger auslösen, Samplingstatus einsehen, Daten exportieren und Versionen prüfen.

# 8. Kernprozess

```text
SamplingPlan
→ SamplingEvent
→ Trigger
→ Observation
→ Kontext
→ Beobachtungsmerkmale
→ optional Sprachmemo
→ Qualität / Missingness
→ Speicherung
→ Export
→ AP3
```

# 9. Samplingmodell

## Entitäten

```text
Study
  ↓
SamplingPlan
  ↓
SamplingEvent
  ↓
Observation
```

## SamplingEvent-Status

`scheduled`, `triggered`, `completed`, `missed`, `skipped`, `invalidated`

## Beispiel

```yaml
sampling_plan_id: PLAN_001
study_id: STUDY_001
valid_from: 2026-09-07
valid_to: 2026-09-11
daily_window:
  start: "08:00"
  end: "16:00"
observations_per_day: 8
minimum_gap_minutes: 30
```

## Samplingverzug

```yaml
scheduled_at: 2026-09-08T10:42:30+02:00
triggered_at: 2026-09-08T10:42:30+02:00
observed_at: 2026-09-08T10:43:12+02:00
delay_seconds: 42
```

# 10. Samplingvarianten

- **A – vollständig zufällig:** zufällige Zeitpunkte innerhalb definierter Fenster.
- **B – geschichtet zufällig:** Sampling innerhalb von Schicht, Linie, Bereich oder Zeitfenster.
- **C – Testmodus:** manuelle Trigger für technische und methodische Tests.

Der Testmodus muss im Datensatz klar vom echten Sampling unterscheidbar sein.

# 11. Observation als zentrale Dateneinheit

```yaml
observation_id: OBS_000184
sampling_event_id: EVENT_0142
observed_at: 2026-09-08T10:43:12+02:00
schema_version: 1.0.0
ontology_version: 1.0.0
app_version: 0.1.0
```

Eine Observation referenziert strukturierte Merkmale, Kontext, Memo, Beobachtungsqualität, Missingness, optional ObserverHint und Provenienz.

# 12. Kontextmodell

Mögliche Felder: `site_id`, `area_id`, `line_id`, `workcenter_id`, `machine_id`, `order_id`, `product_id`, `variant_id`, `process_step_id`, `shift_id`, `operator_role`.

Kontext soll möglichst aus Study und SamplingPlan vorausgefüllt werden.

# 13. Strukturierte Beobachtungsmerkmale

## Maschine
`running`, `stopped`, `changing_state`, `not_visible`, `unknown`

Zusatzindikatoren: `alarm_visible`, `panel_interaction`, `machine_open`, `technical_intervention_visible`

## Personenaktivität
`processing`, `waiting`, `moving`, `transporting`, `searching`, `inspecting`, `working_on_equipment`, `communicating`, `not_visible`, `unclear`

## Material
`available`, `not_available`, `not_visible`, `unknown`

## Produkt-/Prozesshinweise
`product_being_processed`, `product_being_inspected`, `rework_visible`, `tool_change_visible`, `material_being_moved`, `unclear`

# 14. Abgrenzung Feature vs. Klasse

```text
machine_status = stopped
operator_activity = waiting
material_status = unknown
memo = none
```

AP2 darf daraus nicht direkt `PS_WAIT_MATERIAL` ableiten. Spätere AP3-Kandidaten könnten `PS_WAITING`, `PS_WAIT_MACHINE`, `PS_DISTURBANCE` oder `PS_UNKNOWN` sein.

# 15. ObserverHint

```yaml
observer_hint:
  candidate_class_id: PS_WAITING
  confidence: medium
```

Optional, getrennt von beobachteten Merkmalen und niemals Ground Truth.

# 16. Sprachmemo

Das Memo ergänzt strukturierte Merkmale um frei beschreibbaren Kontext.

```yaml
memo_id: MEMO_000184
observation_id: OBS_000184
started_at: 2026-09-08T10:43:18+02:00
duration_seconds: 11
mime_type: audio/webm
status: captured
```

Status: `captured`, `not_recorded`, `cancelled`, `capture_failed`, `deleted`

# 17. Beobachtungsqualität

`high`, `medium`, `low`, `not_observable`

Mögliche Gründe: `visibility_blocked`, `observation_too_short`, `multiple_simultaneous_activities`, `context_missing`, `distance_too_large`, `other`

# 18. Missingness

`present`, `not_observed`, `not_known`, `not_applicable`, `capture_failed`

Grundsatz: Missingness wird nicht implizit in eine andere Aussage umgewandelt.

# 19. Provenienzmodell

```yaml
provenance:
  study_id: STUDY_001
  sampling_plan_id: PLAN_001
  sampling_event_id: EVENT_0142
  observer_id: OBSERVER_03
  schema_version: 1.0.0
  ontology_version: 1.0.0
  app_version: 0.1.0
  captured_at: 2026-09-08T10:43:12+02:00
```

# 20. Datenmodell

```text
Study
├── SamplingPlan
│   └── SamplingEvent
│       └── Observation
│           ├── ObservationFeature
│           ├── ContextReference
│           ├── Memo
│           ├── ObserverHint
│           ├── ObservationQuality
│           └── Provenance
└── AppEvent
```

# 21. Technische Zielarchitektur

```text
Mobile / Tablet Web Client
          ↓
Application Layer
          ↓
API
          ↓
Structured Data Store

Object Storage
          ↓
Audio Memos

Export Layer
          ↓
AP3
```

# 22. Online-/Offline-Strategie

Online-first ist zu bevorzugen, wenn stabile Konnektivität besteht. Bei instabiler Verbindung sollte zunächst lokale Pufferung geprüft werden. Eine vollständige Offline-first-Architektur wird nur umgesetzt, wenn der Pilot sie zwingend benötigt.

# 23. UI-Konzept

## Screen 1 – Study / Sampling
Aktuelle Study, nächster Trigger, Completed Events, Missed Events.

## Screen 2 – Observation
Kontext, Maschinenstatus, Personenaktivität, Material-/Prozesshinweise, Memo, Beobachtungsqualität.

## Screen 3 – Memo
Record, Stop, Playback, Delete, Re-record.

## Screen 4 – Review
Kontext, Merkmale, Memo-Status, Qualitätsstatus, Missingness und Speichern.

# 24. Minimaler End-to-End-Datensatz

```yaml
study_id: STUDY_001
sampling_event_id: EVENT_0142
observation:
  observation_id: OBS_000184
  observed_at: 2026-09-08T10:43:12+02:00
  schema_version: 1.0.0
  ontology_version: 1.0.0
  app_version: 0.1.0
  context:
    site_id: SITE_01
    line_id: LINE_01
    workcenter_id: WC_12
  features:
    machine_status: stopped
    operator_activity: waiting
    material_status: not_known
  observation_quality:
    level: medium
  memo:
    memo_id: MEMO_000184
    status: captured
    duration_seconds: 11
```

# 25. Export an AP3

```text
export/
├── manifest.json
├── observations.jsonl
├── sampling_events.csv
├── observation_schema.json
├── ontology_reference.json
└── memos/
    ├── MEMO_000184.webm
    └── MEMO_000185.webm
```

`manifest.json` enthält Exportzeitpunkt, Study-ID, App-, Schema- und Ontologie-Version sowie Anzahl SamplingEvents, Observations und Memos.

# 26. Qualitätsanforderungen

- eindeutige Referenzierbarkeit,
- zeitliche Nachvollziehbarkeit,
- keine Zwangsklassifikation,
- explizite Missingness,
- eindeutige Memo-Verknüpfung,
- Versionierung,
- reproduzierbarer Export,
- möglichst kurze Erfassungsdauer.

# 27. Pilotkennzahlen

| Kennzahl | Zweck |
|---|---|
| Median Erfassungsdauer | Belastung der Beobachtung |
| Anteil Completed Events | praktische Durchführbarkeit |
| Anteil Missed Events | Samplingstabilität |
| Median Delay | Samplingverzug |
| Anteil Observations mit Memo | Memo-Nutzung |
| Memo-Dauer | zusätzlicher Aufwand |
| Anteil `not_observable` | Beobachtbarkeit |
| Missingness je Feld | Feldnützlichkeit |
| technische Fehlerrate | Robustheit |
| AP3-importierbare Datensätze | Schnittstellenqualität |

# 28. Testfälle

T01 Standardfall; T02 ohne Memo; T03 nicht sichtbar; T04 Sampling verpasst; T05 Memo fehlerhaft; T06 Mehrdeutigkeit; T07 verspätete Reaktion; T08 doppelte ID; T09 Export; T10 AP3-Testimport; T11 Netzunterbruch; T12 Versionswechsel.

# 29. Qualitäts-Gates

1. **Schema Ready** – AP1-Schema, Kontext, Missingness und Versionierung abgebildet.
2. **Capture Ready** – schnelle Erfassung ohne Zwangsklassifikation.
3. **Sampling Ready** – Randomisierung, Status und Missed Events funktionieren.
4. **Memo Ready** – Audioaufnahme und Fehlerstatus funktionieren.
5. **Pilot Ready** – technische Stabilität und Erfassungsdauer ausreichend.
6. **AP3 Ready** – Export und Testimport reproduzierbar.

# 30. Definition of Done

AP2 ist abgeschlossen, wenn:

- App auf Zielgerät nutzbar,
- Study und SamplingPlan konfigurierbar,
- SamplingEvents zufällig erzeugbar,
- Trigger-, Sampling- und Beobachtungszeit speicherbar,
- Samplingstatus vollständig protokolliert,
- Observation eindeutig gespeichert,
- AP1-Schema technisch umgesetzt,
- strukturierte beobachtungsnahe Merkmale erfassbar,
- Kontext speicherbar bzw. vorausfüllbar,
- Missingness explizit abbildbar,
- Sprachmemos erfassbar,
- Memo und Observation eindeutig verknüpft,
- Beobachtungsqualität gespeichert,
- Provenienz verfügbar,
- Schema-, Ontologie- und App-Version gespeichert,
- Pilotkennzahlen erhoben,
- AP3-Export erzeugt,
- Testfälle bestanden,
- AP3-Testimport erfolgreich,
- bekannte Einschränkungen dokumentiert.

> **Zentrales Abnahmekriterium:** Die Versuchsinfrastruktur erzeugt unter realistischen Bedingungen reproduzierbare Multimomentbeobachtungen mit ausreichendem Zeit-, Kontext-, Qualitäts- und Memo-Bezug, ohne die spätere fachliche Klassifikation vorwegzunehmen.

# 31. Liefergegenstände

| ID | Liefergegenstand |
|---|---|
| D2.1 | App-Prototyp |
| D2.2 | Sampling-Modul |
| D2.3 | Observation-Schema |
| D2.4 | Memo-Modul |
| D2.5 | Datenmodell |
| D2.6 | Exportformat |
| D2.7 | Pilot-/Testbericht |
| D2.8 | AP3-Übergabedokument |

# 32. Aufwandstruktur – 130 Stunden

| Teilpaket | Inhalt | Stunden |
|---|---|---:|
| AP2.1 | AP1-Schnittstelle & Versuchsspezifikation | 14 |
| AP2.2 | UX, Observation- und Datenmodell | 16 |
| AP2.3 | App-Grundgerüst & Persistenz | 22 |
| AP2.4 | Sampling-/Triggerlogik | 20 |
| AP2.5 | Observation Capture | 18 |
| AP2.6 | Memo, Qualität & Provenienz | 14 |
| AP2.7 | Export & AP3-Schnittstelle | 10 |
| AP2.8 | Pilot, Tests & Dokumentation | 16 |
|  | **Gesamt** | **130** |

# 33. Umsetzungsreihenfolge

1. AP1-Schnittstelle festziehen.
2. Thin Slice bauen: `Trigger → Observation → Merkmale → Memo → Save → Export`.
3. Samplinglogik ergänzen.
4. Qualitätsmodell, Missingness und Provenienz ergänzen.
5. kontrollierten Pilot durchführen.
6. AP3-Testimport gemeinsam prüfen.

# 34. Risiken und Fallbacks

| Risiko | Wirkung | Fallback |
|---|---|---|
| App wird zu komplex | Zeitbudget überschritten | Thin Slice priorisieren |
| Erfassung dauert zu lange | Sampling beeinflusst | Felder reduzieren |
| Netz instabil | Datenverlust | lokale Pufferung |
| Memo unzuverlässig | Kontextverlust | Observation ohne Memo zulassen |
| Observer interpretiert zu stark | künstliche Ground Truth | Features statt Klassen |
| Triggerreaktion verspätet | Samplingverzerrung | Delay dokumentieren |
| zu viele Pflichtfelder | hohe Abbruchquote | Missingness zulassen |
| Kontext nicht verfügbar | weniger AP3-Information | Kontext optional und qualitätsmarkiert |

# 35. Offene Designentscheidungen

1. Zielgerät?
2. Web-App oder native App?
3. Online-first oder lokale Pufferung?
4. Audioformat und Speicherort?
5. Authentifizierung?
6. verfügbare Kontextfelder?
7. finale Beobachtungsmerkmale?
8. ObserverHint zulassen?
9. Samplingfrequenz?
10. relevante Strata/Cluster?
11. maximale Memo-Dauer?
12. Aufbewahrungsdauer?
13. Exportformat?
14. minimaler AP3-Datensatz?
15. Pilot-Mindestkriterien?

# 36. Priorisierung

## Must-have
Study, SamplingPlan, SamplingEvent, Observation, Zeitstempel, strukturierte Merkmale, Kontext, Missingness, Sprachmemo, Beobachtungsqualität, Provenienz, Versionierung, Export.

## Should-have
ObserverHint, lokale Pufferung, Review-Screen, einfache Adminübersicht.

## Could-have
Dashboard, komplexe Studienverwaltung, umfangreiche Berechtigungen, automatische Qualitätswarnungen.

# 37. Status der Ausarbeitung

Direkt aus dem Projektplan abgeleitet sind insbesondere AP2 als schlanke Erfassungs-App und Versuchsinfrastruktur, der Aufwand von 130 Stunden, zufällige Multimomentaufnahmen, Sprachmemo-Erfassung, Beobachtungsstatus sowie die Übergabe von Beobachtungen und Memos an AP3.

Technischer Stack, Zielgerät, Samplingparameter, UI, Speicherarchitektur, Audioformat, konkrete Kontextfelder und Exportdetails sind operative Designentscheidungen und müssen innerhalb von AP2 geprüft und dokumentiert werden.
