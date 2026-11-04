# AP3 – Mehrkanalige unsichere Annotation mit Abstain-Logik

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP3 – Mehrkanalige unsichere Annotation mit Abstain-Logik  
**Dokumenttyp:** Methodenkonzept / Versuchsspezifikation / Übergabegrundlage  
**Version:** 0.3.0  
**Soll-Zeitfenster:** Oktober 2026 – März 2027  
**Aufwand laut Projektplan:** 875 Stunden  
**Abhängigkeiten:** AP1 + AP2  
**Nachfolger:** AP5  
**Zielzustand:** Kalibrierte probabilistische Annotation bzw. begründeter Abstain-Fall je Beobachtung

---

# 1. Ziel von AP3

AP3 entwickelt ein Verfahren, das strukturierte Beobachtungen sowie Sprach- und Textinformationen aus AP2 auf die in AP1 definierte Ontologie abbildet, ohne die Unsicherheit der Zuordnung durch eine harte Zwischenentscheidung zu verlieren.

Mögliche Ergebnisformen sind:

1. probabilistische Feinklassifikation,
2. probabilistische Grobklassifikation,
3. Abstain / Nichtentscheidung,
4. Out-of-Scope / Ontologiegrenze.

> **Leitfrage:** Wie kann sparse, mehrdeutige und potenziell widersprüchliche Evidenz ohne unternehmensspezifische Trainingsdaten in eine kalibrierte probabilistische Ontologiezuordnung übersetzt werden, sodass Unsicherheit erhalten bleibt und AP5 keine Scheingenauigkeit übernimmt?

---

# 2. Projektplanvorgaben

Aus dem Projektplan ergeben sich für AP3 folgende feste Anforderungen:

- AP3 baut auf AP1 und AP2 auf.
- Zeitraum: Oktober 2026 bis März 2027.
- Aufwand: 875 Stunden.
- Eingänge:
  - Ontologie, zulässige Klassen und Constraints aus AP1,
  - Multimomentbeobachtungen sowie Sprach-/Text-Memos aus AP2.
- Unternehmensspezifische Trainingsdaten dürfen keine Voraussetzung sein.
- Regeln und kontrollierte KI sollen kombiniert werden.
- Ergebnis sollen Klassenwahrscheinlichkeiten statt ausschließlich harter Labels sein.
- Unsicherheit und Enthaltungslogik sollen explizit kalibriert werden.
- AP5 soll Kandidatenklassen mit Wahrscheinlichkeiten bzw. einen begründeten Abstain-Fall erhalten.
- Falls die Annotation ohne lokale Trainingsdaten nicht ausreichend kalibrierbar ist, sind schwach überwachte Labelmodelle bzw. robuste Sensitivitätsmodelle als Fallback vorgesehen.

---

# 3. Einordnung in die Gesamtkette

```text
AP1
Ontologie + Klassenraum + Granularität + Constraints + Fallbacks
        ↓
AP2
strukturierte Beobachtung + Sprach-/Textmemo + Kontext + Qualität + Missingness
        ↓
AP3
unsichere semantische Annotation
+ Kandidaten
+ Wahrscheinlichkeiten
+ Granularität
+ Konflikte
+ Abstain
        ↓
AP5
latentes Mehrkanal-Messmodell
```

Wichtig ist die Abgrenzung:

```text
AP3:
P(Ontologieklasse | Beobachtung, Memo, Kontext)

AP5:
P(latenter wahrer Zustand | AP3-Evidenz, MES, ERP, weitere Evidenz)
```

AP3 schätzt somit nicht den wahren Produktionszustand, sondern die semantische Evidenz aus Beobachtung und Sprache.

---

# 4. Forschungsgegenstand

Der Forschungsbeitrag von AP3 liegt in der kontrollierten Übersetzung unsicherer Evidenz in eine probabilistische Ontologiezuordnung.

Zu lösen sind insbesondere:

- Kandidatengenerierung,
- Evidenzkombination,
- Unsicherheitsquantifizierung,
- Granularitätssteuerung,
- Enthaltungslogik.

---

# 5. Forschungshypothesen

## H1 – Regeln + kontrollierte KI sind robuster als reine KI
Eine ontologisch begrenzte Kombination aus Regeln und kontrollierter KI erzeugt weniger unzulässige bzw. inkonsistente Zuordnungen als eine freie Top-1-Klassifikation.

