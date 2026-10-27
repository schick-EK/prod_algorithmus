# AP3 – Mehrkanalige unsichere Annotation mit Abstain-Logik

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP3 – Mehrkanalige unsichere Annotation mit Abstain-Logik  
**Dokumenttyp:** Fachlich-methodisches Konzept / Versuchsspezifikation / Übergabegrundlage  
**Version:** 0.2.0  
**Soll-Zeitfenster:** Oktober 2026 – März 2027  
**Aufwand laut Projektplan:** 875 Stunden  
**Abhängigkeiten:** AP1 + AP2  
**Primäre Übergabe:** probabilistische Evidenzbeschreibung bzw. begründeter Abstain-Fall an AP5

# 1. Zweck von AP3

AP3 bildet strukturierte Beobachtungen sowie Sprach- und Textinformationen aus AP2 auf die in AP1 definierte Ontologie ab. Im Gegensatz zu einer klassischen Klassifikation soll AP3 keine harte Zielklasse erzwingen. Jede Beobachtung wird als fehlerbehaftete Evidenz behandelt.

Mögliche Ergebnisformen sind:
- Wahrscheinlichkeitsverteilung über mehrere zulässige Klassen
- belastbare Aussage nur auf gröberer Ontologieebene
- expliziter Abstain-/Nichtentscheidungsstatus
- Kennzeichnung, dass Ontologie oder Evidenz für den Fall nicht ausreichen

> **Leitfrage:** Wie können sparse, mehrdeutige und fehlerbehaftete Beobachtungs- und Sprachinformationen ohne unternehmensspezifische Trainingsdaten so auf die Produktionsontologie abgebildet werden, dass Unsicherheit erhalten bleibt und AP5 keine künstlich sichere Einzelklasse erhält?

# 2. Direkte Vorgaben aus dem Projektplan

## Zweck
Sprach- und Textinformationen werden als fehlerbehaftete Evidenz auf die Ontologie abgebildet. Das Verfahren soll Unsicherheit explizit ausgeben und sich bei unzureichender Evidenz enthalten können.

## Eingänge
- Ontologie, zulässige Klassen und Constraints aus AP1
- Multimomentaufnahmen und Sprach-/Text-Memos aus AP2
- keine unternehmensspezifischen Trainingsdaten als Voraussetzung

## Kernarbeiten
- Sprach-/Text-zu-Ontologie-Zuordnung entwickeln
- Regeln und kontrollierte KI kombinieren
- Klassenwahrscheinlichkeiten statt harter Labels erzeugen
- Unsicherheits- und Enthaltungslogik kalibrieren

## Ergebnisse
- Kandidatenklassen mit Wahrscheinlichkeiten
- Abstain-/Nichtentscheidungsstatus
- fehlerbehafteter Evidenzkanal für AP5

## Risiko und Fallback
Ohne lokale Trainingsdaten könnte die Annotation nicht ausreichend kalibrierbar sein. Vorgesehene Fallbacks:
- schwach überwachte Labelmodelle
- robuste Sensitivitätsmodelle

# 3. Rolle im Gesamtverfahren

```text
AP1
Ontologie + Klassenraum + Granularität + Constraints
        ↓
AP2
Multimomentbeobachtung + Status + Sprach-/Textmemo + Kontext
        ↓
AP3
semantische Evidenzbildung
+ Kandidatenklassen
+ Wahrscheinlichkeiten
+ Unsicherheit
+ Abstain
        ↓
AP5
latente Zustandsverteilung + Mehrkanalfusion
```

AP3 schätzt nicht den wahren Produktionszustand. Dieser bleibt latent und wird erst in AP5 aus mehreren Evidenzkanälen geschätzt.

# 4. Abgrenzung zu AP5

AP3 modelliert Unsicherheit der semantischen Annotation.

Beispiel:

```text
Beobachtung:
Mitarbeiter wartet.
Memo:
"Material ist noch nicht da."

AP3:
P(Warten auf Material) = 0,68
P(Warten auf Information) = 0,10
P(Warten auf Maschine) = 0,07
P(Unknown) = 0,15
```

