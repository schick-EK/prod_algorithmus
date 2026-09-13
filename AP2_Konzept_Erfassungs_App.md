# AP2 – Konzept für eine schlanke Erfassungs-App als Versuchsinfrastruktur

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP2 – Schlanke Erfassungs-App als Versuchsinfrastruktur  
**Dokumenttyp:** Umsetzungskonzept / technische Versuchsspezifikation  
**Status:** Arbeitsentwurf v0.1  
**Soll-Zeitfenster:** September 2026  
**Aufwand laut Projektplan:** 130 Stunden  
**Rolle im Gesamtvorhaben:** Versuchsinfrastruktur für AP3

---

# 1. Zweck und Einordnung

AP2 schafft die technische Versuchsinfrastruktur, mit der reale bzw. stichprobenartige Multimomentaufnahmen erzeugt und strukturiert gespeichert werden können.

Der Fokus liegt ausdrücklich nicht auf einer produktreifen Softwarelösung. Die Anwendung soll vielmehr eine schlanke, kontrollierte und ausreichend robuste Versuchsumgebung bereitstellen, mit der die methodischen Hypothesen des Gesamtprojekts geprüft werden können.

Die App muss insbesondere ermöglichen:

- zufällige oder regelbasierte Beobachtungszeitpunkte,
- schnelle Erfassung strukturierter Beobachtungsmerkmale,
- Aufnahme eines Sprachmemos,
- Speicherung des Beobachtungskontexts,
- Speicherung von Sampling-Informationen,
- eindeutige Beobachtungs-IDs,
- Versionierung des Beobachtungsschemas,
- spätere Weitergabe an AP3,
- Erfassung ohne erzwungene finale Zustandsklassifikation.

Leitfrage:

> **Wie muss eine bewusst schlanke Erfassungsumgebung gestaltet sein, damit unter realen Bedingungen hinreichend strukturierte, zeitlich referenzierbare und für AP3 nutzbare Multimomentbeobachtungen mit Sprachmemos erzeugt werden können?**

---

# 2. Rolle im Gesamtverfahren

```text
AP1
Ontologie + Beobachtungsschema
        ↓
AP2
Erfassungs-App / Versuchsdaten
        ↓
AP3
probabilistische Annotation
        ↓
AP5
latentes Mehrkanal-Messmodell
```

AP2 trifft keine Entscheidung über die wahre Klasse einer Beobachtung. Die App erzeugt die Evidenzbasis, die AP3 später probabilistisch auf die AP1-Ontologie abbildet.

---

# 3. Zielergebnisse

Am Ende von AP2 soll eine funktionsfähige Versuchsinfrastruktur vorliegen, mit der:

1. Beobachtungssituationen angelegt werden können,
2. Beobachtungszeitpunkte zufällig bzw. nach Samplingvorgaben ausgelöst werden können,
3. Beobachtungsstatus schnell erfasst werden können,
4. Sprachmemos aufgenommen werden können,
5. Kontextinformationen gespeichert werden können,
6. fehlende Informationen explizit zulässig bleiben,
7. Beobachtungen eindeutig referenzierbar sind,
8. die verwendete Schema-/Ontologieversion gespeichert wird,
9. Daten reproduzierbar exportiert werden können,
10. AP3 auf Beobachtung und Memo zugreifen kann.

---

# 4. Scope und Abgrenzung

## Bestandteil von AP2

- technische App-Grundstruktur,
- Nutzeroberfläche für Beobachtungserfassung,
- Sampling-/Triggermechanismus,
- Beobachtungsschema aus AP1,
- Sprachmemo-Aufnahme,
- Speicherung von Beobachtungsstatus,
- Kontext- und Samplingfelder,
- Datenspeicherung,
- Export,
- Basis-Provenienz,
- Testfälle,
- technische Dokumentation,
- Übergabe an AP3.

## Nicht Bestandteil von AP2