## H2 – Mehrkanaligkeit verbessert die Annotation
Die gemeinsame Nutzung von strukturierter Beobachtung und Memo liefert eine höhere Kandidatenabdeckung als die Nutzung nur eines Kanals.

## H3 – Kontext verbessert Feingranularität
Kontextinformationen erhöhen insbesondere die Trennschärfe zwischen semantisch nahen G3-Klassen.

## H4 – Hierarchischer Fallback reduziert Fehlklassifikation
Ein Rückfall auf G2/G1 führt bei schwacher Evidenz zu geringerer Fehlerrate als eine erzwungene G3-Entscheidung.

## H5 – Abstain verbessert die Zuverlässigkeit akzeptierter Fälle
Mit zunehmender Abstain-Rate soll die Fehlerquote der verbleibenden akzeptierten Fälle sinken.

## H6 – Rohscores sind nicht ausreichend kalibriert
Direkte KI- oder Regelscores sind keine belastbaren Wahrscheinlichkeiten und benötigen eine separate Kalibrierungsstufe.

---

# 6. Methodische Grundsätze

- Keine erzwungene Einzelklasse.
- Geschlossener Ontologieraum aus AP1.
- Unsicherheit bleibt erhalten.
- Abstain ist reguläres Ergebnis.
- Granularität ist evidenzabhängig.
- Evidenzkanäle bleiben nachvollziehbar.
- Kalibrierung vor Scheingenauigkeit.
- Jede Annotation bleibt versioniert reproduzierbar.

---

# 7. Eingangsobjekt

```yaml
observation_id: OBS_000184

structured_observation:
  machine_status: stopped
  operator_activity: waiting
  material_status: unknown

memo:
  text: "Material für den Auftrag ist noch nicht da."
  status: available

context:
  site_id: SITE_01
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

---

# 8. Evidenzkanäle

- Kanal A – strukturierte Beobachtung
- Kanal B – Sprach-/Textmemo
- Kanal C – Kontext
- optional Kanal D – ObserverHint

ObserverHint wird explizit als potenziell fehlerbehafteter Kanal behandelt.

---

# 9. Zieldatenmodell

```yaml
annotation_id: ANN_000184
observation_id: OBS_000184

versions:
  ontology: 1.0.0
  pipeline: 0.3.0
  ruleset: 0.2.0
  ai_component: 0.1.0
  calibration: 0.1.0

candidate_distribution:
  PS_WAIT_MATERIAL: 0.52
  PS_WAIT_INFORMATION: 0.21
  PS_WAIT_MACHINE: 0.12
  PS_UNKNOWN: 0.15

resolved_class:
  class_id: PS_WAIT_MATERIAL
  granularity: G3

decision:
  status: PROBABILISTIC
  abstain: false

diagnostics:
  evidence_sufficiency: medium
  channel_conflict: false
  out_of_scope: false
```

---

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

---

# 11. Gesamtverfahren

```text
1. Input Validation
2. Evidence Normalization
3. Candidate Generation
4. Rule Evidence
5. Controlled AI Evidence
6. Constraint Application
7. Channel Combination
8. Probability Calibration
9. Granularity Resolution
10. Abstain Decision
11. AnnotationResult
```

---

# 12. Input Validation

Geprüft werden mindestens:

- Observation-ID vorhanden,
- Ontologieversion bekannt,
- AP1-Klassenraum verfügbar,
- AP2-Felder syntaktisch valide,
- Missingness explizit,
- Memo-Status konsistent,
- Kontextwerte formal gültig,
- Beobachtungsqualität vorhanden.

---

# 13. Evidence Normalization

Für Sprache:

- Originaltext erhalten,
- optional Transkript separat speichern,
- Normalisierung versionieren,
- relevante Textstellen referenzierbar halten.

Für strukturierte Features:

- Wertebereiche prüfen,
- Missingness getrennt führen,
- keine impliziten Defaults setzen.

---

# 14. Candidate Generation

Beispiel:

```text
operator_activity = waiting
memo = "Material fehlt"
```

möglicher Kandidatenraum:

```text
PS_WAIT_MATERIAL
PS_WAIT_INFORMATION
PS_WAIT_MACHINE
PS_WAITING
PS_UNKNOWN
```

Kandidaten werden auf Basis von Ontologiehierarchie, Klassendefinitionen, Fallbacks, Kontextanforderungen sowie Positiv-/Negativbeispielen gebildet.

---

# 15. Regelkomponente

Beispiele:

```text
IF operator_activity = waiting
THEN support PS_WAITING

