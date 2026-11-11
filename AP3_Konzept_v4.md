# AP3 – Mehrkanalige unsichere Annotation mit Abstain-Logik

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP3  
**Titel:** Mehrkanalige unsichere Annotation mit Abstain-Logik  
**Dokumenttyp:** Methodenkonzept / Versuchsspezifikation / Übergabekonzept  
**Version:** 0.4.0 – vollständiger Neuaufbau  
**Soll-Zeitfenster:** Oktober 2026 – März 2027  
**Aufwand laut Projektplan:** 875 Stunden  
**Abhängigkeiten:** AP1 + AP2  
**Nachfolger:** AP5  

---

# 1. Ausgangspunkt

AP3 ist das erste Arbeitspaket, in dem die in AP1 definierte Ontologie mit den in AP2 erzeugten Beobachtungsdaten tatsächlich zusammengeführt wird.

AP1 definiert:
- welche Klassen existieren,
- welche Klassen fachlich zulässig sind,
- welche Granularitäten vorgesehen sind,
- welche Constraints und Fallbacks gelten.

AP2 liefert:
- strukturierte Multimomentbeobachtungen,
- Sprach- bzw. Textmemos,
- Beobachtungsstatus,
- Kontext,
- Missingness,
- Qualitätsinformationen.

AP3 übersetzt diese Eingangsdaten in **semantische Evidenz über mögliche Ontologieklassen**.

> **AP3 bestimmt nicht den „wahren“ Produktionszustand. AP3 beschreibt, welche Ontologieklassen durch die vorhandene Beobachtungs- und Sprachevidenz wie stark gestützt werden.**

Der latente tatsächliche Zustand wird erst in AP5 aus mehreren fehlerbehafteten Evidenzkanälen geschätzt.

# 2. Ziel von AP3

Ziel von AP3 ist ein Verfahren, das aus einer Beobachtung eine **probabilistische und nachvollziehbare Ontologiezuordnung** erzeugt.

Für jede Observation soll das Verfahren mindestens eine der folgenden Aussagen treffen können:
1. **Feinklassifikation mit Unsicherheit** – mehrere Feinklassen erhalten Wahrscheinlichkeiten.
2. **Grobklassifikation** – eine Oberklasse ist belastbar, die Feinklasse jedoch nicht.
3. **Abstain** – die Evidenz reicht für keine belastbare Zuordnung aus.
4. **Out of Scope** – der Fall lässt sich mit der aktuellen Ontologie nicht sinnvoll abbilden.

Das Ergebnis ist somit nicht:

```text
Beobachtung → Klasse
```

sondern:

```text
Beobachtung
→ zulässige Kandidaten
→ Evidenz je Kandidat
→ Wahrscheinlichkeitsverteilung
→ Granularitätsentscheidung
→ ggf. Abstain
```

# 3. Verbindliche Vorgaben aus dem Projektplan

Der Projektplan legt für AP3 fest:
- AP3 baut auf AP1 und AP2 auf.
- Sprach- und Textinformationen werden nicht als harte Labels, sondern als fehlerbehaftete Evidenz auf die Ontologie abgebildet.
- Es werden Regeln und kontrollierte KI kombiniert.
- Es werden Klassenwahrscheinlichkeiten statt ausschließlich harter Labels erzeugt.
- Eine explizite Unsicherheits- und Enthaltungslogik wird kalibriert.
- Unternehmensspezifische Trainingsdaten dürfen keine Voraussetzung sein.
- AP5 erhält Kandidatenklassen mit Wahrscheinlichkeiten bzw. einen Abstain-/Nichtentscheidungsstatus.
- Falls eine ausreichende Kalibrierung nicht möglich ist, sind schwach überwachte Labelmodelle oder robuste Sensitivitätsmodelle als Fallback vorgesehen.

Der operative Prüfpunkt lautet:

> **AP5 erhält pro Beobachtung keine erzwungene Einzelklasse, sondern eine probabilistische Evidenzbeschreibung bzw. einen begründeten Abstain-Fall.**

# 4. Abgrenzung von AP3 und AP5

Diese Trennung ist wesentlich.

## AP3 beantwortet

> Welche Ontologieklassen werden durch Beobachtung, Memo und Kontext gestützt?