- automatische Textklassifikation,
- probabilistische Klassenwahrscheinlichkeiten,
- Abstain-Kalibrierung,
- MES-/ERP-Integration,
- bayesianische Datenfusion,
- Kennzahlenschätzung,
- produktionsreife Enterprise-Architektur,
- komplexes Rollen-/Rechtemodell,
- produktiver 24/7-Betrieb.

---

# 5. Grundprinzipien

## P1 – Capture first, classify later

Die App soll Beobachtungen erfassen, nicht die spätere Modellentscheidung vorwegnehmen.

`Erfassung != Klassifikation`

Ein optionaler Beobachterhinweis ist zulässig, darf aber niemals als Ground Truth gespeichert werden.

## P2 – geringe Interaktionslast

Eine Multimomentaufnahme muss in kurzer Zeit erfassbar sein. Deshalb: wenige Pflichtfelder, große Eingabeelemente, sinnvolle Defaults, keine langen Formulare.

## P3 – Unsicherheit und Missingness sind zulässig

Nicht jede Beobachtung muss vollständig sein. Kein Memo, unbekannter Auftrag, schlechte Sichtbarkeit oder mehrdeutige Situation müssen speicherbar bleiben.

## P4 – Zeitbezug ist kritisch

Jede Beobachtung benötigt einen belastbaren Zeitbezug, weil spätere Evidenzkanäle zeitlich verknüpft werden.

## P5 – Provenienz bleibt erhalten

Die Herkunft einer Beobachtung und eines Memos muss nachvollziehbar sein.

## P6 – Versuchsinfrastruktur statt Produktentwicklung

Technische Entscheidungen werden danach beurteilt, ob sie die für AP3 benötigten Versuchsdaten zuverlässig erzeugen.

---

# 6. Nutzerrollen

## Observer

- Samplingauftrag sehen,
- Beobachtung starten,
- Status erfassen,
- Memo aufnehmen,
- Beobachtung speichern.

## Research/Admin

- Versuch konfigurieren,
- Samplingregeln festlegen,
- Kontextlisten pflegen,
- Beobachtungen prüfen,
- Daten exportieren,
- Schema-/App-Version kontrollieren.

---

# 7. Kern-Nutzerfluss

```text
Sampling-Trigger
      ↓
Beobachtung öffnen
      ↓
Kontext prüfen/ergänzen
      ↓
sichtbare Merkmale erfassen
      ↓
optional Memo aufnehmen
      ↓
Beobachtungsqualität angeben
      ↓
Speichern
```

Ziel ist eine strukturierte Erfassung innerhalb weniger Sekunden; ein Memo ist optional zusätzlich möglich.

---

# 8. Sampling-/Triggermechanismus

Der Mechanismus sollte:

- Beobachtungsfenster definieren,
- zufällige Zeitpunkte innerhalb eines Fensters erzeugen,
- Mindestabstände unterstützen,
- Schichten berücksichtigen können,
- Cluster referenzieren können,
- geplante und tatsächlich durchgeführte Beobachtungen unterscheiden,
- verpasste Beobachtungen dokumentieren.

Beispiel:

```yaml
sampling_plan_id: PLAN_001
valid_from: 2026-09-07
valid_to: 2026-09-11
daily_window:
  start: "08:00"
  end: "16:00"
observations_per_day: 8
minimum_gap_minutes: 30
stratum:
  shift: early
cluster:
  line_id: LINE_01
```

Samplingstatus:

- `scheduled`
- `triggered`
- `completed`
- `missed`
- `skipped`
- `invalidated`

---

# 9. Beobachtungsschema

AP2 übernimmt das Beobachtungsschema aus AP1 und operationalisiert es technisch.

## Pflichtfelder

| Feld | Zweck |
|---|---|
| `observation_id` | eindeutige Beobachtung |
| `observed_at` | tatsächlicher Beobachtungszeitpunkt |
| `sampling_event_id` | Bezug zum Samplingtrigger |
| `schema_version` | Beobachtungsschema |
| `app_version` | technische Reproduzierbarkeit |
| `visibility_quality` | Beobachtbarkeit |

## Kontextfelder

Je nach Versuch:

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