IF memo indicates missing material
THEN support PS_WAIT_MATERIAL

IF material_status = available
THEN evidence_against PS_WAIT_MATERIAL

IF required_context for G3 is missing
THEN G3 resolution blocked
```

Regeln liefern Evidenz, nicht automatisch Ground Truth.

---

# 16. Kontrollierte KI-Komponente

Die KI erhält nur den erlaubten Ontologieausschnitt.

Zulässige Aufgaben:

- Unterstützung je Kandidat,
- Textbelege,
- Unsicherheitsgründe,
- fehlende Evidenz.

Nicht zulässig:

- neue Klassen erfinden,
- Ontologie ändern,
- harte Constraints umgehen.

---

# 17. Experimentelle Regel-KI-Architekturen

## A – Rule-Gated AI
Regeln bestimmen Kandidatenraum; KI bewertet nur Kandidaten.

## B – Parallel Ensemble
Regeln und KI erzeugen unabhängige Evidenzbeiträge.

## C – AI + Constraint Projection
KI erzeugt Rohscores; Constraints korrigieren den Ergebnisraum.

Die Zielarchitektur wird anhand der Evaluation ausgewählt.

---

# 18. Constraint-Anwendung

Constraints aus AP1 werden versioniert angewendet.

Beispiele:

- deprecated Klassen ausschließen,
- Klassen ohne erforderlichen Kontext nicht auf G3 auflösen,
- formale Inkompatibilitäten berücksichtigen,
- Fallbackpfade anwenden.

---

# 19. Kanalweise Evidenz

```yaml
channel_evidence:
  structured_observation:
    PS_WAITING: 0.70

  memo:
    PS_WAIT_MATERIAL: 0.82

  context:
    PS_WAIT_MATERIAL: 0.20
```

Dadurch bleibt nachvollziehbar, welcher Kanal welchen Beitrag liefert.

---

# 20. Konflikterkennung

Widersprüche werden explizit erkannt.

```yaml
conflict:
  active: true
  type: CHANNEL_CONFLICT
  severity: high