Formal:

```text
P(Klasse | Beobachtung, Memo, Kontext)
```

## AP5 beantwortet später

> Wie wahrscheinlich ist der tatsächliche latente Produktionszustand, wenn zusätzlich MES-, ERP- und weitere Evidenzkanäle berücksichtigt werden?

Formal:

```text
P(latenter Zustand | AP3-Evidenz, MES, ERP, weitere Evidenz)
```

AP3 darf daher nicht versuchen, bereits die vollständige Mehrkanalfusion aus AP5 vorwegzunehmen.

# 5. Methodische Problemstellung

AP3 muss gleichzeitig fünf Schwierigkeiten behandeln:

## 5.1 Sparsity
Pro Beobachtung steht nur wenig Information zur Verfügung.

## 5.2 Mehrdeutigkeit
Ein Memo oder eine Beobachtung kann mehrere Ontologieklassen plausibel unterstützen.

## 5.3 Fehlerhafte Evidenz
Beobachter, Sprachmemo oder strukturierte Felder können falsch, unvollständig oder widersprüchlich sein.

## 5.4 Begrenzte Trainingsdaten
Das Verfahren darf nicht von einer umfangreichen firmenspezifischen Trainingshistorie abhängen.

## 5.5 Hierarchische Ontologie
Eine Feinklasse kann unsicher sein, obwohl ihre Oberklasse belastbar ist.

# 6. Forschungsfragen

AP3 untersucht folgende Kernfragen:

1. Wie werden aus Beobachtung und Memo fachlich zulässige Kandidatenklassen erzeugt?
2. Wie können Regeln und kontrollierte KI kombiniert werden, ohne Unsicherheit zu verdecken?
3. Wie werden unterschiedliche Evidenzkanäle gemeinsam bewertet?
4. Wie werden Rohscores in empirisch interpretierbare Wahrscheinlichkeiten überführt?
5. Wann ist eine Feinklasse belastbar genug?
6. Wann soll auf eine Oberklasse zurückgefallen werden?
7. Wann soll das System vollständig abstainen?
8. Wie werden widersprüchliche Beobachtungs- und Sprachevidenz behandelt?
9. Wie werden Fälle erkannt, die von der Ontologie nicht ausreichend abgedeckt werden?
10. Wie muss die Ausgabe gestaltet sein, damit AP5 die Unsicherheit vollständig weiterverwenden kann?

# 7. Arbeitshypothesen

## H1 – Hybrid schlägt freie KI
Eine Kombination aus Ontologie, Regeln und kontrollierter KI führt zu weniger fachlich unzulässigen Zuordnungen als eine freie KI-Klassifikation.

## H2 – Memo ergänzt strukturierte Beobachtung
Sprachmemos erhöhen insbesondere die Trennschärfe zwischen Klassen, deren Ursache aus den strukturierten Beobachtungsmerkmalen nicht direkt sichtbar ist.

## H3 – Kontext erhöht Granularität
Kontextinformationen ermöglichen bei einem Teil der Fälle eine feinere, belastbarere Klassifikation.

## H4 – Hierarchischer Fallback reduziert Fehler
Ein Rückfall auf eine gröbere Klasse ist bei schwacher Evidenz zuverlässiger als eine erzwungene Feinklasse.

## H5 – Abstain verbessert selektive Zuverlässigkeit
Wenn schwierige Fälle abgelehnt werden dürfen, sinkt die Fehlerrate unter den akzeptierten Fällen.

## H6 – KI-Konfidenz ist nicht automatisch Wahrscheinlichkeit
Rohscores bzw. Modellkonfidenzen müssen separat kalibriert werden.

# 8. Grundprinzipien

- Keine erzwungene Entscheidung.
- Geschlossener Klassenraum aus AP1.
- Beobachtung bleibt Evidenz, nicht Ground Truth.
- Kanalherkunft bleibt sichtbar.
- Fehlende Evidenz ist kein negatives Signal.
- Hierarchie wird aktiv genutzt.
- Abstain ist ein korrektes Ergebnis.
- Jede Annotation ist reproduzierbar.

# 9. Eingabedaten

Pro Beobachtung erhält AP3 mindestens:

