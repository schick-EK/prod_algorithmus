# AP2 – Konzept für eine schlanke Erfassungs-App als Versuchsinfrastruktur

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP2 – Schlanke Erfassungs-App als Versuchsinfrastruktur  
**Dokumenttyp:** Umsetzungskonzept / Versuchsspezifikation  
**Version:** 0.2.0  
**Soll-Zeitfenster:** September 2026  
**Aufwand laut Projektplan:** 130 Stunden  
**Primäre Eingänge:** Ontologie, Beobachtungsschema und Constraints aus AP1  
**Primäre Ausgänge:** strukturierte Beobachtungen, Samplingdaten, Sprachmemos, Qualitäts- und Kontextinformationen für AP3

---

# 1. Zielsetzung

AP2 schafft die technische Versuchsinfrastruktur, mit der stichprobenartige Multimomentbeobachtungen unter realistischen Produktionsbedingungen schnell, strukturiert und reproduzierbar erfasst werden können.

Die App ist bewusst **kein produktreifes SaaS-Produkt**, sondern ein Forschungs- und Versuchsinstrument. Entscheidend ist, dass sie valide Eingangsdaten für AP3 erzeugt.

Leitfrage:

> **Wie muss eine schlanke Erfassungs-App gestaltet sein, damit zufällige Multimomentbeobachtungen mit geringer Interaktionslast, sauberem Zeitbezug und ausreichender Kontextinformation für die probabilistische Annotation in AP3 erzeugt werden können?**

---

# 2. Rolle im Gesamtverfahren

```text
AP1
Ontologie
+ Beobachtungsschema
+ Constraints
        ↓
AP2
Sampling
+ Beobachtung
+ Sprachmemo
+ Kontext
+ Qualität
        ↓
AP3
probabilistische Annotation
+ Kandidatenklassen
+ Klassenwahrscheinlichkeiten
+ Abstain
        ↓
AP5
latentes Mehrkanal-Messmodell
```

AP2 erfasst Evidenz. AP2 entscheidet nicht, welcher Produktionszustand „wahr“ ist.

---

# 3. Zielergebnisse

Am Ende von AP2 sollen vorliegen:

- lauffähiger App-Prototyp,
- Sampling- und Triggerlogik,
- technische Umsetzung des AP1-Beobachtungsschemas,
- strukturierte Beobachtungserfassung,
- Sprachmemo-Funktion,
- Kontext- und Qualitätsinformationen,
- explizites Missingness-Handling,
- eindeutige IDs und Zeitreferenzen,
- Schema-, Ontologie- und App-Versionierung,
- AP3-fähiger Export,
- Test- und Pilotdatensatz,
- Übergabedokumentation.

---

# 4. Scope

## In Scope

- Study / Versuch anlegen
- Samplingplan konfigurieren
- SamplingEvents erzeugen
- Trigger auslösen
- Beobachtung erfassen
- Kontext speichern
- strukturierte Merkmale erfassen
- Sprachmemo aufnehmen
- Beobachtungsqualität erfassen
- Missingness speichern
- Daten exportieren
- technische Testfälle durchführen

## Out of Scope

- automatische Transkription
- NLP-Klassifikation
- Wahrscheinlichkeitsberechnung
- Abstain-Kalibrierung
- MES-/ERP-Datenfusion
- Kennzahlenschätzung
- Maßnahmenpriorisierung
- produktionsreife Skalierung
- komplexe Enterprise-Rollenmodelle

---

# 5. Designprinzipien

## P1 – Capture first, classify later

Die App erfasst beobachtbare Merkmale und Kontext. Sie erzwingt keine finale Ontologieklasse.

## P2 – minimale Interaktionslast

Die Erfassung soll wenige Sekunden dauern. Kontext ist möglichst vorzubelegen; Freitext bleibt optional.

## P3 – Missingness ist zulässig

`unknown != false`

Unbekannte oder nicht sichtbare Informationen dürfen nicht durch Defaultwerte ersetzt werden.