```

Konflikte dürfen Unsicherheit erhöhen, Auflösung vergröbern oder Abstain auslösen.

---

# 21. Evidenzkombination

Mögliche Varianten:

- gewichtete Score-Aggregation,
- log-lineare Kombination,
- probabilistisches Labelmodell,
- Bayes-nahe Evidenzkombination,
- robuste Szenarioaggregation.

AP3 kombiniert ausschließlich semantische Evidenzbestandteile aus AP2 und nimmt AP5 nicht vorweg.

---

# 22. Score-Probability-Trennung

```text
Regel-/KI-Score
≠
Klassenwahrscheinlichkeit
```

Daher:

```text
Rohscores
→ Aggregation
→ Kalibrierung
→ Probability Distribution
```

---

# 23. Kalibrierung

Mögliche Methoden:

- Temperature Scaling,
- Platt-/Logistic Scaling,
- Isotonic Calibration,
- klassenweise Kalibrierung,
- hierarchische Kalibrierung.

Die finale Auswahl ist experimentell zu treffen.

---

# 24. Kalibrierungsmetriken

Mindestens:

- Brier Score,
- Log Loss,
- Expected Calibration Error,
- Reliability Diagram.

Zusätzlich sinnvoll:

- Calibration Error je Granularitätsstufe,
- Calibration Error bei Missingness,
- Calibration Error bei Konfliktfällen.

---

# 25. Referenzdatensatz

Mindestens folgende Falltypen:

- eindeutige Fälle,
- mehrdeutige Fälle,
- sparse Fälle,
- Konfliktfälle,
- Missing-Context-Fälle,
- Out-of-Scope-Fälle,
- Low-Quality-Fälle.

---

# 26. Referenzannotation

Mögliche Formen:

```text
Single Class
Allowed Set
Parent Class
Expected Abstain
Out of Scope
```

Damit wird nicht vorausgesetzt, dass jeder reale Fall eine eindeutige Feinklasse besitzt.

---

# 27. Hierarchische Unsicherheit

Beispiel:

```text
G3:
PS_WAIT_MATERIAL       0.36
PS_WAIT_INFORMATION    0.33
PS_WAIT_MACHINE        0.19
PS_WAIT_OTHER          0.12
```

Aggregation:

```text
P(PS_WAITING) = 1.00
```

Möglicher Output:

```yaml
resolved_class: PS_WAITING
granularity: G2
decision_status: COARSE_ONLY
```

---

# 28. Granularitätsentscheidung

Prüfreihenfolge:

```text
G3
↓ falls nicht belastbar
G2
↓ falls nicht belastbar
G1
↓ falls nicht belastbar
ABSTAIN
```

---

# 29. Abstain-Logik

Mögliche Kriterien:

- maximale Wahrscheinlichkeit,
- Top-1/Top-2-Margin,
- Entropie,
- fehlender Pflichtkontext,
- Kanalwiderspruch,
- Beobachtungsqualität,
- Out-of-Scope-Signal,
- Kalibrierungsstatus.

---

# 30. Risk-Coverage-Logik

```text
Coverage = Anteil der Fälle mit Entscheidung
Risk = Fehlerquote unter den entschiedenen Fällen
```

Erwartung:

```text
mehr Abstain
→ geringere Coverage
→ geringerer Risk
```

---

# 31. Out-of-Scope-Erkennung

Out-of-Scope kann vorliegen, wenn:

- kein Kandidat ausreichend Evidenz erhält,
- semantische Merkmale außerhalb der Ontologie liegen,
- alle zulässigen Klassen stark widersprochen werden.

Dann:

```text
ABSTAIN_OUT_OF_SCOPE
```

---

# 32. Diagnosemodell

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

---

# 33. Vollständiger Audit Trail

Für jede Annotation werden gespeichert:

- Inputdatenreferenz,
- Ontologieversion,
- Pipelineversion,
- Regelversion,
- KI-Version,
- Kalibrierungsversion,
- Kandidatenset initial,
- Regelbeiträge,
- KI-Beiträge,
- angewandte Constraints,
- kombinierte Scores,
- kalibrierte Verteilung,
- Granularitätsentscheidung,
- Abstain-Status,
- Diagnosecodes.

---

# 34. Baselines

- B1 – Regel Top-1
- B2 – KI Top-1
- B3 – G2-only
- B4 – Memo-only
- B5 – Observation-only

---

# 35. Experimentplan

| Experiment | Ziel |
|---|---|
| E1 Rules vs. AI vs. kombiniert | Nutzen der Hybridarchitektur |
| E2 Observation vs. Memo vs. beide | Mehrwert der Mehrkanaligkeit |
| E3 mit vs. ohne Kontext | Kontextnutzen |
| E4 G2 vs. G3 | Nutzen zusätzlicher Granularität |
| E5 Abstain-Schwellen | Risk-Coverage |
| E6 Kalibrierverfahren | Wahrscheinlichkeitsqualität |
| E7 ObserverHint an/aus | Nutzen bzw. Bias |
| E8 Missingness erhöhen | Robustheit |
| E9 Kanalwiderspruch | Konfliktbehandlung |
| E10 Out-of-Scope-Fälle | Ontologiegrenzen |
| E11 verschiedene Prompt-/KI-Versionen | Modellstabilität |
| E12 Sensitivitätsmodell | Fallbackfähigkeit |

---

# 36. Evaluationsmetriken

## Klassifikation
- Candidate Recall
- Top-1 Accuracy
- Top-3 Accuracy

## Probabilistik
- Brier Score
- Log Loss
- Calibration Error

## Selective Prediction
- Abstain Rate
- Coverage
- Error Rate on Accepted
- Risk-Coverage Curve

## Hierarchie
- Granularity Resolution Rate
- Coarse Fallback Rate
- Hierarchical Error

## Ontologie
- Constraint Violation Rate
- Out-of-Scope Detection

## Robustheit
- Performance under Missingness
- Performance under Channel Conflict

---

# 37. Fallback: schwach überwachtes Labelmodell

Mögliche schwache Quellen:

- Regeln,
- strukturierte Features,
- Keyword-/Pattern-Heuristiken,
- KI-Scores,
- ObserverHint.

Keine einzelne Quelle wird als Ground Truth vorausgesetzt.

---

# 38. Fallback: robuste Sensitivitätsausgabe

Falls Punktwahrscheinlichkeiten nicht stabil kalibrierbar sind:

```text
P(PS_WAIT_MATERIAL) ∈ [0.35, 0.60]
```

oder Szenarien mit unterschiedlichen Evidenzgewichtungen.

---

# 39. Rückkopplung an AP1

AP3 soll sichtbar machen:

- dauerhaft nicht trennbare Klassen,
- fehlende Fallbacks,
- inkonsistente Constraints,
- zu hohe Granularität,
- unzureichende Klassendefinitionen.

---

# 40. Rückkopplung an AP2

AP3 soll sichtbar machen:

- Felder mit hoher Missingness,
- zu wenig Kontext,
- unklare Beobachtungsmerkmale,
- unbrauchbare Memoqualität,
- zu geringe ObservationQuality.

---

# 41. Schnittstelle zu AP5

```yaml
observation_id: OBS_000184