```yaml
observation_id: OBS_000184

structured_features:
  machine_status: stopped
  operator_activity: waiting
  material_status: unknown

memo:
  status: available
  text: "Material ist für den Auftrag noch nicht da."

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

# 10. Evidenzkanäle

AP3 unterscheidet zunächst:
- E1 – strukturierte Beobachtung,
- E2 – Sprach-/Textmemo,
- E3 – Kontext,
- E4 – optionaler ObserverHint.

ObserverHint ist ausdrücklich nicht Ground Truth.

# 11. Zielausgabe

Das zentrale Ergebnisobjekt ist `AnnotationResult`.

```yaml
annotation_id: ANN_000184
observation_id: OBS_000184

candidate_distribution:
  PS_WAIT_MATERIAL: 0.55
  PS_WAIT_INFORMATION: 0.18
  PS_WAIT_MACHINE: 0.12
  PS_UNKNOWN: 0.15

resolved:
  class_id: PS_WAIT_MATERIAL
  granularity: G3

decision:
  status: PROBABILISTIC
  abstain: false

diagnostics:
  evidence_sufficiency: medium
  channel_conflict: false
  out_of_scope: false

versions:
  ontology: 1.0.0
  ruleset: 0.1.0
  ai_component: 0.1.0
  calibration: 0.1.0
  pipeline: 0.1.0
```

# 12. Ergebnisstatus

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

# 13. Verfahrenslogik

```text
1. Eingabe prüfen
2. Evidenz aufbereiten
3. Kandidatenraum erzeugen
4. Regeln anwenden
5. kontrollierte KI anwenden
6. Evidenz kombinieren
7. Wahrscheinlichkeiten kalibrieren
8. Granularität bestimmen
9. Entscheidung oder Abstain ausgeben
```

# 14. Schritt 1 – Eingabeprüfung

Zu prüfen sind:
- bekannte Observation-ID,
- bekannte Ontologieversion,
- zulässige Featurewerte,
- Memo-Status,
- Missingness,
- Kontext,
- ObservationQuality.

Ungültige Daten erhalten `INVALID_INPUT`.

# 15. Schritt 2 – Evidenzaufbereitung

## Strukturierte Beobachtung
- Wertebereich validieren,
- Missingness separat führen,
- keine stillen Defaults.

## Sprach-/Textmemo
- Originaltext erhalten,
- ggf. Transkript separat speichern,
- Normalisierung dokumentieren,
- relevante Textpassagen später referenzierbar halten.

# 16. Schritt 3 – Kandidatenraum

Aus AP1 wird pro Observation eine Teilmenge zulässiger Klassen gebildet.

Beispiel:

```text
Observation:
operator_activity = waiting

Memo:
"Material fehlt."
```

mögliche Kandidaten:

```text
PS_WAIT_MATERIAL
PS_WAIT_INFORMATION
PS_WAIT_MACHINE
PS_WAITING
PS_UNKNOWN
```

Die Kandidatenbildung nutzt:
- Klassenhierarchie,
- Definitionen,
- Positiv-/Negativbeispiele,
- Context Requirements,
- Evidence Requirements,
- Fallbacks.

# 17. Schritt 4 – Regelbasierte Evidenz

Beispiele:

```text
IF operator_activity = waiting
THEN support PS_WAITING

IF memo contains evidence for missing material
THEN support PS_WAIT_MATERIAL

IF material_status = available
THEN evidence_against PS_WAIT_MATERIAL

IF required_context missing
THEN do_not_resolve_to_G3
```

Regeln erzeugen Evidenz, nicht automatisch Ground Truth.

# 18. Schritt 5 – Kontrollierte KI

Die KI erhält keinen freien Klassenraum. Sie erhält Observation, Memo, Kontext, Kandidaten, Klassendefinitionen und relevante AP1-Regeln.

Aufgabe:
- semantische Unterstützung je Kandidat bewerten,
- Textstellen benennen,
- Ambiguität markieren,
- fehlende Evidenz benennen.

Die Ausgabe sind Rohscores, keine Wahrscheinlichkeiten.

# 19. Schritt 6 – Evidenzkombination

Regel- und KI-Evidenz werden zunächst getrennt gespeichert.

Zu untersuchende Varianten:

### V1 – Rule-Gated AI
Regeln erzeugen Kandidaten, KI bewertet.

### V2 – Parallel Ensemble
Regeln und KI liefern unabhängige Scores.

### V3 – AI + Constraint Projection
KI bewertet, danach werden AP1-Constraints angewendet.

# 20. Konflikte

Widersprüchliche Evidenz wird nicht automatisch weggemittelt.

Beispiel:

```text
structured:
machine_status = running