## P4 – Samplingintegrität bleibt erhalten

Auch verpasste oder verspätete Beobachtungen werden dokumentiert.

## P5 – Zeitbezug ist Teil der Evidenz

Samplingzeit, Triggerzeit, Beobachtungszeit und Memozeit werden getrennt speicherbar gemacht.

## P6 – technische Einfachheit

Nur Funktionen mit direktem Nutzen für AP2 oder AP3 werden umgesetzt.

---

# 6. Nutzerrollen

## Observer

- Trigger sehen
- Observation öffnen
- Merkmale erfassen
- Memo aufnehmen
- Qualitätsstatus setzen
- speichern

## Study Admin / Researcher

- Study konfigurieren
- Samplingplan pflegen
- Kontextlisten verwalten
- Samplingstatus prüfen
- Daten exportieren
- Testmodus auslösen

---

# 7. Kernprozess

```text
SamplingEvent
   ↓
Trigger
   ↓
Observation öffnen
   ↓
Kontext prüfen
   ↓
Merkmale erfassen
   ↓
optional Memo
   ↓
Qualität erfassen
   ↓
Speichern
   ↓
Export an AP3
```

---

# 8. Samplingmodell

## Samplingobjekte

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

- `scheduled`
- `triggered`
- `completed`
- `missed`
- `skipped`
- `invalidated`

## Beispiel

```yaml
sampling_plan_id: PLAN_001
valid_from: 2026-09-07
valid_to: 2026-09-11
daily_window:
  start: "08:00"
  end: "16:00"
observations_per_day: 8
minimum_gap_minutes: 30
```

## Zeitbezug

```yaml
scheduled_at: 2026-09-08T10:42:30+02:00
triggered_at: 2026-09-08T10:42:30+02:00
observed_at: 2026-09-08T10:43:12+02:00
delay_seconds: 42
```

---

# 9. Samplingvarianten

## A – vollständig zufällig
Zeitpunkte werden zufällig innerhalb definierter Fenster erzeugt.

## B – geschichtet zufällig
Sampling innerhalb definierter Strata, z. B. Schicht, Linie, Bereich oder Zeitfenster.

## C – Testmodus
Manueller Trigger für technische und methodische Testfälle.

---

# 10. Observation als zentrale Dateneinheit

Minimal:

```yaml
observation_id: OBS_000184
sampling_event_id: EVENT_0142
observed_at: 2026-09-08T10:43:12+02:00
schema_version: 1.0.0
ontology_version: 1.0.0
app_version: 0.1.0
```

Die Observation referenziert:

- strukturierte Merkmale,
- Kontext,
- Memo,
- Qualitätsinformation,
- optional ObserverHint,
- Provenienz.

---

# 11. Kontextmodell

Mögliche Kontextfelder:

- `site_id`
- `area_id`
- `line_id`
- `workcenter_id`
- `machine_id`
- `order_id`
- `product_id`
- `process_step_id`
- `shift_id`
- `operator_role`

Grundregel:

> Kontext soll möglichst vorausgefüllt werden, damit die eigentliche Beobachtung kurz bleibt.

---

# 12. Strukturierte Beobachtungsmerkmale

Die App erfasst direkte Merkmale, nicht die finale Ontologieklasse.

## Maschine

- `running`
- `stopped`
- `changing_state`
- `not_visible`
- `unknown`

Zusatz:
- Alarm sichtbar
- Bedienpanel wird genutzt
- technischer Eingriff sichtbar

## Person

- `processing`
- `waiting`
- `moving`
- `transporting`
- `searching`
- `inspecting`
- `working_on_equipment`
- `communicating`
- `not_visible`
- `unclear`

## Material

- `available`
- `not_available`
- `not_visible`
- `unknown`

---

# 13. Beispiel zur Trennung von Evidenz und Klasse

```text
Maschine = stopped
Person = waiting
Material = unknown
Memo = none
```

Daraus darf AP2 nicht automatisch `PS_WAIT_MATERIAL` ableiten.