class_distribution:
  PS_WAIT_MATERIAL: 0.52
  PS_WAIT_INFORMATION: 0.21
  PS_WAIT_MACHINE: 0.12
  PS_UNKNOWN: 0.15

decision:
  status: PROBABILISTIC
  resolved_granularity: G3

diagnostics:
  evidence_sufficiency: medium
  channel_conflict: false

versions:
  ontology: 1.0.0
  annotation_pipeline: 0.3.0
```

Bei `ABSTAIN` soll die zugrunde liegende Verteilung soweit möglich erhalten bleiben.

---

# 42. Quality Gates

1. QG1 – Input Ready
2. QG2 – Candidate Ready
3. QG3 – Hybrid Ready
4. QG4 – Probability Ready
5. QG5 – Hierarchy Ready
6. QG6 – Abstain Ready
7. QG7 – Evaluation Ready
8. QG8 – AP5 Ready

---

# 43. Definition of Done

AP3 ist abgeschlossen, wenn:

- [ ] AP1-Ontologie versioniert eingelesen wird
- [ ] AP2-Beobachtungen und Memos reproduzierbar eingelesen werden
- [ ] Kandidatengenerierung ontologiekonform funktioniert
- [ ] regelbasierte Evidenz erzeugt wird
- [ ] kontrollierte KI-Evidenz erzeugt wird
- [ ] beide Kanäle nachvollziehbar kombiniert werden
- [ ] Constraints versioniert angewendet werden
- [ ] Scores von Wahrscheinlichkeiten getrennt sind
- [ ] Wahrscheinlichkeiten kalibriert bzw. ihre Grenzen dokumentiert sind
- [ ] hierarchischer Fallback funktioniert
- [ ] Abstain implementiert und begründet ist
- [ ] Out-of-Scope-Fälle erkannt werden
- [ ] Referenzdatensatz vorliegt
- [ ] Baselines ausgewertet wurden
- [ ] Experimentmatrix durchgeführt wurde
- [ ] Risk-Coverage analysiert wurde
- [ ] Sensitivitätsanalyse dokumentiert ist
- [ ] Fallback bei unzureichender Kalibrierung definiert ist
- [ ] vollständiger Audit Trail vorliegt
- [ ] AP5-Testexport funktioniert

> **Zentrales Abnahmekriterium:** AP5 erhält pro Beobachtung eine nachvollziehbare, versionierte und unsicherheitsbewusste semantische Evidenzbeschreibung oder einen begründeten Nichtentscheidungsfall – keine technisch erzwungene Einzelklasse.

---

# 44. Liefergegenstände

| ID | Liefergegenstand |
|---|---|
| D3.1 | AP3 Input-/Output-Schema |
| D3.2 | Candidate Generator |
| D3.3 | Rule Evidence Module |
| D3.4 | Controlled AI Module |
| D3.5 | Constraint Layer |
| D3.6 | Evidence Combination Module |
| D3.7 | Calibration Module |
| D3.8 | Granularity & Abstain Module |
| D3.9 | Reference/Evaluation Set |
| D3.10 | Experiment- und Evaluationsbericht |
| D3.11 | AP5-Schnittstelle |
| D3.12 | Methodendokumentation / Audit Trail |

---

# 45. Aufwandstruktur – 875 Stunden

| Teilpaket | Inhalt | Stunden |
|---|---|---:|
| AP3.1 | Zielmodell, Schnittstellen, Forschungs-/Evaluationsdesign | 85 |
| AP3.2 | Evidence Preparation & Referenzdatensatz | 90 |
| AP3.3 | Candidate Generator & Ontologieintegration | 90 |
| AP3.4 | Regelkomponente & Constraint Layer | 100 |
| AP3.5 | Controlled AI Module | 125 |
| AP3.6 | Evidence Combination & Konfliktlogik | 100 |
| AP3.7 | Kalibrierung, Hierarchie & Abstain | 120 |
| AP3.8 | Experimente, Baselines & Sensitivität | 110 |
| AP3.9 | AP5-Schnittstelle, Audit Trail & Abschlussvalidierung | 55 |
|  | **Gesamt** | **875** |

---

# 46. Zeitliche Struktur

## Oktober 2026
AP1/AP2-Schnittstelle, Zielschema, Forschungshypothesen, Referenzdatensatz, erste Baselines.

## November 2026
Candidate Generator, Rule Evidence, Text-/Memo-Verarbeitung, erste kontrollierte KI-Versuche.

## Dezember 2026
Hybridarchitekturen, Constraint Layer, Konflikterkennung, Audit Trail.

## Januar 2027
Evidence Combination, Kalibrierung, hierarchischer Fallback, Abstain.

## Februar 2027
Experimentmatrix, Baselines, Risk-Coverage, Missingness-/Konfliktversuche, Sensitivität.

## März 2027
Zielarchitektur auswählen, Grenzen dokumentieren, AP5-Schnittstelle, Testexport, Abschlussvalidierung.

---

# 47. Hauptrisiken

| Risiko | Reaktion |
|---|---|
| zu wenige Referenzdaten | schwache Überwachung + kontrollierte Grenzfälle |
| Ontologie zu fein | hierarchischer Fallback + Rückkopplung AP1 |
| Memo zu mehrdeutig | gröbere Klasse / Abstain |
| KI halluziniert | geschlossener Kandidatenraum |
| Regeln dominieren | Regeln als Evidenz statt Ground Truth |
| Kanäle widersprechen | explizites Konfliktmodell |
| Kalibrierung instabil | Sensitivitätsbereiche statt Punktwerte |
| AP2-Kontext fehlt | Rückkopplung an AP2 |
| hohe Modellabhängigkeit | mehrere KI-/Promptvarianten vergleichen |

---

# 48. Offene Designentscheidungen

1. Kandidatengenerierung
2. Rule-Gated vs. Ensemble
3. KI-Modell und Promptstruktur
4. Score-Kombination
5. Kalibrierungsmethode
6. Abstain-Kriterium
7. Abstain-Schwellen
8. Entropie-/Margin-Nutzung
9. Granularitätskriterium
10. ObserverHint-Nutzung
11. Konfliktgewichtung
12. Out-of-Scope-Erkennung
13. Referenzsatzgröße
14. hierarchische Evaluationsmetrik
15. Mindestqualität für AP5
16. Einsatz eines schwach überwachten Labelmodells
17. Darstellung von Intervallen bei unzureichender Kalibrierung

---

# 49. Ergebnisbild

```text
Observation + Memo + Kontext
        ↓
Ontologiebegrenzte Kandidatengenerierung
        ↓
Regel-Evidenz + kontrollierte KI-Evidenz
        ↓
Constraint-Anwendung
        ↓
Evidenzkombination
        ↓
Kalibrierte Klassenverteilung
        ↓
Hierarchischer Fallback / Abstain
        ↓
AP5
```

AP3 ist damit die semantische Unsicherheitsschicht des Gesamtverfahrens.

---

# 50. Status der Konkretisierung

Direkt aus dem Projektplan abgeleitet sind Zweck, Eingänge, Regeln + kontrollierte KI, Klassenwahrscheinlichkeiten, Unsicherheits-/Abstain-Logik, Übergabe an AP5, 875 Stunden, Zeitraum Oktober 2026 bis März 2027 sowie die Fallbacks schwach überwachtes Labelmodell und robuste Sensitivitätsmodelle.

Forschungshypothesen, Pipelinearchitektur, Ergebnisstatus, Datenmodelle, Kalibrierverfahren, Risk-Coverage, Experimentmatrix, Baselines, Diagnosecodes, Quality Gates und interne Stundenaufteilung sind operative Designvorschläge und innerhalb von AP3 experimentell zu prüfen.