AP5 modelliert später den latenten tatsächlichen Zustand unter Einbezug weiterer Kanäle wie MES und ERP.

# 5. Forschungsfragen

1. Wie wird aus sparsamer Beobachtungs- und Sprachevidenz ein zulässiger Kandidatenraum erzeugt?
2. Welche Arbeitsteilung zwischen Regeln und kontrollierter KI ist robust?
3. Wie werden Rohscores in interpretierbare Wahrscheinlichkeiten überführt?
4. Wie lässt sich ohne große lokale Trainingsmenge kalibrieren?
5. Wann reicht Evidenz für G3, wann nur für G2/G1?
6. Wann ist Abstain besser als eine erzwungene Klasse?
7. Wie werden widersprüchliche Kanäle behandelt?
8. Wie werden Out-of-Scope-Fälle erkannt?
9. Wie robust sind Ergebnisse gegenüber Missingness und Gewichtungsannahmen?
10. Welche Informationen benötigt AP5 zwingend?

# 6. Methodische Grundprinzipien

- Keine harte Zwischenentscheidung.
- Geschlossener Klassenraum aus AP1.
- Unsicherheit bleibt erhalten.
- Abstain ist reguläres Ergebnis.
- Granularität ist evidenzabhängig.
- Evidenzkanäle bleiben nachvollziehbar.
- Kalibrierung vor Scheingenauigkeit.
- Jede Annotation bleibt versioniert reproduzierbar.

# 7. Eingabemodell

```yaml
observation_id: OBS_000184

structured_observation:
  machine_status: stopped
  operator_activity: waiting
  material_status: unknown

memo:
  text: "Material für den Auftrag ist noch nicht da."

context:
  workcenter_id: WC_12
  process_step_id: ASSEMBLY_04

observation_quality:
  level: medium

missingness:
  material_status: not_known

versions:
  observation_schema: 1.0.0
  ontology: 1.0.0
```

# 8. Evidenzkanäle

- Kanal A: strukturierte Beobachtung
- Kanal B: Sprach-/Textmemo
- Kanal C: Kontext
- optional Kanal D: ObserverHint

ObserverHint ist niemals Ground Truth.

# 9. Zielobjekt: AnnotationResult

```yaml
annotation_id: ANN_000184
observation_id: OBS_000184

ontology_version: 1.0.0
pipeline_version: 0.2.0

candidate_distribution:
  - class_id: PS_WAIT_MATERIAL
    probability: 0.52
  - class_id: PS_WAIT_INFORMATION
    probability: 0.21
  - class_id: PS_WAIT_MACHINE
    probability: 0.12
  - class_id: PS_UNKNOWN
    probability: 0.15

resolved_level:
  granularity: G3

decision:
  status: PROBABILISTIC
  abstain: false

quality:
  evidence_sufficiency: medium
  channel_conflict: false
  calibration_status: usable
```

# 10. Ergebnisstatus

```text
PROBABILISTIC
COARSE_ONLY
ABSTAIN_INSUFFICIENT_EVIDENCE
ABSTAIN_CONFLICTING_EVIDENCE
ABSTAIN_MISSING_REQUIRED_CONTEXT
ABSTAIN_OUT_OF_SCOPE
ABSTAIN_UNCALIBRATED
INVALID_INPUT
```

# 11. Gesamtpipeline

```text
AP2 Observation
→ Input Validation
→ Evidence Preparation
→ Candidate Generation
→ Rule-based Evidence
→ Controlled AI Evidence
→ Constraint Handling
→ Evidence Combination
→ Probability Calibration
→ Granularity Resolution
→ Abstain Decision
→ AnnotationResult
→ AP5
```

# 12. Input Validation

Geprüft werden mindestens:
- Observation-ID
- bekannte Ontologieversion
- formale Gültigkeit der Features
- korrekt dokumentierte Missingness
- Memo vorhanden oder korrekt als fehlend markiert
- gültiger Kontext
- ObservationQuality

# 13. Evidence Preparation

- Originaltext erhalten
- Transkript separat speichern
- Normalisierung dokumentieren
- keine irreversiblen semantischen Änderungen
- relevante Textstellen referenzierbar halten

# 14. Candidate Generation