Spätere AP3-Kandidaten könnten sein:

- `PS_WAITING`
- `PS_WAIT_MACHINE`
- `PS_DISTURBANCE`
- `PS_UNKNOWN`

---

# 14. ObserverHint

Optional:

```yaml
observer_hint:
  candidate_class_id: PS_WAITING
  confidence: medium
```

Regeln:

- nie Pflicht
- getrennt von beobachteten Merkmalen
- kein Ground Truth
- eigener Evidenzkanal für AP3

---

# 15. Sprachmemo

## Zweck

Freie Kontextinformation, die über strukturierte Merkmale hinausgeht.

## Funktionen

- Aufnahme starten
- stoppen
- löschen
- erneut aufnehmen
- Dauer speichern
- Zeitstempel speichern
- mit Observation verknüpfen

## Beispiel

```yaml
memo_id: MEMO_000184
observation_id: OBS_000184
started_at: 2026-09-08T10:43:18+02:00
duration_seconds: 11
mime_type: audio/webm
status: captured
```

Memo-Status:

- `captured`
- `not_recorded`
- `cancelled`
- `capture_failed`
- `deleted`

---

# 16. Beobachtungsqualität

Vorgeschlagen:

- `high`
- `medium`
- `low`
- `not_observable`

Optionale Gründe:

- Sicht verdeckt
- Beobachtung zu kurz
- mehrere Tätigkeiten gleichzeitig
- Kontext fehlt
- Distanz zu groß
- sonstiger Grund

---

# 17. Missingness

```text
present
not_observed
not_known
not_applicable
capture_failed
```

Beispiele:

```yaml
machine_status: not_observed
order_id: not_known
memo_status: not_recorded
```

---

# 18. Datenmodell

```text
Study
│
├── SamplingPlan
│   └── SamplingEvent
│       └── Observation
│           ├── ObservationFeature
│           ├── ContextReference
│           ├── Memo
│           ├── ObserverHint
│           └── ObservationQuality
│
└── AppEvent
```

---

# 19. Technische Zielarchitektur

```text
Mobile / Tablet Web Client
          ↓
Application Layer
          ↓
API
          ↓
Structured Data Store

Object Storage
  └── Audio Memos

Export Layer
          ↓
AP3
```

Architekturprinzipien:

- schlank
- mobil nutzbar
- geringe technische Abhängigkeiten
- klare IDs
- Audio und strukturierte Daten getrennt
- reproduzierbarer Export
- Versionierung

---

# 20. Online-/Offline-Entscheidung

**Online-first** ist zu bevorzugen, wenn die Versuchsumgebung stabile Netzabdeckung bietet.

Bei instabiler Verbindung sollte zunächst lokale Pufferung geprüft werden.

Eine vollständige Offline-first-Architektur ist nur bei tatsächlichem Bedarf sinnvoll, da sie den AP2-Aufwand deutlich erhöht.

---

# 21. UI-Konzept

## Screen 1 – Study / Sampling
- aktuelle Study
- nächster Trigger
- erledigte Beobachtungen
- verpasste Beobachtungen

## Screen 2 – Observation
- Kontext
- Maschinenstatus
- Personenaktivität
- Material-/Prozesshinweise
- Memo
- Beobachtungsqualität

## Screen 3 – Memo
- Aufnahme
- Stop
- Abspielen
- Löschen
- neu aufnehmen

## Screen 4 – Review
- gewählte Merkmale
- Memo vorhanden?
- Qualitätsstatus
- fehlende Informationen
- Speichern

---

# 22. Minimaler End-to-End-Datensatz

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

---

# 23. Export an AP3

Empfohlen:

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

`manifest.json` sollte mindestens enthalten:

- Exportzeitpunkt
- Study-ID
- App-Version
- Schema-Version
- Ontologie-Version
- Anzahl Observations
- Anzahl SamplingEvents
- Anzahl Memos

---

# 24. Qualitätsanforderungen