---

# 10. Strukturierte Beobachtungsmerkmale

Die App soll beobachtungsnahe Merkmale erfassen, nicht bereits die Ontologieentscheidung erzwingen.

## Maschinenmerkmale

- Maschine läuft
- Maschine steht
- Maschinenzustand nicht sichtbar
- Alarm sichtbar
- Bedienpanel wird genutzt

## Personenmerkmale

- Person bearbeitet Produkt
- Person wartet
- Person bewegt Material
- Person sucht
- Person prüft
- Person arbeitet an Maschine
- Aktivität unklar

## Material-/Prozessmerkmale

- Material vorhanden
- Material offensichtlich nicht vorhanden
- Produkt wird bearbeitet
- Produkt wird geprüft
- Nacharbeit erkennbar
- Situation nicht eindeutig

---

# 11. Optionaler Beobachterhinweis

```yaml
observer_hint:
  candidate_class_id: PS_WAITING
  confidence: medium
```

Regeln:

- optional,
- klar als subjektiver Hinweis gekennzeichnet,
- getrennt von strukturierten Merkmalen,
- nicht als Ground Truth behandeln.

---

# 12. Sprachmemo-Funktion

Die App soll:

- Memoaufnahme starten und stoppen,
- Memo eindeutig mit Observation verknüpfen,
- Aufnahmedauer speichern,
- Zeitstempel speichern,
- Abbruch erlauben,
- optional Wiederholung erlauben,
- fehlendes Memo zulassen.

Beispiel:

```yaml
memo_id: MEMO_000184
observation_id: OBS_000184
started_at: 2026-09-08T10:43:12+02:00
duration_seconds: 11
mime_type: audio/webm
status: captured
```

Nicht Bestandteil von AP2 sind Transkription, Klassifikation oder Interpretation.

---

# 13. Memo-Handling und Datenschutz

Mindestens vorzusehen:

- eindeutige Verknüpfung über IDs,
- keine unnötige Speicherung personenbezogener Daten,
- kontrollierter Zugriff,
- dokumentierter Speicherort,
- Löschbarkeit einzelner Memos,
- Trennung von Memo-Datei und strukturiertem Beobachtungsdatensatz.

Die konkrete Datenschutz- und Informationssicherheitsarchitektur bleibt eine AP2-Designentscheidung.

---

# 14. Beobachtungsqualität

Vorschlag:

- `high`
- `medium`
- `low`
- `not_observable`

Optionale Gründe:

- Sicht verdeckt
- Beobachtung zu kurz
- mehrere Aktivitäten gleichzeitig
- Kontext fehlt
- räumliche Distanz
- sonstiger Grund

---

# 15. Missingness-Modell

Vorgeschlagene Werte:

- `present`
- `not_observed`
- `not_applicable`
- `not_known`
- `capture_failed`

Grundsatz:

`missing != false`

---

# 16. Datenmodell

Kerntabellen/Entitäten:

```text
Study
SamplingPlan
SamplingEvent
Observation
ObservationFeature
Memo
ContextReference
ObserverHint
AppEvent
```

Beziehungen:

```text
Study
  ↓
SamplingPlan
  ↓
SamplingEvent
  ↓
Observation
  ├── ObservationFeature
  ├── Memo
  ├── ContextReference
  └── ObserverHint
```

---

# 17. Beispiel-Datensatz

```yaml
study_id: STUDY_001
sampling_plan_id: PLAN_001
sampling_event_id: EVENT_0142

observation:
  observation_id: OBS_000184
  observed_at: 2026-09-08T10:43:12+02:00
  schema_version: 1.0.0
  app_version: 0.1.0

  context:
    site_id: SITE_01
    line_id: LINE_01
    workcenter_id: WC_12
    process_step_id: ASSEMBLY_04

  observed_features:
    machine_status: stopped
    operator_activity: waiting
    material_visible: unknown

  visibility_quality: medium

  memo:
    memo_id: MEMO_000184
    duration_seconds: 11
    status: captured

  observer_hint:
    candidate_class_id: PS_WAITING
    confidence: medium
```