memo:
"Maschine steht wegen Störung."
```

Mögliche Konsequenzen:
- breitere Verteilung,
- gröbere Klasse,
- Abstain.

# 21. Schritt 7 – Kalibrierung

Es gilt:

```text
KI-Score ≠ Wahrscheinlichkeit
Regel-Score ≠ Wahrscheinlichkeit
```

Daher:

```text
Rohscores
→ kombinierter Score
→ Kalibrierung
→ Klassenwahrscheinlichkeit
```

Mögliche Verfahren:
- Temperature Scaling,
- Logistic / Platt Scaling,
- Isotonic Calibration,
- hierarchische Kalibrierung.

# 22. Kalibrierungsbewertung

Mindestens:
- Brier Score,
- Log Loss,
- Expected Calibration Error,
- Reliability Diagram.

Zusätzlich:
- Kalibrierung nach Granularität,
- Kalibrierung bei Missingness,
- Kalibrierung bei Konflikten.

# 23. Schritt 8 – Granularität

Die höchste tragfähige Granularität wird gewählt.

```text
G3 belastbar?
  ja → G3
  nein
G2 belastbar?
  ja → G2
  nein
G1 belastbar?
  ja → G1
  nein
ABSTAIN
```

# 24. Schritt 9 – Abstain

Abstain kann ausgelöst werden durch:
- geringe maximale Wahrscheinlichkeit,
- zu kleinen Top1-Top2-Abstand,
- hohe Entropie,
- fehlenden Pflichtkontext,
- starken Evidenzkonflikt,
- schlechte Beobachtungsqualität,
- Out-of-Scope-Signal,
- unzureichende Kalibrierung.

Die finale Abstain-Regel wird experimentell bestimmt.

# 25. Selective Prediction / Risk-Coverage

```text
Coverage = Anteil der Fälle, für die AP3 eine Entscheidung trifft.
Risk = Fehlerquote unter den akzeptierten Entscheidungen.
```

Gewünschtes Verhalten:

```text
höhere Abstain-Rate
→ niedrigere Coverage
→ niedrigere Fehlerquote der verbleibenden Fälle
```

# 26. Out-of-Scope

Out-of-Scope liegt potenziell vor, wenn:
- kein Kandidat ausreichend Evidenz erhält,
- der Fall semantisch außerhalb der Ontologie liegt,
- alle zulässigen Kandidaten stark widersprochen werden.

Output:

```text
ABSTAIN_OUT_OF_SCOPE
```

# 27. Referenzdatensatz

Der Evaluationssatz muss bewusst auch schwierige Fälle enthalten:
- eindeutige Fälle,
- mehrdeutige Fälle,
- sparse Fälle,
- konfliktbehaftete Fälle,
- Missing-Context-Fälle,
- Out-of-Scope-Fälle,
- Low-Quality-Fälle.

# 28. Referenzannotation

Nicht jeder Testfall benötigt genau eine Klasse.

Zulässige Referenzformen:

```text
Single Class
Allowed Class Set
Parent Class
Expected Abstain
Out of Scope
```

# 29. Baselines

Zum Vergleich werden einfache Baselines aufgebaut:
- B1 – Rule Top-1,
- B2 – AI Top-1,
- B3 – G2-only,
- B4 – Memo-only,
- B5 – Observation-only.

# 30. Experimentdesign

| Experiment | Fragestellung |
|---|---|
| E1 Rules vs. AI vs. Hybrid | Ist die Hybridarchitektur besser? |
| E2 Observation vs. Memo vs. beide | Bringt Mehrkanaligkeit Mehrwert? |
| E3 mit vs. ohne Kontext | Verbessert Kontext die G3-Trennschärfe? |
| E4 G2 vs. G3 | Rechtfertigt die Feingranularität ihre Fehler? |
| E5 Abstain-Schwellen | Welche Risk-Coverage-Balance entsteht? |
| E6 Kalibrierverfahren | Welche Methode liefert belastbare Wahrscheinlichkeiten? |
| E7 ObserverHint an/aus | Verbessert der Hinweis oder erzeugt er Bias? |
| E8 künstliche Missingness | Wie robust ist das Verfahren bei Datenlücken? |
| E9 Konfliktfälle | Wie reagiert das Modell auf Widersprüche? |
| E10 Out-of-Scope | Erkennt das Verfahren Ontologiegrenzen? |
| E11 verschiedene KI-/Promptversionen | Wie stabil ist die KI-Komponente? |
| E12 Sensitivitätsausgabe | Funktioniert der Fallback ohne Punktwahrscheinlichkeit? |

# 31. Evaluationsmetriken

## Kandidatenqualität
- Candidate Recall
- Top-1 Accuracy
- Top-3 Accuracy

## Wahrscheinlichkeitsqualität
- Brier Score
- Log Loss
- Expected Calibration Error

## Selective Prediction
- Abstain Rate
- Coverage
- Error on Accepted
- Risk-Coverage Curve

## Hierarchie
- Coarse Fallback Rate
- Granularity Resolution Rate
- Hierarchical Error

## Konsistenz
- Constraint Violation Rate
- Out-of-Scope Detection Rate

## Robustheit
- Performance under Missingness
- Performance under Channel Conflict

# 32. Sensitivitätsanalyse

Zu variieren sind insbesondere:
- Regelgewichtung,
- KI-Gewichtung,
- Kontextgewichtung,
- Abstain-Schwelle,
- Entropieschwelle,
- Margin,
- Kalibrierungsverfahren,
- Ontologiegranularität,
- ObservationQuality.

# 33. Fallback 1 – schwach überwachtes Labelmodell

Falls Referenzlabels zu knapp sind, können mehrere schwache Quellen gemeinsam modelliert werden:
- Regeln,
- Observation Features,
- Keyword-/Pattern-Heuristiken,
- KI-Scores,
- ObserverHint.

Keine einzelne Quelle wird als Wahrheit behandelt.

# 34. Fallback 2 – robuste Sensitivitätsausgabe

Wenn Punktwahrscheinlichkeiten nicht stabil kalibrierbar sind, darf AP3 konservativer ausgeben.

Beispiel:

```text
P(PS_WAIT_MATERIAL) ∈ [0.35, 0.60]
```

oder mehrere plausible Szenarien.

# 35. Diagnosemodell

Vorgeschlagene Codes:

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

# 36. Audit Trail

Für jede Annotation werden mindestens gespeichert:
- Observation-ID,
- Ontologieversion,
- Pipelineversion,
- Ruleset-Version,
- KI-Komponentenversion,
- Kalibrierungsversion,
- initialer Kandidatenraum,
- Regelbeiträge,
- KI-Beiträge,
- angewandte Constraints,
- kombinierte Rohscores,
- kalibrierte Verteilung,
- Granularitätsentscheidung,
- Abstain-Status,
- Diagnosecodes.

# 37. Rückkopplung an AP1

AP3 soll sichtbar machen, wenn:
- Klassen empirisch nicht trennbar sind,
- Definitionen zu ähnlich sind,
- notwendige Constraints fehlen,
- Fallbacks unzureichend sind,
- die Ontologie zu fein ist.

# 38. Rückkopplung an AP2

AP3 soll sichtbar machen, wenn:
- relevante Felder häufig fehlen,
- Memos zu unspezifisch sind,
- Beobachtungsstatus nicht ausreichend trennscharf sind,
- Kontext systematisch fehlt,
- ObservationQuality zu niedrig ist.

# 39. Schnittstelle zu AP5

AP5 erhält mindestens:

```yaml
observation_id: OBS_000184