Ziel ist ein zulässiger Kandidatenraum, nicht sofort eine Zielklasse.

Beispiel:

```text
operator_activity = waiting
memo = "Material fehlt"
```

Kandidaten:

```text
PS_WAITING
PS_WAIT_MATERIAL
PS_UNKNOWN
```

# 15. Regelbasierte Evidenz

Beispiele:

```text
IF operator_activity = waiting
THEN evidence_for PS_WAITING-family

IF memo indicates missing material
THEN evidence_for PS_WAIT_MATERIAL

IF material_status = available
THEN evidence_against PS_WAIT_MATERIAL

IF required_context missing
THEN G3 may not be resolved
```

Regeln liefern Evidenz, nicht automatisch Ground Truth.

# 16. Kontrollierte KI

Die KI erhält Observation, Memo, Kontext, eine definierte Teilmenge der Ontologie sowie relevante Constraints.

Zulässige Aufgaben:
- Kandidaten unterstützen oder abschwächen
- Textstellen referenzieren
- Mehrdeutigkeit markieren
- fehlende Evidenz benennen

Nicht zulässig:
- neue Klassen erfinden
- Ontologie ändern
- harte Constraints umgehen

# 17. Strukturierte KI-Ausgabe

```yaml
candidate_evidence:
  - class_id: PS_WAIT_MATERIAL
    support_score: 0.82
    evidence:
      - "Material ... noch nicht da"

ambiguity:
  present: true
  reason: material_status_not_directly_observed
```

Support Scores sind noch keine kalibrierten Wahrscheinlichkeiten.

# 18. Constraint Handling

AP1-Constraints werden systematisch angewendet:
- unzulässige Klassen entfernen
- fehlenden Pflichtkontext berücksichtigen
- deprecated Klassen ausschließen
- Fallbackklasse bestimmen
- Constraint-Anwendungen protokollieren

# 19. Evidence Combination

Drei experimentell relevante Varianten:

## A – Rule-Gated AI
Regeln bestimmen Kandidatenraum; KI bewertet nur diese Kandidaten.

## B – Parallel Ensemble
Regeln und KI liefern getrennte Evidenzscores; anschließend Kombination.

## C – AI + Constraint Projection
KI liefert Rohscores; anschließend Projektion auf zulässigen Ontologieraum.

# 20. Widersprüchliche Evidenz

Konflikte bleiben sichtbar.

```yaml
conflict:
  active: true
  channels:
    - structured_observation
    - memo
  severity: high
```

Konflikte können Unsicherheit erhöhen, Granularität reduzieren oder Abstain auslösen.

# 21. Von Scores zu Wahrscheinlichkeiten

```text
Rohscore
→ kombinierter Score
→ Kalibrierung
→ Klassenwahrscheinlichkeit
```

Rohscores dürfen nicht als Wahrscheinlichkeiten bezeichnet werden.

# 22. Kalibrierung

Ziel ist eine empirisch interpretierbare Unsicherheitsrepräsentation.

Mögliche Metriken:
- Brier Score
- Log Loss
- Expected Calibration Error
- Reliability Diagram
- klassenweise Calibration Checks

# 23. Referenzdatensatz

Der Testsatz sollte enthalten:
- eindeutige Fälle
- mehrdeutige Fälle
- sparse Fälle
- widersprüchliche Fälle
- Missing-Context-Fälle
- Out-of-Scope-Fälle
- Fälle mit niedriger Beobachtungsqualität

# 24. Referenzwahrheit

Mögliche Referenzformen:
- eindeutige Zielklasse
- zulässige Kandidatenmenge
- zulässige Oberklasse
- explizit nicht identifizierbarer Fall
- erwarteter Abstain-Fall

# 25. Granularitätsentscheidung

AP3 wählt die höchste tragfähige Granularität.

```text
G3 ausreichend?
  nein
G2 ausreichend?
  nein
G1 ausreichend?
  nein
ABSTAIN
```

# 26. Abstain-Logik

Mögliche Trigger:
- geringe maximale Wahrscheinlichkeit
- geringer Top1-Top2-Abstand
- hohe Entropie
- fehlende Pflichtinformation
- starker Kanalwiderspruch
- Out-of-Scope
- geringe Beobachtungsqualität
- nicht belastbare Kalibrierung