---

# 18. Technische Architektur – Zielbild

```text
Mobile/Web Client
      ↓
Application/API Layer
      ↓
Structured Data Store
      ├── Observation Data
      ├── Sampling Data
      └── Metadata

Object/File Storage
      └── Audio Memos

Export Layer
      ↓
AP3 Input
```

Architekturprinzipien:

- geringer Implementierungsaufwand,
- mobile Bedienbarkeit,
- klarer Datenexport,
- Trennung strukturierter Daten und Audio,
- eindeutige IDs,
- Versionsinformationen,
- reproduzierbarer Versuch.

---

# 19. Technologiestack – Entscheidungskriterien

| Kriterium | Bedeutung |
|---|---|
| Implementierungszeit | innerhalb AP2 realisierbar |
| Mobile Nutzbarkeit | Smartphone/Tablet |
| Audioaufnahme | zuverlässig |
| Offline-Fähigkeit | abhängig vom Einsatz |
| Datenexport | einfach und reproduzierbar |
| Datenschutz | angemessen kontrollierbar |
| Wartungsaufwand | gering |
| Erweiterbarkeit | ausreichend für AP3 |

Der konkrete Stack ist bewusst noch nicht festgelegt.

---

# 20. Online-/Offline-Betrieb

## Online-first

Vorteile: einfachere Architektur, sofortige Speicherung, weniger Synchronisationslogik.  
Nachteil: Netzverfügbarkeit erforderlich.

## Offline-first

Vorteil: Nutzung ohne stabile Verbindung.  
Nachteile: Synchronisation, Konfliktbehandlung, höherer Implementierungsaufwand.

Empfehlung: Offline-Fähigkeit nur umsetzen, wenn die reale Versuchsumgebung sie tatsächlich erfordert.

---

# 21. Bedienoberfläche

## Screen 1 – Sampling-Übersicht
- nächste Beobachtung
- aktuelle Versuchskonfiguration
- abgeschlossene Beobachtungen
- verpasste Beobachtungen

## Screen 2 – Beobachtung
- Kontext
- große Statusbuttons
- Beobachtungsqualität
- Memo-Button

## Screen 3 – Memo
- Aufnahme
- Stop
- Löschen/Wiederholen
- Dauer

## Screen 4 – Abschluss
- Zusammenfassung
- fehlende Felder sichtbar
- Speichern

---

# 22. Samplinglogik – Betriebsmodi

## A – vollständig zufällig
Zeitpunkte innerhalb definierter Fenster.

## B – geschichtet zufällig
Zeitpunkte innerhalb vorgegebener Schichten, z. B. Schicht, Linie oder Zeitfenster.

## C – kontrollierter Testmodus
Manueller Trigger für technische und methodische Testfälle.

---

# 23. Sampling-Provenienz

```yaml
sampling:
  scheduled_at: 2026-09-08T10:42:30+02:00
  triggered_at: 2026-09-08T10:42:30+02:00
  observed_at: 2026-09-08T10:43:12+02:00
  delay_seconds: 42
```

Trigger- und Beobachtungszeit werden getrennt gespeichert.

---

# 24. Validierungsfälle

## T1 – Standardbeobachtung
Trigger, Status, Memo, Speicherung.  
Erwartung: vollständiger AP3-fähiger Datensatz.

## T2 – kein Memo
Observation bleibt gültig; Memo als fehlend dokumentiert.

## T3 – Beobachtung verpasst
SamplingEvent bleibt als `missed` vorhanden.

## T4 – Situation nicht sichtbar
`visibility_quality = not_observable`; keine erzwungene Statusauswahl.

## T5 – Memoaufnahme fehlerhaft
Observation bleibt erhalten; Memo als `capture_failed` markiert.

## T6 – mehrdeutige Beobachtung
Merkmale werden gespeichert; keine Pflicht zu einer Feinklasse.

## T7 – verzögerte Beobachtung
Trigger- und Beobachtungszeit bleiben getrennt.