class_distribution:
  PS_WAIT_MATERIAL: 0.55
  PS_WAIT_INFORMATION: 0.18
  PS_WAIT_MACHINE: 0.12
  PS_UNKNOWN: 0.15

decision:
  status: PROBABILISTIC
  granularity: G3

diagnostics:
  evidence_sufficiency: medium
  channel_conflict: false

versions:
  ontology: 1.0.0
  annotation_pipeline: 0.1.0
```

Bei Abstain soll die zugrunde liegende Verteilung soweit sinnvoll erhalten bleiben.

# 40. Quality Gates

## QG1 – Input Ready
AP1 und AP2 sind maschinenlesbar angebunden.

## QG2 – Candidate Ready
Ontologiekonforme Kandidatenbildung funktioniert.

## QG3 – Rule Ready
Regelbasierte Evidenz ist nachvollziehbar.

## QG4 – AI Ready
KI-Komponente arbeitet nur im zulässigen Klassenraum.

## QG5 – Probability Ready
Scores und Wahrscheinlichkeiten sind sauber getrennt.

## QG6 – Hierarchy Ready
G3/G2/G1-Fallback funktioniert.

## QG7 – Abstain Ready
Nichtentscheidungen sind reproduzierbar und begründet.

## QG8 – Evaluation Ready
Referenzdatensatz, Baselines und Experimentdesign sind umgesetzt.

## QG9 – AP5 Ready
Probabilistische Übergabe funktioniert ohne erzwungene Einzelklasse.

# 41. Definition of Done

AP3 ist abgeschlossen, wenn:
- [ ] AP1-Ontologie versioniert eingelesen werden kann
- [ ] AP2-Beobachtungen und Memos reproduzierbar eingelesen werden können
- [ ] Kandidatenraum ontologiekonform erzeugt wird
- [ ] regelbasierte Evidenz erzeugt wird
- [ ] kontrollierte KI-Evidenz erzeugt wird
- [ ] Kanalbeiträge getrennt nachvollziehbar bleiben
- [ ] AP1-Constraints angewendet werden
- [ ] Rohscores und Wahrscheinlichkeiten getrennt sind
- [ ] Wahrscheinlichkeiten kalibriert oder ihre Grenzen dokumentiert sind
- [ ] hierarchischer Fallback funktioniert
- [ ] Abstain implementiert ist
- [ ] Abstain-Gründe dokumentiert werden
- [ ] Out-of-Scope erkannt werden kann
- [ ] Referenzdatensatz vorhanden ist
- [ ] Baselines umgesetzt sind
- [ ] Experimentdesign durchgeführt wurde
- [ ] Risk-Coverage ausgewertet wurde
- [ ] Sensitivitätsanalyse dokumentiert ist
- [ ] Fallback bei unzureichender Kalibrierung vorhanden ist
- [ ] vollständiger Audit Trail vorliegt
- [ ] AP5-Testexport funktioniert

**Zentrales Abnahmekriterium:**

> **AP5 erhält pro Beobachtung eine nachvollziehbare probabilistische Evidenzbeschreibung oder einen begründeten Abstain-Fall.**

# 42. Liefergegenstände

| ID | Liefergegenstand |
|---|---|
| D3.1 | AP3 Input-/Output-Schema |
| D3.2 | Candidate Generator |
| D3.3 | Regelkomponente |
| D3.4 | Controlled-AI-Komponente |
| D3.5 | Constraint Handling |
| D3.6 | Evidence Combination |
| D3.7 | Calibration Module |
| D3.8 | Granularity-/Abstain-Logik |
| D3.9 | Referenz- und Evaluationsdatensatz |
| D3.10 | Baseline- und Experimentbericht |
| D3.11 | AP5-Schnittstelle |
| D3.12 | Methodendokumentation / Audit Trail |

# 43. Aufwandstruktur – 875 Stunden

Die folgende Aufteilung ist eine operative Konkretisierung.

| Teilpaket | Inhalt | Stunden |
|---|---|---:|
| AP3.1 | Zielmodell, Schnittstellen, Forschungsdesign | 80 |
| AP3.2 | Referenzdatensatz & Evidence Preparation | 95 |
| AP3.3 | Candidate Generation & Ontologieintegration | 90 |
| AP3.4 | Regeln & Constraint Handling | 100 |
| AP3.5 | Controlled AI | 125 |
| AP3.6 | Evidenzkombination & Konfliktlogik | 100 |
| AP3.7 | Kalibrierung, Granularität & Abstain | 125 |
| AP3.8 | Baselines, Experimente & Sensitivität | 105 |
| AP3.9 | AP5-Übergabe, Audit Trail & Abschluss | 55 |
|  | **Gesamt** | **875** |

# 44. Zeitliche Struktur

## Oktober 2026
- Zielmodell
- AP1/AP2-Schnittstelle
- Referenzdatensatz
- erste Regelbaseline

## November 2026
- Candidate Generator
- Regeln
- Sprach-/Textverarbeitung
- erste kontrollierte KI-Komponente

## Dezember 2026
- Regel-KI-Varianten
- Constraints
- Konflikterkennung
- Audit Trail

## Januar 2027
- Evidenzkombination
- Kalibrierung
- Granularitätsfallback
- Abstain

## Februar 2027
- Experimentmatrix
- Baselines
- Risk-Coverage
- Robustheit und Sensitivität

## März 2027
- Zielverfahren auswählen
- Grenzen dokumentieren
- AP5-Export
- Abschlussvalidierung

# 45. Hauptrisiken

| Risiko | Reaktion |
|---|---|
| keine ausreichenden Referenzlabels | schwach überwachtes Labelmodell |
| Ontologie zu fein | hierarchischer Fallback / AP1-Rückkopplung |
| Memo zu mehrdeutig | gröbere Ausgabe / Abstain |
| KI erzeugt unzulässige Klassen | geschlossener Ontologieraum |
| Regeln erzeugen Scheinsicherheit | Regeln nur als Evidenz verwenden |
| Kanäle widersprechen | Konflikt explizit modellieren |
| Wahrscheinlichkeiten nicht stabil kalibrierbar | Sensitivitätsintervalle |
| AP2-Evidenz unzureichend | Rückkopplung an AP2 |
| hohe Abhängigkeit vom KI-Modell | Modell-/Promptvarianten vergleichen |

# 46. Offene Entscheidungen

Innerhalb von AP3 experimentell zu entscheiden:
1. Kandidatengenerierung
2. Form des Regelwerks
3. KI-Modell und Promptstrategie
4. Rule-Gated vs. Ensemble
5. Art der Evidenzkombination
6. Kalibrierungsverfahren
7. Granularitätskriterium
8. Abstain-Kriterien
9. Abstain-Schwellen
10. Konfliktbehandlung
11. ObserverHint-Nutzung
12. Out-of-Scope-Erkennung
13. Referenzdatensatzgröße
14. hierarchische Evaluationsmetrik
15. Mindestqualität für AP5
16. Einsatz schwach überwachter Modelle
17. Darstellung robuster Wahrscheinlichkeitsbereiche

# 47. Ergebnisbild

```text
AP2 Observation
+ Memo
+ Kontext
        ↓