# 27. Abstain-Beispiel

```yaml
candidate_distribution:
  PS_WAIT_MATERIAL: 0.33
  PS_WAIT_INFORMATION: 0.30
  PS_WAIT_MACHINE: 0.25
  PS_UNKNOWN: 0.12

decision:
  status: ABSTAIN_INSUFFICIENT_EVIDENCE

reason:
  code: LOW_SEPARATION
  top1_top2_margin: 0.03
```

# 28. Diagnosecodes

```text
INPUT_MISSING
INPUT_LOW_QUALITY
SEMANTIC_AMBIGUITY
ONTOLOGY_AMBIGUITY
CHANNEL_CONFLICT
MISSING_REQUIRED_CONTEXT
OUT_OF_SCOPE
MODEL_UNCERTAINTY
CALIBRATION_UNCERTAINTY
```

# 29. Audit Trail

Gespeichert werden mindestens:
- Observation-ID
- Ontologieversion
- Pipelineversion
- Regelwerksversion
- KI-Version
- Kalibrierungsversion
- Kandidaten vor Constraints
- angewandte Constraints
- Kanalbeiträge
- Rohscores
- kalibrierte Wahrscheinlichkeiten
- Granularitätsentscheidung
- Abstain-Entscheidung

# 30. Evaluationslogik

| Dimension | Leitfrage |
|---|---|
| Candidate Recall | Ist die relevante Klasse im Kandidatenset? |
| Top-k | Wie gut ist die Rangfolge? |
| Kalibrierung | Sind Wahrscheinlichkeiten belastbar? |
| Abstain-Qualität | Enthält sich das Verfahren bei schwierigen Fällen? |
| Risk-Coverage | Sinkt Fehler bei höherer Enthaltungsrate? |
| Granularitätswahl | Wird bei Unsicherheit korrekt gröber entschieden? |
| Constraint-Konformität | Werden AP1-Regeln eingehalten? |
| Robustheit | Verhalten bei Missingness/Konflikt |
| Reproduzierbarkeit | Ist das Ergebnis rekonstruierbar? |

# 31. Baselines

- B1: harte Regelklassifikation
- B2: KI Top-1 ohne Abstain
- B3: reine G2-Klassifikation

# 32. Experimentmatrix

| Experiment | Vergleich |
|---|---|
| E1 | Rules only vs. AI only vs. kombiniert |
| E2 | Observation vs. Memo vs. beide |
| E3 | mit vs. ohne Kontext |
| E4 | G2 vs. G3 |
| E5 | verschiedene Abstain-Schwellen |
| E6 | verschiedene Kalibrierungsverfahren |
| E7 | mit vs. ohne ObserverHint |
| E8 | vollständige vs. reduzierte Evidenz |
| E9 | konfliktfreie vs. widersprüchliche Kanäle |
| E10 | Punktwahrscheinlichkeit vs. Sensitivitätsausgabe |

# 33. Sensitivitätsanalyse

Variante von:
- Kanalgewichtung
- Regelgewichtung
- Abstain-Schwellen
- Kalibrierungsverfahren
- Ontologiegranularität
- Beobachtungsqualität
- Kontextverfügbarkeit

# 34. Fallback A – schwach überwachtes Labelmodell

Mögliche schwache Quellen:
- Ontologieregeln
- strukturierte Features
- KI-Zuordnung
- Pattern-/Keyword-Logik
- optional ObserverHint

Keine einzelne Quelle wird als Wahrheit behandelt.

# 35. Fallback B – robuste Sensitivitätsmodelle

Wenn Punktwahrscheinlichkeiten nicht belastbar sind:

```text
P(PS_WAIT_MATERIAL) ∈ [0.36, 0.61]
```

oder Szenarien mit unterschiedlichen Evidenzgewichtungen.

# 36. Rückkopplung an AP1

AP3 soll aufzeigen, wenn:
- Klassen dauerhaft nicht trennbar sind
- Definitionen zu ähnlich sind
- Fallbacks fehlen
- erforderlicher Kontext nicht formalisiert ist