---

# 25. Qualitäts-Gates

## Gate 1 – Schema
AP1-Felder technisch abbildbar, Missingness möglich, keine harte Klassifikation.

## Gate 2 – Sampling
Zufällige Trigger, nachvollziehbarer Triggerstatus, verpasste Beobachtungen dokumentiert.

## Gate 3 – Memo
Audio aufgenommen, eindeutig verknüpft, Fehlerzustände abbildbar.

## Gate 4 – Datenqualität
Eindeutige IDs, Zeitstempel, Schema-/App-Version und reproduzierbarer Export.

## Gate 5 – AP3-Übergabe
AP3 kann Observation, strukturierte Merkmale, Kontext, Memo, Qualitäts-, Sampling- und Versionsinformationen beziehen.

---

# 26. Definition of Done

AP2 ist abgeschlossen, wenn:

- [ ] App auf vorgesehener Geräteumgebung nutzbar ist
- [ ] Samplingtrigger funktionieren
- [ ] SamplingEvents protokolliert werden
- [ ] Beobachtungen angelegt werden können
- [ ] Pflichtfelder aus AP1 umgesetzt sind
- [ ] Kontextinformationen gespeichert werden können
- [ ] strukturierte Beobachtungsmerkmale erfassbar sind
- [ ] fehlende/unklare Informationen zulässig sind
- [ ] Sprachmemos aufgenommen werden können
- [ ] Memo und Observation eindeutig verknüpft sind
- [ ] Beobachtungsqualität speicherbar ist
- [ ] Triggerzeit und Beobachtungszeit getrennt gespeichert werden
- [ ] Schema- und App-Version gespeichert werden
- [ ] Daten exportiert werden können
- [ ] Testdatensatz für AP3 erzeugt wurde
- [ ] AP3 den Export technisch einlesen kann
- [ ] bekannte technische Einschränkungen dokumentiert sind

---

# 27. Liefergegenstände

- **D1:** App-Prototyp
- **D2:** Sampling-Modul
- **D3:** Beobachtungsschema-Implementierung
- **D4:** Memo-Modul
- **D5:** Datenmodell
- **D6:** Exportformat
- **D7:** Test- und Validierungsbericht
- **D8:** AP2-Übergabedokument

---

# 28. Aufwandstruktur für 130 Stunden

| Teilpaket | Inhalt | Stunden |
|---|---|---:|
| AP2.1 | Anforderungen & AP1-Schnittstelle | 14 |
| AP2.2 | UX und Datenmodell | 16 |
| AP2.3 | App-Grundgerüst & Datenspeicherung | 24 |
| AP2.4 | Sampling-/Triggermechanismus | 20 |
| AP2.5 | Beobachtungserfassung | 18 |
| AP2.6 | Sprachmemo-Funktion | 14 |
| AP2.7 | Export & AP3-Schnittstelle | 10 |
| AP2.8 | Tests, Fehlerbehebung & Dokumentation | 14 |
|  | **Gesamt** | **130** |

Diese Verteilung ist ein operativer Vorschlag.

---

# 29. Vorgeschlagener Umsetzungsablauf

## Phase 1 – Spezifikation
AP1-Schema übernehmen, Must-have-Felder festlegen, Geräte-/Betriebsumgebung und Speicherung klären.

## Phase 2 – Minimaler End-to-End-Flow

```text
Trigger
→ Observation
→ Status
→ Memo
→ Save
→ Export
```

## Phase 3 – Sampling ausbauen
Randomisierung, Schichten, Triggerstatus, verpasste Beobachtungen.

## Phase 4 – Datenqualität ergänzen
Missingness, Visibility, Provenienz, Versionen.

## Phase 5 – Pilot
Kontrollierte Beobachtungen durchführen.

## Phase 6 – AP3-Übergabe
Export mit Testbeobachtungen erzeugen und technisch prüfen.

---

# 30. Risiken und Fallbacks

## R1 – App wird zu komplex
Fallback: auf minimalen Erfassungspfad zurückführen.