## Q1 – eindeutige Referenzierbarkeit
Jede Observation besitzt eine eindeutige ID.

## Q2 – Zeitliche Nachvollziehbarkeit
Sampling-, Trigger-, Beobachtungs- und Memozeit bleiben unterscheidbar.

## Q3 – keine Zwangsklassifikation
Eine Observation ist auch ohne Feinklasse speicherbar.

## Q4 – Missingness bleibt erhalten
Unbekannte Informationen werden nicht mit Defaults überschrieben.

## Q5 – eindeutige Memo-Verknüpfung
Jedes Memo ist eindeutig einer Observation zugeordnet.

## Q6 – Versionierung
Schema-, Ontologie- und App-Version werden gespeichert.

## Q7 – reproduzierbarer Export
AP3 kann denselben Datensatz ohne manuelle Rekonstruktion einlesen.

---

# 25. Testfälle

- **T01 Standardfall:** Trigger → Observation → Memo → Save
- **T02 Kein Memo:** Observation bleibt gültig
- **T03 Nicht sichtbar:** Missingness statt Zwangsauswahl
- **T04 Sampling verpasst:** Event bleibt als `missed`
- **T05 Memo fehlerhaft:** Observation bleibt erhalten
- **T06 Mehrdeutig:** keine finale Klasse notwendig
- **T07 verspätete Reaktion:** Delay wird gespeichert
- **T08 doppelte ID:** Speicherung wird verhindert
- **T09 Export:** alle Referenzen vorhanden
- **T10 AP3-Testimport:** ohne manuelle Nachbearbeitung möglich

---

# 26. Qualitäts-Gates

## Gate 1 – Schema Ready
AP1-Schema, Missingness und Versionierung technisch abgebildet.

## Gate 2 – Capture Ready
Observation schnell und ohne Zwangsklassifikation erfassbar.

## Gate 3 – Sampling Ready
Randomisierung, Status und Missed Events funktionieren.

## Gate 4 – Memo Ready
Audioaufnahme und Verknüpfung funktionieren.

## Gate 5 – AP3 Ready
Export und Testimport funktionieren reproduzierbar.

---

# 27. Definition of Done

AP2 ist abgeschlossen, wenn:

- [ ] App auf Zielgerät nutzbar ist
- [ ] Study und SamplingPlan angelegt werden können
- [ ] zufällige SamplingEvents erzeugt werden
- [ ] Trigger- und Beobachtungszeit getrennt gespeichert werden
- [ ] Samplingstatus protokolliert wird
- [ ] Observation eindeutig gespeichert wird
- [ ] AP1-Beobachtungsschema technisch umgesetzt ist
- [ ] strukturierte Merkmale erfasst werden können
- [ ] Kontext gespeichert werden kann
- [ ] Missingness explizit möglich ist
- [ ] Sprachmemos aufgenommen werden können
- [ ] Memo und Observation eindeutig verknüpft sind
- [ ] Beobachtungsqualität gespeichert werden kann
- [ ] Schema-, Ontologie- und App-Version gespeichert werden
- [ ] AP3-Export erzeugt werden kann
- [ ] Testfälle erfolgreich durchlaufen wurden
- [ ] AP3-Testimport erfolgreich war
- [ ] bekannte Einschränkungen dokumentiert sind

Zentrales Abnahmekriterium:

> **Die App kann unter realistischen Versuchsbedingungen zufällige Multimomentbeobachtungen mit ausreichendem Zeit-, Kontext-, Status-, Qualitäts- und Memo-Bezug erzeugen und ohne Informationsverlust an AP3 übergeben.**

---

# 28. Liefergegenstände

| ID | Liefergegenstand |
|---|---|
| D2.1 | App-Prototyp |
| D2.2 | Sampling-Modul |
| D2.3 | Observation-Schema |
| D2.4 | Memo-Modul |
| D2.5 | Datenmodell |
| D2.6 | Exportformat |
| D2.7 | Test-/Validierungsbericht |
| D2.8 | AP3-Übergabedokument |