Mögliche Reaktion: Aggregation, Definitionsschärfung oder Ontologieanpassung.

# 37. Rückkopplung an AP2

AP3 soll aufzeigen, wenn:
- bestimmte Felder zu häufig fehlen
- Beobachtungsqualität nicht reicht
- Memos zu wenig Kontext liefern
- relevante Kontextdaten fehlen

# 38. Technische Zielarchitektur

```text
AP2 Export
→ Input Adapter
→ Evidence Preparation
→ Candidate Generator
→ Rule Evidence
→ Controlled AI Evidence
→ Evidence Combiner
→ Constraint Layer
→ Calibration Layer
→ Granularity / Abstain
→ Annotation Store
→ AP5 Export
```

# 39. Schnittstelle zu AP1

Benötigt werden mindestens:
- class_id
- Definition
- Parent
- Granularität
- Fallback
- Status
- requiresEvidence
- requiresContext
- incompatibleWith
- Positiv-/Negativbeispiele
- Ontologieversion

# 40. Schnittstelle zu AP2

Benötigt werden mindestens:
- observation_id
- strukturierte Features
- Memo/Text
- Kontext
- ObservationQuality
- Missingness
- optional ObserverHint
- Zeitbezug
- Provenienz
- Schema-/Ontologieversion

# 41. Schnittstelle zu AP5

```yaml
observation_id: OBS_000184

class_distribution:
  PS_WAIT_MATERIAL: 0.52
  PS_WAIT_INFORMATION: 0.21
  PS_WAIT_MACHINE: 0.12
  PS_UNKNOWN: 0.15

decision_status: PROBABILISTIC
resolved_granularity: G3

uncertainty:
  evidence_sufficiency: medium
  channel_conflict: false

provenance:
  ontology_version: 1.0.0
  annotation_pipeline_version: 0.2.0
```

# 42. Qualitäts-Gates

1. Ontology Ready
2. AP2 Input Ready
3. Candidate Ready
4. Evidence Ready
5. Probability Ready
6. Abstain Ready
7. AP5 Ready

# 43. Definition of Done

AP3 ist abgeschlossen, wenn:
- AP1-Ontologie versioniert eingelesen werden kann
- AP2-Beobachtungen reproduzierbar eingelesen werden
- strukturierte Features und Memos verarbeitet werden
- Kandidatenraum durch AP1 begrenzt ist
- Regel- und kontrollierte KI-Komponente funktionieren
- Klassenwahrscheinlichkeiten erzeugt werden
- Scores und Wahrscheinlichkeiten getrennt behandelt werden
- AP1-Constraints angewendet werden
- Konflikte sichtbar bleiben
- Granularitätsfallback funktioniert
- Abstain implementiert und begründet ist
- Referenz-/Evaluationssatz vorliegt
- Baselines implementiert sind
- Kalibrierung untersucht wurde
- Sensitivitätsanalyse durchgeführt wurde
- Fallback bei unzureichender Kalibrierung dokumentiert ist
- Annotationen reproduzierbar versioniert sind
- AP5-Testexport funktioniert

> **Zentrales Abnahmekriterium:** AP5 erhält für jede auswertbare Beobachtung eine nachvollziehbare probabilistische Evidenzbeschreibung oder einen begründeten Nichtentscheidungsfall.

# 44. Liefergegenstände

| ID | Liefergegenstand |
|---|---|
| D3.1 | AP3-Zielschema |
| D3.2 | Candidate Generator |
| D3.3 | Rule Component |
| D3.4 | Controlled AI Component |
| D3.5 | Evidence Combiner |
| D3.6 | Calibration Module |
| D3.7 | Granularity/Abstain Module |
| D3.8 | Evaluation Set |
| D3.9 | Evaluation Report |
| D3.10 | AP5 Interface |
| D3.11 | Methodendokumentation |

# 45. Aufwandstruktur – 875 Stunden