zulässiger Ontologieraum
        ↓
Regelbasierte Evidenz
+ kontrollierte KI-Evidenz
        ↓
Kombination + Constraints
        ↓
Kalibrierte Klassenverteilung
        ↓
hierarchische Auflösung
        ↓
Entscheidung oder Abstain
        ↓
AP5
```

AP3 stellt damit die **semantische Unsicherheitsschicht** zwischen Datenerfassung und latentem Messmodell dar.

# 48. Status der Konkretisierung

## Direkt durch den Projektplan vorgegeben
- Zweck von AP3
- Eingänge aus AP1 und AP2
- Kombination aus Regeln und kontrollierter KI
- Klassenwahrscheinlichkeiten
- Unsicherheits-/Abstain-Logik
- keine lokalen Trainingsdaten als Voraussetzung
- Übergabe an AP5
- 875 Stunden
- Zeitraum Oktober 2026 bis März 2027
- schwach überwachte Labelmodelle / Sensitivitätsmodelle als Fallback

## In diesem Konzept operativ konkretisiert
- Forschungsfragen und Hypothesen
- Pipeline
- Datenmodell
- Regel-KI-Varianten
- Kalibrierungsverfahren
- hierarchischer Fallback
- Risk-Coverage
- Baselines
- Experimentdesign
- Audit Trail
- Quality Gates
- interne Aufwandsstruktur

Diese Punkte sind als Arbeitsentwurf zu verstehen und im Verlauf von AP3 experimentell zu prüfen und versioniert zu entscheiden.