---

# 29. Aufwandstruktur – 130 Stunden

| Teilpaket | Inhalt | Stunden |
|---|---|---:|
| AP2.1 | AP1-Schnittstelle & Spezifikation | 14 |
| AP2.2 | UX, Daten- und Samplingmodell | 18 |
| AP2.3 | App-Grundgerüst & Persistenz | 22 |
| AP2.4 | Sampling-/Triggerlogik | 20 |
| AP2.5 | Observation Capture | 18 |
| AP2.6 | Memo & Qualitätsdaten | 14 |
| AP2.7 | Export & AP3-Schnittstelle | 10 |
| AP2.8 | Tests, Pilot & Dokumentation | 14 |
|  | **Gesamt** | **130** |

---

# 30. Umsetzungsreihenfolge

1. AP1-Schema und Mindestfelder einfrieren.
2. Thin Slice bauen: `Trigger -> Observation -> Feature -> Memo -> Save -> Export`.
3. Samplinglogik ergänzen.
4. Missingness, Qualität und Provenienz ergänzen.
5. kontrollierte Pilotbeobachtungen durchführen.
6. AP3-Testimport gemeinsam prüfen.

---

# 31. Hauptrisiken und Fallbacks

| Risiko | Wirkung | Fallback |
|---|---|---|
| App wird zu komplex | Zeitbudget wird überschritten | auf Thin Slice reduzieren |
| Erfassung dauert zu lange | Sampling wird beeinflusst | Felder reduzieren |
| Netz instabil | Datenverlust | lokale Pufferung |
| Memo fehlerhaft | Kontextverlust | Observation ohne Memo zulassen |
| Observer klassifiziert zu stark | künstliche Ground Truth | ObserverHint separat |
| verspätete Trigger-Reaktion | Stichprobenverzerrung | Delay speichern |
| zu viele Pflichtfelder | Abbrüche | Missingness zulassen |

---

# 32. Offene Designentscheidungen

1. Zielgerät: Smartphone, Tablet oder Desktop?
2. Web-App oder native App?
3. Online-first oder lokale Pufferung?
4. Speicherort für Audio?
5. Authentifizierung erforderlich?
6. verfügbare Kontextfelder?
7. finale Beobachtungsmerkmale im Pilot?
8. ObserverHint zulassen?
9. Samplingfrequenz?
10. relevante Strata/Cluster?
11. Aufbewahrungsdauer für Memos?
12. Exportformat JSON, JSONL, CSV?
13. minimaler Datensatz für AP3?

---

# 33. Forschungsrelevanz

Der Forschungsbeitrag von AP2 liegt nicht in der Entwicklung einer allgemeinen Erfassungs-App.

Methodisch relevant ist vielmehr zu untersuchen:

- welche minimale Erfassungsstruktur benötigt wird,
- welche beobachtungsnahen Merkmale ausreichend sind,
- wie Samplingverzug dokumentiert werden muss,
- welche Qualitätsinformationen AP3 benötigt,
- welche Kontextinformationen tatsächlich Mehrwert liefern,
- wie stark ein Sprachmemo zusätzliche semantische Evidenz liefert,
- wie Missingness ohne Zwangsinterpretation erfasst werden kann.

Die App ist damit das **Experimentierinstrument** für die nachfolgenden methodischen Arbeitspakete.

---

# 34. Status der Ausarbeitung

Direkt aus dem Projektplan abgeleitet sind insbesondere:

- AP2 als schlanke Erfassungs-App und Versuchsinfrastruktur,
- September 2026,
- 130 Stunden,
- zufällige Multimomentaufnahmen,
- Sprachmemo-Erfassung,
- Beobachtungsstatus,
- Übergabe von Beobachtungen und Memos an AP3.

Technischer Stack, Zielgerät, Samplingparameter, UI, Speicherarchitektur, Audioformat und Exportdetails sind noch operative Designentscheidungen und müssen im Arbeitspaket geprüft und dokumentiert werden.