| Teilpaket | Inhalt | Stunden |
|---|---|---:|
| AP3.1 | Zielmodell, Schnittstellen, Evaluationsdesign | 80 |
| AP3.2 | Evidence Preparation & Textverarbeitung | 95 |
| AP3.3 | Candidate Generation & Ontologieintegration | 90 |
| AP3.4 | Regelkomponente & Constraints | 100 |
| AP3.5 | kontrollierte KI-Komponente | 135 |
| AP3.6 | Evidence Combination & Konfliktlogik | 100 |
| AP3.7 | Kalibrierung, Granularität & Abstain | 115 |
| AP3.8 | Baselines, Experimente & Sensitivität | 105 |
| AP3.9 | AP5-Übergabe, Dokumentation & Validierung | 55 |
|  | **Gesamt** | **875** |

# 46. Zeitliche Struktur

## Oktober 2026
Schnittstellen, Zielschema, Referenzfälle, Rule Baseline.

## November 2026
Memo-/Textverarbeitung, Evidenzextraktion, Candidate Generator, erste KI-Versuche.

## Dezember 2026
Constraint Handling, Rule-Gated/Ensemble-Varianten, Konfliktmodell, Audit Trail.

## Januar 2027
Evidence Combination, Kalibrierung, Granularitätsfallback, Abstain-Prototyp.

## Februar 2027
Baselines, Experimentmatrix, Risk-Coverage, Missingness-/Konfliktversuche, Sensitivität.

## März 2027
Stabilisierung, dokumentierte Grenzen, AP5-Schnittstelle, Testimport und Abschluss.

# 47. Hauptrisiken und Fallbacks

| Risiko | Reaktion |
|---|---|
| keine lokalen Trainingsdaten | schwache Überwachung / kontrollierter Referenzsatz |
| Ontologie zu fein | Parent-Fallback / AP1-Rückkopplung |
| Sprache mehrdeutig | gröbere Klasse / Abstain |
| Regeln zu hart | Regeln nur als Evidenz behandeln |
| KI erfindet Klassen | geschlossener Kandidatenraum |
| Kanäle widersprechen | Konflikt explizit ausweisen |
| Kalibrierung instabil | Intervalle / Sensitivitätsszenarien |
| Referenzsatz klein | Grenzfälle + Unsicherheit dokumentieren |
| AP2-Kontext unzureichend | AP2-Rückkopplung / grobe Klasse |

# 48. Offene Designentscheidungen

1. Sprach-/Textpipeline
2. Candidate Generation
3. Regelrepräsentation
4. kontrollierte KI-Technik
5. Rule-Gated vs. Ensemble
6. Score-Kombination
7. Kalibrierungsverfahren
8. Abstain-Kriterium
9. Abstain-Schwellen
10. Granularitätsentscheidung
11. ObserverHint-Nutzung
12. Konfliktbehandlung
13. Evaluationssatzgröße
14. Referenzdefinition bei Mehrdeutigkeit
15. Out-of-Scope-Erkennung
16. Mindestqualität für AP5
17. schwach überwachtes Fallback
18. Darstellung von Intervallen/Szenarien

# 49. Ergebnisbild

```text
Sparse Beobachtung
+ Sprach-/Textmemo
+ Kontext
        ↓
kontrollierte semantische Evidenzbildung
        ↓
Kandidatenklassen
+ Wahrscheinlichkeiten
+ Granularitätsstatus
+ Konfliktinformation
+ Abstain
        ↓
AP5
```

AP3 bildet damit die zentrale semantische Unsicherheitsschicht zwischen Datenerhebung und probabilistischem Messkern.

# 50. Status der Konkretisierung

Direkt aus dem Projektplan abgeleitet sind Zweck, Eingänge, Regeln + kontrollierte KI, Klassenwahrscheinlichkeiten, Abstain, Übergabe an AP5, 875 Stunden, Zeitraum Oktober 2026 bis März 2027 sowie die Fallbacks schwach überwachtes Labelmodell bzw. robuste Sensitivitätsmodelle.

Pipelinearchitektur, Ergebnisstatus, Datenmodell, Regel-/KI-Varianten, Kalibrierungsmetriken, Experimentmatrix, Baselines, Diagnosecodes, Qualitäts-Gates und interne Stundenaufteilung sind operative Designvorschläge und innerhalb von AP3 experimentell zu prüfen.