## R2 – Beobachtungsdauer zu lang
Fallback: Pflichtfelder reduzieren, Statusbuttons vereinfachen, Memo optional halten.

## R3 – Sampling wird durch verzögerte Reaktion verzerrt
Umgang: Trigger- und Beobachtungszeit getrennt speichern.

## R4 – Audioaufnahme unzuverlässig
Fallback: Observation ohne Memo zulassen.

## R5 – schlechte Netzabdeckung
Fallback: lokale Pufferung prüfen; vollständiges Offline-first nur bei Bedarf.

## R6 – Beobachter klassifizieren zu stark
Umgang: beobachtungsnahe Statusfelder statt Feinklassen; ObserverHint separat und optional.

---

# 31. Offene Designentscheidungen

1. Zielgerät: Smartphone, Tablet oder Browser?
2. Online-only oder lokale Pufferung?
3. konkreter Tech-Stack?
4. zentrale oder lokale Datenspeicherung?
5. Audioformat und Speicherort?
6. Aufbewahrungsdauer der Memos?
7. Authentifizierung erforderlich?
8. welche Kontextfelder stehen im Pilot zur Verfügung?
9. welche Statusfelder aus AP1 werden angezeigt?
10. welche Samplingfrequenz wird genutzt?
11. welche Schichten/Cluster werden benötigt?
12. wie werden verpasste Beobachtungen behandelt?
13. darf der Observer einen Klassenhinweis geben?
14. Export als JSON, CSV oder beides?
15. welcher minimale Datensatz reicht für AP3?

---

# 32. Empfohlenes Exportformat für AP3

```text
exports/
├── observations.jsonl
├── sampling_events.csv
├── memos/
│   ├── MEMO_000184.webm
│   └── MEMO_000185.webm
├── schema.json
└── manifest.json
```

JSON/JSONL eignet sich für vollständige Beobachtungsobjekte; CSV kann ergänzend für schnelle Analysen genutzt werden.

---

# 33. Übergabespezifikation an AP3

AP3 soll je Observation mindestens erhalten:

- `observation_id`
- Zeitbezug
- Samplingbezug
- strukturierte Beobachtungsmerkmale
- Kontext
- Memo-Referenz
- Beobachtungsqualität
- Missingness
- optional ObserverHint
- Beobachtungsschema-Version
- App-Version

```text
AP2
Observation
+ Statusmerkmale
+ Memo
+ Kontext
+ Sampling
+ Qualität
        ↓
AP3
Text-/Memo-zu-Ontologie
+ Kandidatenklassen
+ Wahrscheinlichkeiten
+ Abstain
```

---

# 34. Abnahmekriterium

AP2 ist erfolgreich, wenn folgende Frage mit Ja beantwortet werden kann:

> **Können unter realistischen Versuchsbedingungen zufällige Multimomentbeobachtungen mit ausreichendem Zeit-, Kontext-, Status- und Memo-Bezug so erhoben werden, dass AP3 daraus reproduzierbar eine unsichere semantische Annotation entwickeln und testen kann?**

---

# 35. Quellenbasis und Status der Konkretisierung

Direkt aus dem Projektplan abgeleitet sind insbesondere:

- AP2 als schlanke Erfassungs-App und Versuchsinfrastruktur,
- Soll-Zeitfenster September 2026,
- 130 Stunden Eigenleistung,
- zufällige Multimomentaufnahmen,
- Sprachmemo-Erfassung,
- Beobachtungsstatus-Felder,
- Beobachtungen und Memos als Übergabe an AP3,
- Eignung zur Datenerzeugung statt produktreifem Funktionsumfang.

Der Projektplan lässt insbesondere technischen Stack, Geräte-/Betriebsumgebung, Datenspeicherung, Samplingmechanismus und Memo-Handling offen. Die Architektur-, UX-, Datenmodell-, Export- und Stundenverteilungsvorschläge in diesem Dokument sind daher operative Designvorschläge für AP2 und müssen im Arbeitspaket dokumentiert entschieden und getestet werden.
