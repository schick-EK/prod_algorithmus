# AP3 – Konzept für mehrkanalige unsichere Annotation mit Abstain-Logik

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP3 – Mehrkanalige unsichere Annotation mit Abstain-Logik  
**Dokumenttyp:** Fachlich-methodisches Umsetzungskonzept / Versuchsspezifikation / Übergabegrundlage  
**Version:** 0.1.0  
**Soll-Zeitfenster:** Oktober 2026 bis März 2027  
**Aufwand laut Projektplan:** 875 Stunden  
**Abhängigkeit / Rolle:** AP1 + AP2; methodischer Hauptpfad des Gesamtverfahrens  
**Primäre Eingänge:** Ontologie, zulässige Klassen und Constraints aus AP1; Multimomentaufnahmen sowie Sprach-/Text-Memos aus AP2  
**Primäre Ausgänge:** Kandidatenklassen mit Wahrscheinlichkeiten, Abstain-/Nichtentscheidungsstatus und fehlerbehafteter Evidenzkanal für AP5  

---

# 1. Zielsetzung

AP3 entwickelt ein Verfahren, das strukturierte Beobachtungen sowie Sprach- und Textinformationen **nicht als harte Labels**, sondern als **fehlerbehaftete Evidenz** auf die in AP1 definierte Ontologie abbildet.

Das Verfahren soll für jede Beobachtung nicht zwingend genau eine Klasse bestimmen, sondern – abhängig von der verfügbaren Evidenz – folgende Ergebnisformen zulassen:

- eine Wahrscheinlichkeitsverteilung über mehrere Kandidatenklassen,
- eine Wahrscheinlichkeitsverteilung auf einer gröberen Granularitätsebene,
- einen expliziten `ABSTAIN`-Status,
- eine Kennzeichnung unzureichender oder widersprüchlicher Evidenz.

Die zentrale Leitfrage lautet:

> **Wie können sparse, heterogene und sprachlich mehrdeutige Beobachtungsdaten ohne unternehmensspezifische Trainingsdaten so auf eine Produktionsontologie abgebildet werden, dass die entstehende Klassenunsicherheit kalibriert, nachvollziehbar und für AP5 als probabilistische Evidenz nutzbar bleibt?**

---

# 2. Rolle von AP3 im Gesamtverfahren

```text
AP1
Ontologie
+ Klassenhierarchie
+ zulässige Relationen
+ Constraints
+ Fallbacks
        ↓
AP2
strukturierte Observation
+ Sprachmemo / Text
+ Kontext
+ Beobachtungsqualität
+ Provenienz
        ↓
AP3
mehrkanalige probabilistische Annotation
+ Kandidatenklassen
+ Klassenwahrscheinlichkeiten
+ Abstain
+ Annotationsqualität
        ↓
AP5
latentes Mehrkanal-Messmodell
```

AP3 ist die semantische Übersetzungsschicht zwischen **beobachtbarer Evidenz** und **latentem Produktionszustand**.

AP3 darf daher keinen scheinbar sicheren Ground Truth erzeugen, wenn die Evidenz dies nicht trägt.

---

# 3. Direkte Vorgaben aus dem Projektplan

Für AP3 sind im Projektplan folgende Kernaussagen festgelegt:

## Zweck

Sprach- und Textinformationen werden als fehlerbehaftete Evidenz auf die Ontologie abgebildet. Das Modell soll Unsicherheit explizit ausgeben und sich bei unzureichender Evidenz enthalten können.

## Eingänge

- Ontologie, zulässige Klassen und Constraints aus AP1
- Multimomentaufnahmen und Sprach-/Text-Memos aus AP2
- keine unternehmensspezifischen Trainingsdaten als Voraussetzung

## Kernarbeiten

- Sprach-/Text-zu-Ontologie-Zuordnung entwickeln
- Regeln und kontrollierte KI kombinieren
- Klassenwahrscheinlichkeiten statt harter Labels erzeugen
- Unsicherheits- und Enthaltungslogik kalibrieren

## Erwartete Ergebnisse

- Kandidatenklassen mit Wahrscheinlichkeiten
- Abstain-/Nichtentscheidungsstatus
- probabilistische Evidenzbeschreibung als Input für AP5

## Wesentliches Risiko

Die Annotation könnte ohne lokale Trainingsdaten nicht ausreichend kalibrierbar sein.

## Vorgesehener Fallback

- schwach überwachte Labelmodelle
- robuste Sensitivitätsmodelle

---

# 4. Forschungsgegenstand von AP3

AP3 untersucht nicht primär, welches KI-Modell die höchste Klassifikationsgenauigkeit erreicht.

Der methodische Kern besteht darin zu bestimmen:

1. wie Ontologie, Regeln, strukturierte Beobachtung und Sprache kombiniert werden können,
2. wie die verbleibende Unsicherheit quantifiziert werden kann,
3. wann eine Feinklasse nicht belastbar genug ist,
4. wann auf eine gröbere Klasse zurückgefallen werden sollte,
5. wann eine vollständige Enthaltung sinnvoller ist,
6. wie Wahrscheinlichkeiten ohne große lokale Trainingsmenge kalibriert werden können,
7. wie Fehler und Unsicherheiten transparent an AP5 weitergegeben werden.

Der Forschungsgegenstand ist damit eine **unsicherheitsbewusste semantische Evidenzbildung**, nicht eine klassische Einzellabel-Klassifikation.

---

# 5. Leitprinzipien

## P1 – Keine harte Zwischenentscheidung

AP3 soll Unsicherheit nicht durch eine erzwungene `argmax`-Entscheidung abschneiden.

Nicht:

```text
PS_WAIT_MATERIAL
```

sondern beispielsweise:

```text
PS_WAIT_MATERIAL     0.56
PS_WAIT_INFORMATION  0.19
PS_WAITING_OTHER     0.10
PS_UNKNOWN           0.15
```

---

## P2 – Ontologie begrenzt den Suchraum

Die KI darf nicht frei beliebige Labels erzeugen.

Zulässige Klassen stammen ausschließlich aus der versionierten AP1-Ontologie.

---

## P3 – Constraints sind Bestandteil der Annotation

AP1-Constraints werden nicht nur nachträglich geprüft, sondern möglichst früh in Kandidatengenerierung und Scoring berücksichtigt.

---

## P4 – Evidenzquellen bleiben unterscheidbar

Strukturierte Beobachtung, Memo, Kontext und ggf. abgeleitete Merkmale dürfen nicht zu einer einzigen undurchsichtigen Eingabe verschmolzen werden.

Die Herkunft jedes Signals bleibt nachvollziehbar.

---

## P5 – Abstain ist ein korrektes Ergebnis

Enthaltung ist kein Fehlerzustand.

Sie ist erforderlich, wenn:

- Evidenz fehlt,
- Evidenz widersprüchlich ist,
- Klassen nicht trennbar sind,
- die Verteilung zu flach ist,
- ein notwendiger Kontext fehlt,
- die Eingabe außerhalb des vorgesehenen Gültigkeitsbereichs liegt.

---

## P6 – Granularität wird evidenzabhängig gewählt

Das Modell darf auf einer groben Klasse sicherer sein als auf einer Feinklasse.

Beispiel:

```text
P(PS_WAITING) = 0.87
```

während innerhalb von `PS_WAITING` gilt:

```text
P(PS_WAIT_MATERIAL | PS_WAITING)     = 0.39
P(PS_WAIT_INFORMATION | PS_WAITING)  = 0.34
P(PS_WAIT_MACHINE | PS_WAITING)      = 0.27
```

Dann kann `PS_WAITING` ein sinnvolleres Annotationsergebnis sein als eine erzwungene G3-Klasse.

---

## P7 – Kalibrierung ist wichtiger als reine Trefferquote

Eine Wahrscheinlichkeit von 0,8 soll langfristig ungefähr mit einer entsprechenden empirischen Trefferwahrscheinlichkeit verbunden sein.

Unkalibrierte Konfidenzwerte dürfen nicht als belastbare Wahrscheinlichkeiten ausgegeben werden.

---

# 6. Scope

## 6.1 In Scope

AP3 umfasst:

- Text-/Memo-Aufbereitung,
- strukturierte Beobachtungsmerkmale als Evidenz,
- Ontologie-Mapping,
- Kandidatengenerierung,
- Regelwerk,
- kontrollierte KI-Komponente,
- probabilistisches Scoring,
- Constraint-Anwendung,
- Fallback auf gröbere Klassen,
- Abstain-Logik,
- Kalibrierung,
- Evaluationsdatensatz,
- Baseline-Vergleich,
- Fehleranalyse,
- Sensitivitätsanalyse,
- maschinenlesbare Ausgabe an AP5,
- technische und methodische Dokumentation.

## 6.2 Out of Scope

Nicht Bestandteil von AP3 sind:

- MES-/ERP-Linkage aus AP4,
- Mehrkanalfusion mit MES/ERP aus AP5,
- latente Zustandsrekonstruktion,
- Kennzahlberechnung,
- Maßnahmenbewertung,
- kausale Wirkungsschätzung,
- robuste Maßnahmenpriorisierung.

---

# 7. Eingabemodell

AP3 verarbeitet eine Observation aus AP2 als Bündel separater Evidenzelemente.

Beispiel:

```yaml
observation_id: OBS_000184

structured_features:
  machine_status: stopped
  operator_activity: waiting
  material_status: unknown

memo:
  text: "Material für den Auftrag ist noch nicht da."

context:
  process_step_id: ASSEMBLY_04
  workcenter_id: WC_12

observation_quality:
  level: medium

provenance:
  schema_version: 1.0.0
  ontology_version: 1.0.0
```

---

# 8. Evidenzkanäle innerhalb von AP3

Für AP3 werden zunächst drei semantische Evidenzkanäle unterschieden:

## K1 – strukturierte Beobachtung

Beispiele:

- `machine_status = stopped`
- `operator_activity = waiting`
- `tool_change_visible = true`

## K2 – Sprach-/Textmemo

Freie natürliche Sprache.

Beispiel:

> „Wir warten noch auf die Freigabe von QS.“

## K3 – Beobachtungskontext

Beispiele:

- Prozessschritt,
- Maschine,
- Workcenter,
- Schicht,
- Produktkontext.

Der optionale `ObserverHint` aus AP2 kann als separater vierter Kanal geführt werden, sollte aber nicht automatisch mit Ground Truth gleichgesetzt werden.

---

# 9. Zielobjekt der Annotation

Die Ausgabe einer Annotation ist kein einzelnes Label, sondern ein **AnnotationResult**.

Vorgeschlagene Struktur:

```yaml
annotation_id: ANN_000184
observation_id: OBS_000184

ontology_version: 1.0.0
annotation_model_version: 0.1.0

candidate_classes:
  - class_id: PS_WAIT_MATERIAL
    probability: 0.56
  - class_id: PS_WAIT_INFORMATION
    probability: 0.19
  - class_id: PS_WAIT_MACHINE
    probability: 0.10
  - class_id: PS_UNKNOWN
    probability: 0.15

selected_granularity: G3

decision_status: probabilistic

abstain:
  active: false

quality:
  calibration_status: calibrated
  evidence_sufficiency: medium
```

---

# 10. Ergebnisstatus

AP3 soll mindestens folgende Status unterscheiden:

```text
PROBABILISTIC
COARSE_ONLY
ABSTAIN_INSUFFICIENT_EVIDENCE
ABSTAIN_CONFLICTING_EVIDENCE
ABSTAIN_OUT_OF_SCOPE
ABSTAIN_MISSING_REQUIRED_CONTEXT
INVALID_INPUT
```

Diese Status sollen AP5 explizit mitgegeben werden.

---

# 11. Vorgeschlagene Pipeline

Die folgende Pipeline ist ein operativer Designvorschlag zur Umsetzung der Projektvorgaben.

```text
Observation aus AP2
        ↓
1. Input Validation
        ↓
2. Text-/Memo-Normalisierung
        ↓
3. Evidenzextraktion
        ↓
4. Ontologie-Kandidatengenerierung
        ↓
5. Regelbasierte Filter / Constraints
        ↓
6. kontrolliertes KI-Scoring
        ↓
7. Multi-Evidence Aggregation
        ↓
8. Wahrscheinlichkeitskalibrierung
        ↓
9. Granularitätsentscheidung
        ↓
10. Abstain-Entscheidung
        ↓
11. AnnotationResult
        ↓
AP5
```

---

# 12. Stufe 1 – Input Validation

Vor jeder Annotation wird geprüft:

- Observation-ID vorhanden?
- Ontologieversion bekannt?
- Eingabe formal valide?
- strukturierte Features syntaktisch gültig?
- Memo vorhanden oder Missingness dokumentiert?
- Kontextwerte gültig?
- AP1-Klassenreferenzen aktuell?

Fehlerhafte Inputs werden nicht stillschweigend korrigiert.

---

# 13. Stufe 2 – Text-/Memo-Aufbereitung

Die Memo-Pipeline soll bewusst einfach und nachvollziehbar starten.

Mögliche Schritte:

- Transkription übernehmen, sofern Text bereits vorliegt,
- Whitespace-/Formatnormalisierung,
- optional sprachliche Normalisierung,
- Erhalt des Originaltexts,
- keine irreversiblen Löschungen semantisch relevanter Inhalte.

Die Originalfassung bleibt immer referenzierbar.

---

# 14. Stufe 3 – Evidenzextraktion

Aus dem Memo werden fachlich relevante Aussagen extrahiert.

Beispiel:

```text
"Material für Auftrag 4711 ist noch nicht da."
```

mögliche Evidenzelemente:

```yaml
evidence:
  activity_signal: waiting
  missing_resource: material
  order_reference: ORDER_4711
  temporal_signal: current
```

Wichtig:

Die Extraktion ist noch keine finale Ontologieklassifikation.

---

# 15. Stufe 4 – Kandidatengenerierung

Die Kandidatengenerierung reduziert den Ontologieraum auf fachlich plausible Klassen.

Beispiel:

Input:

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

Nicht plausible Klassen werden über AP1-Hierarchie und Constraints ausgeschlossen oder stark abgewertet.

---

# 16. Stufe 5 – Regelbasierte Komponente

Der Projektplan verlangt die Kombination aus Regeln und kontrollierter KI.

Das Regelwerk soll insbesondere nutzen:

- AP1-Klassenhierarchie,
- Fallbackbeziehungen,
- `requiresContext`,
- `requiresEvidence`,
- Disjunktheitsregeln,
- fachliche Schlüsselindikatoren,
- Negativregeln,
- Missingness-Regeln.

Beispiel:

```text
IF operator_activity = waiting
THEN include PS_WAITING-family

IF memo contains evidence for missing material
THEN support PS_WAIT_MATERIAL

IF material_status = available
AND no contradictory evidence
THEN reduce support for PS_WAIT_MATERIAL
```

Regeln dürfen Wahrscheinlichkeiten beeinflussen, aber nicht ohne Begründung eine harte Klasse erzwingen.

---

# 17. Stufe 6 – Kontrollierte KI-Komponente

Die konkrete KI-Technik ist laut Projektplan offen.

Als Arbeitsarchitektur wird empfohlen, eine KI-Komponente nur innerhalb eines kontrollierten Ontologieraums einzusetzen.

Mögliche Aufgaben:

- Memo semantisch interpretieren,
- relevante Ontologiebegriffe erkennen,
- Kandidaten bewerten,
- Evidenzstellen begründen,
- Mehrdeutigkeit markieren.

Nicht zulässig:

- freie Erfindung neuer Produktionsklassen,
- ungeprüfte Änderung der Ontologie,
- Ausgabe einer Klasse außerhalb des erlaubten Kandidatenraums.

---

# 18. KI-Ausgabeformat

Die KI-Komponente sollte strukturiert antworten.

Beispiel:

```yaml
candidate_scores:
  PS_WAIT_MATERIAL: 0.72
  PS_WAIT_INFORMATION: 0.13
  PS_WAIT_MACHINE: 0.08
  PS_UNKNOWN: 0.07

supporting_evidence:
  - source: memo
    span: "Material ... noch nicht da"
    supports: PS_WAIT_MATERIAL

uncertainty_notes:
  - "Materialstatus wurde nicht direkt beobachtet."
```

Diese Scores sind zunächst **Rohscores** und noch keine kalibrierten Endwahrscheinlichkeiten.

---

# 19. Multi-Evidence Aggregation

Strukturierte Beobachtung und Sprachmemo können:

- übereinstimmen,
- sich ergänzen,
- widersprechen,
- unterschiedlich zuverlässig sein.

Beispiel:

```text
Observation:
machine_status = running

Memo:
"Maschine steht wegen Störung."
```

Das System darf den Konflikt nicht verstecken.

Vorgeschlagen wird deshalb, vor der Endwahrscheinlichkeit getrennte Kanalbeiträge zu speichern:

```yaml
channel_scores:
  structured_observation:
    PS_PRODUCTIVE: 0.65
  memo:
    PS_DISTURB_MACHINE: 0.78

conflict_detected: true
```

---

# 20. Regel-KI-Kombination

Mindestens drei Architekturvarianten sollen experimentell vergleichbar bleiben:

## Variante A – Rules First

Regeln erzeugen Kandidaten; KI bewertet nur diese Kandidaten.

## Variante B – AI First + Constraint Filter

KI erzeugt Scores; anschließend werden Ontologieconstraints angewendet.

## Variante C – Parallel Ensemble

Regeln und KI erzeugen getrennte Evidenzscores, die anschließend kombiniert werden.

Für den ersten kontrollierten Aufbau wird **Variante A oder C** empfohlen, weil die Ontologiebegrenzung transparent bleibt.

---

# 21. Wahrscheinlichkeitsbildung

Rohscores der Komponenten dürfen nicht unmittelbar als Wahrscheinlichkeiten interpretiert werden.

Die Pipeline soll explizit unterscheiden:

```text
raw score
        ↓
aggregation
        ↓
calibration
        ↓
probability
```

Die konkrete mathematische Kalibrierung wird im AP experimentell bestimmt.

---

# 22. Kalibrierung

Die Kalibrierung ist Kernbestandteil von AP3.

Ziel:

Wenn ein Annotationsergebnis beispielsweise mit 0,8 ausgegeben wird, soll diese Größe auf kontrollierten Referenzfällen empirisch sinnvoll interpretierbar sein.

Mögliche operative Verfahren zur Prüfung:

- held-out Referenzfälle,
- Reliability Diagrams,
- Brier Score,
- Log Loss,
- Expected Calibration Error,
- klassenweise Calibration Checks.

Diese Verfahren sind Umsetzungsvorschläge; der Projektplan legt kein konkretes Kalibrierverfahren fest.

---

# 23. Referenz- und Evaluationssatz

Da keine unternehmensspezifischen Trainingsdaten vorausgesetzt werden dürfen, wird ein gezielt konstruierter Evaluationssatz benötigt.

Er sollte enthalten:

## Eindeutige Fälle

Beispiel:

```text
"Material fehlt; Mitarbeiter wartet."
```

## Mehrdeutige Fälle

Beispiel:

```text
"Maschine steht; Grund unbekannt."
```

## Widersprüchliche Fälle

Beispiel:

```text
strukturierte Observation: machine running
Memo: "Maschine steht"
```

## Sparse Fälle

Nur ein schwaches Signal.

## Missing-Context-Fälle

Feinklasse benötigt Kontext, der nicht vorhanden ist.

## Out-of-Scope-Fälle

Beobachtung passt nicht sinnvoll in die aktuelle Ontologie.

---

# 24. Referenzlabel

Für Evaluationsfälle sollte – soweit möglich – nicht nur ein einzelnes hartes Referenzlabel erzeugt werden.

Mögliche Referenzformen:

- eindeutige Zielklasse,
- zulässige Klassenmenge,
- zulässiger Parent,
- explizit mehrdeutiger Fall,
- erwarteter Abstain-Fall.

Damit kann AP3 auch auf „korrekte Nicht-Entscheidung“ bewertet werden.

---

# 25. Granularitätslogik

AP3 entscheidet nicht nur **welche Klasse**, sondern auch **auf welcher Granularität** eine Aussage tragfähig ist.

Beispiel:

```text
PS_WAIT_MATERIAL:      0.36
PS_WAIT_INFORMATION:   0.34
PS_WAIT_MACHINE:       0.18
other waiting:         0.12
```

Die G3-Unterscheidung ist schwach.

Aggregation:

```text
PS_WAITING: 0.91
```

Mögliche Ausgabe:

```yaml
selected_class: PS_WAITING
selected_granularity: G2
decision_status: COARSE_ONLY
```

---

# 26. Abstain-Logik

Die Enthaltungslogik wird explizit kalibriert.

Ein Abstain kann ausgelöst werden durch:

1. zu geringe maximale Wahrscheinlichkeit,
2. zu geringe Trennung zwischen Top-Kandidaten,
3. hohe Entropie,
4. fehlende zwingende Evidenz,
5. fehlenden notwendigen Kontext,
6. Konflikt zwischen Kanälen,
7. Out-of-Scope-Erkennung,
8. geringe Eingabequalität.

Die finale Regel wird experimentell bestimmt.

---

# 27. Beispiel einer Abstain-Ausgabe

```yaml
annotation_id: ANN_000201
observation_id: OBS_000201

candidate_classes:
  - class_id: PS_WAIT_MATERIAL
    probability: 0.34
  - class_id: PS_WAIT_INFORMATION
    probability: 0.31
  - class_id: PS_WAIT_MACHINE
    probability: 0.24
  - class_id: PS_UNKNOWN
    probability: 0.11

decision_status: ABSTAIN_INSUFFICIENT_EVIDENCE

abstain:
  active: true
  reason: LOW_SEPARATION
  top1_probability: 0.34
  top1_top2_margin: 0.03
```

---

# 28. Fallback auf gröbere Ontologieebenen

Vor vollständigem Abstain sollte geprüft werden, ob eine belastbare gröbere Aussage möglich ist.

Prioritätslogik:

```text
G3 belastbar?
  ja → G3 probabilistisch ausgeben
  nein
      ↓
G2 belastbar?
  ja → G2 / COARSE_ONLY
  nein
      ↓
G1 belastbar?
  ja → G1 / COARSE_ONLY
  nein
      ↓
ABSTAIN
```

Diese Logik verbindet AP1-Fallbacks mit AP3-Unsicherheitsbehandlung.

---

# 29. Fehler- und Konfliktmodell

AP3 soll Fehlerursachen differenzieren.

Vorgeschlagene Kategorien:

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

Diese Fehlercodes werden als Metadaten an AP5 weitergegeben.

---

# 30. Erklärbarkeit und Audit Trail

Jede Annotation soll rekonstruierbar sein.

Mindestens zu speichern:

- Input-Version,
- Ontologieversion,
- Regelwerkversion,
- Modellversion,
- Kalibrierungsversion,
- Kandidaten vor Constraints,
- Kandidaten nach Constraints,
- Rohscores,
- kalibrierte Wahrscheinlichkeiten,
- Abstain-Entscheidung,
- relevante Evidenzstellen.

Damit können spätere Validierungsfehler aus AP10 bis auf AP3 zurückverfolgt werden.

---

# 31. Datenmodell

Vorgeschlagene Hauptentitäten:

```text
AnnotationRun
AnnotationResult
CandidateClassScore
EvidenceItem
ChannelScore
ConstraintApplication
CalibrationRecord
AbstainDecision
AnnotationError
ModelVersion
RuleSetVersion
EvaluationCase
EvaluationResult
```

---

# 32. AnnotationResult – vollständiges Beispiel

```yaml
annotation_id: ANN_000184
observation_id: OBS_000184

versions:
  ontology: 1.0.0
  annotation_pipeline: 0.3.0
  rule_set: 0.2.0
  ai_component: 0.1.0
  calibration: 0.1.0

evidence_summary:
  structured_observation: present
  memo: present
  context: partial
  observation_quality: medium

candidate_classes:
  - class_id: PS_WAIT_MATERIAL
    raw_score: 0.81
    probability: 0.56

  - class_id: PS_WAIT_INFORMATION
    raw_score: 0.36
    probability: 0.19

  - class_id: PS_WAIT_MACHINE
    raw_score: 0.21
    probability: 0.10

  - class_id: PS_UNKNOWN
    raw_score: 0.18
    probability: 0.15

selected_granularity: G3
decision_status: PROBABILISTIC

abstain:
  active: false

diagnostics:
  channel_conflict: false
  missing_required_context: false
  entropy: 1.16
```

---

# 33. Evaluationsdimensionen

AP3 soll mindestens entlang folgender Dimensionen geprüft werden:

| Dimension | Leitfrage |
|---|---|
| Kandidatenabdeckung | Ist die richtige/plausible Klasse im Kandidatenset? |
| Top-K-Verhalten | Wie oft liegt die Referenz in Top-1 / Top-3? |
| Kalibrierung | Entsprechen Wahrscheinlichkeiten empirischer Zuverlässigkeit? |
| Abstain-Qualität | Enthält sich das System bei schwierigen Fällen? |
| Risk-Coverage | Wie verändert sich Fehler bei höherer Enthaltungsrate? |
| Granularitätswahl | Wird bei unzureichender Evidenz korrekt gröber entschieden? |
| Constraint-Konformität | Werden AP1-Regeln eingehalten? |
| Robustheit | Verhalten bei Missingness, Widerspruch und Sparse Input |
| Reproduzierbarkeit | Gleicher Input + Versionen → reproduzierbares Ergebnis |

---

# 34. Baselines

Für die methodische Bewertung sollten einfache Vergleichsverfahren implementiert werden.

## Baseline B1 – harte Regelklassifikation

Regeln erzeugen direkt ein Einzel-Label.

Zweck:
Vergleich mit der unsicherheitsgeführten Lösung.

## Baseline B2 – AI Top-1

KI wählt nur die wahrscheinlichste Klasse ohne Kalibrierung und ohne Abstain.

## Baseline B3 – Parent-only

Nur grobe G2-Klassen.

Diese Baselines helfen zu prüfen, welchen zusätzlichen Nutzen Probabilistik, Kalibrierung und Abstain tatsächlich liefern.

---

# 35. Sensitivitätsanalyse

Wegen fehlender lokaler Trainingsdaten sollen zentrale Entscheidungen auf Sensitivität geprüft werden.

Beispiele:

- Variation der Abstain-Schwelle,
- Variation der Kanalgewichte,
- Variation der Regelstärke,
- Entfernen einzelner Evidenzkanäle,
- verschiedene Kalibrierverfahren,
- verschiedene Ontologiegranularitäten.

Ergebnis soll nicht nur „bestes Modell“, sondern ein Verständnis der Stabilität des Verfahrens sein.

---

# 36. Fallback 1 – schwach überwachte Labelmodelle

Wenn keine ausreichend große Referenzmenge verfügbar ist, können mehrere schwache Labelquellen kombiniert werden.

Beispiele für schwache Quellen:

- Regeln,
- Schlüsselwortlogik,
- ObserverHint,
- KI-Komponente,
- strukturierte Features.

Statt eine Quelle als Wahrheit zu behandeln, werden deren Fehlercharakteristika gemeinsam modelliert.

Dies entspricht dem im Projektplan vorgesehenen Fallback eines schwach überwachten Labelmodells.

---

# 37. Fallback 2 – robuste Sensitivitätsmodelle

Falls Wahrscheinlichkeiten nicht ausreichend belastbar kalibriert werden können, soll AP3 keine Scheingenauigkeit erzeugen.

Mögliche Ausgabeform:

```text
P(PS_WAIT_MATERIAL) ∈ [0.35, 0.62]
```

oder mehrere plausible Szenarien:

```text
Scenario A – memo stärker gewichtet
Scenario B – structured observation stärker gewichtet
Scenario C – konservative Aggregation
```

AP5 erhält dann Sensitivitätsbereiche statt scheinbar exakter Wahrscheinlichkeiten.

---

# 38. Technische Zielarchitektur

Vorgeschlagene modulare Architektur:

```text
AP2 Export
    ↓
Input Adapter
    ↓
Evidence Normalizer
    ↓
Candidate Generator
    ↓
Rule Engine
    ↘
      Evidence Aggregator
    ↗
Controlled AI Component
    ↓
Calibration Layer
    ↓
Granularity + Abstain Layer
    ↓
Annotation Store
    ↓
AP5 Export
```

Die konkrete Technologie ist noch Designentscheidung.

---

# 39. Schnittstelle zu AP1

AP3 muss aus AP1 mindestens beziehen können:

- Klassen-ID,
- Parent,
- Granularität,
- Fallback,
- Definition,
- Positiv-/Negativbeispiele,
- zulässige Relationen,
- Disjunktheiten,
- `requiresContext`,
- `requiresEvidence`,
- Klassenstatus,
- Ontologieversion.

AP3 darf keine lokalen Schattenklassen außerhalb der Ontologie einführen.

---

# 40. Schnittstelle zu AP2

AP3 benötigt pro Observation mindestens:

- Observation-ID,
- strukturierte Beobachtungsmerkmale,
- Memo/Text,
- Kontext,
- Beobachtungsqualität,
- Missingness,
- optional ObserverHint,
- Zeitbezug,
- Provenienz,
- Schema-/Ontologieversion.

---

# 41. Schnittstelle zu AP5

AP5 erhält keine erzwungene Einzelklasse.

Minimaler Output:

```yaml
observation_id: OBS_000184

class_distribution:
  PS_WAIT_MATERIAL: 0.56
  PS_WAIT_INFORMATION: 0.19
  PS_WAIT_MACHINE: 0.10
  PS_UNKNOWN: 0.15

decision_status: PROBABILISTIC
selected_granularity: G3

annotation_quality:
  evidence_sufficiency: medium
  channel_conflict: false

provenance:
  annotation_pipeline_version: 0.3.0
  ontology_version: 1.0.0
```

Bei Abstain wird der Status explizit weitergegeben.

---

# 42. Qualitäts-Gates

## Gate 1 – Ontology Ready

- AP1-Version technisch lesbar,
- Klassenhierarchie verfügbar,
- Constraints verfügbar,
- Fallbacks verfügbar.

## Gate 2 – Input Ready

- AP2-Testdaten einlesbar,
- Memo/Text zugänglich,
- Missingness erhalten,
- Provenienz erhalten.

## Gate 3 – Candidate Ready

- plausible Kandidaten generierbar,
- Ontologieverletzungen verhindert,
- `PS_UNKNOWN` bzw. Fallback verfügbar.

## Gate 4 – Probabilistic Ready

- Ausgabe mehrerer Kandidaten mit normierten Wahrscheinlichkeiten,
- keine erzwungene Top-1-Übergabe.

## Gate 5 – Calibrated Ready

- Wahrscheinlichkeiten auf Referenz-/kontrollierten Fällen geprüft,
- Kalibrierungsqualität dokumentiert.

## Gate 6 – Abstain Ready

- Abstain-Fälle reproduzierbar,
- Gründe dokumentiert,
- Schwelle bzw. Regel versioniert.

## Gate 7 – AP5 Ready

- probabilistischer Output maschinenlesbar,
- AP5-Testimport erfolgreich,
- Abstain und Fehlerstatus erhalten.

---

# 43. Testfallkatalog

## T01 – eindeutiges Warten auf Material

Observation:
`operator_activity = waiting`

Memo:
„Material ist noch nicht da.“

Erwartung:
`PS_WAIT_MATERIAL` höchste Wahrscheinlichkeit; kein Abstain.

## T02 – Warten, Ursache unbekannt

Observation:
`operator_activity = waiting`

Memo:
keines.

Erwartung:
gröbere Klasse `PS_WAITING` oder Abstain auf G3.

## T03 – widersprüchliche Kanäle

Observation:
`machine_status = running`

Memo:
„Maschine steht wegen Fehler.“

Erwartung:
`CHANNEL_CONFLICT`; keine künstlich sichere Feinklasse.

## T04 – fehlender Kontext

Eine G3-Klasse erfordert Prozesskontext, dieser fehlt.

Erwartung:
Fallback auf gröbere Klasse oder `ABSTAIN_MISSING_REQUIRED_CONTEXT`.

## T05 – Out of Scope

Text beschreibt einen Sachverhalt außerhalb der aktuellen Ontologie.

Erwartung:
`ABSTAIN_OUT_OF_SCOPE`.

## T06 – geringe Beobachtungsqualität

`observation_quality = low`

Erwartung:
höhere Unsicherheit bzw. konservativere Granularität.

## T07 – eindeutiges Rüsten

`tool_change_visible = true`

Memo:
„Werkzeugwechsel für neues Produkt.“

Erwartung:
hohe Unterstützung für `PS_SETUP_TOOL_CHANGE`.

## T08 – keine lokale Trainingshistorie

Pipeline muss ohne firmenspezifisch trainiertes Modell ausführbar bleiben.

## T09 – Ontologieversion ändert sich

Alte Annotation bleibt mit alter Version reproduzierbar.

## T10 – AP5-Export

Verteilung und Abstain-Status werden vollständig übernommen.

---

# 44. Pilot- und Evaluationskennzahlen

Vorgeschlagene Kennzahlen:

| Kennzahl | Zweck |
|---|---|
| Candidate Recall | plausible Referenzklasse im Kandidatenset |
| Top-1 Accuracy | einfache Vergleichsgröße |
| Top-3 Accuracy | Kandidatenqualität |
| Brier Score | probabilistische Qualität |
| Log Loss | probabilistische Qualität |
| Calibration Error | Kalibrierung |
| Abstain Rate | Anteil Enthaltungen |
| Error Rate on Accepted | Fehler unter nicht-abgelehnten Fällen |
| Coarse-Fallback Rate | Anteil gröberer Ausgaben |
| Constraint Violation Rate | Ontologiekonsistenz |
| Channel Conflict Rate | Häufigkeit widersprüchlicher Evidenz |
| Out-of-Scope Rate | Ontologieabdeckung |

Die konkrete Auswahl der finalen Kennzahlen wird innerhalb von AP3 festgelegt.

---

# 45. Definition of Done

AP3 ist abgeschlossen, wenn:

- [ ] AP1-Ontologie versioniert eingelesen werden kann
- [ ] AP2-Beobachtungen und Memos reproduzierbar eingelesen werden können
- [ ] Sprach-/Textinformationen auf Ontologiekandidaten abgebildet werden können
- [ ] strukturierte Observation Features als separater Evidenzkanal verarbeitet werden
- [ ] Regelkomponente implementiert ist
- [ ] kontrollierte KI-Komponente implementiert bzw. experimentell ersetzt ist
- [ ] Kandidatenklassen erzeugt werden
- [ ] Klassenwahrscheinlichkeiten statt ausschließlich harter Labels ausgegeben werden
- [ ] Constraints aus AP1 berücksichtigt werden
- [ ] Fallback auf gröbere Klassen funktioniert
- [ ] Abstain-Logik implementiert ist
- [ ] Abstain-Gründe explizit gespeichert werden
- [ ] Referenz-/Evaluationssatz vorliegt
- [ ] Kalibrierung geprüft und dokumentiert ist
- [ ] Baseline-Vergleich durchgeführt wurde
- [ ] Sensitivität wesentlicher Designparameter dokumentiert ist
- [ ] Fälle mangelnder Kalibrierbarkeit mit Fallback behandelt werden
- [ ] Annotationen vollständig versioniert und reproduzierbar sind
- [ ] AP5-Testexport erzeugt werden kann
- [ ] AP5 keine erzwungene Einzelklasse erhält
- [ ] bekannte Unsicherheiten und Grenzen dokumentiert sind

Zentrales Abnahmekriterium:

> **AP5 erhält für jede auswertbare Beobachtung eine nachvollziehbare probabilistische Evidenzbeschreibung auf der AP1-Ontologie oder einen explizit begründeten Abstain-Fall – niemals eine scheinbar sichere Einzelklasse allein aufgrund technischer Bequemlichkeit.**

---

# 46. Liefergegenstände

| ID | Liefergegenstand | Inhalt |
|---|---|---|
| D3.1 | Annotation Pipeline | End-to-End-Verarbeitung von AP2 bis AnnotationResult |
| D3.2 | Rule Set | versionierte Regeln und Constraint-Anwendung |
| D3.3 | Controlled AI Component | kontrollierte semantische Zuordnung |
| D3.4 | Calibration Layer | Kalibrierung der Klassenwahrscheinlichkeiten |
| D3.5 | Abstain Module | Enthaltungs- und Granularitätslogik |
| D3.6 | Evaluation Set | eindeutige, sparse, mehrdeutige und Konfliktfälle |
| D3.7 | Evaluation Report | Kalibrierung, Baselines, Sensitivität und Fehleranalyse |
| D3.8 | AP5 Interface | maschinenlesbare probabilistische Übergabe |
| D3.9 | Method Documentation | Annahmen, Versionen, Grenzen und Fallbacks |

---

# 47. Aufwandstruktur für 875 Stunden

Die folgende Struktur ist ein operativer Vorschlag zur Ausgestaltung des im Projektplan vorgegebenen Gesamtaufwands.

| Teilpaket | Inhalt | Stunden |
|---|---|---:|
| AP3.1 | AP1/AP2-Schnittstellen, Daten- und Zielmodell | 70 |
| AP3.2 | Text-/Memo-Pipeline und Evidenzextraktion | 115 |
| AP3.3 | Ontologie-Kandidatengenerierung | 95 |
| AP3.4 | Regelwerk und Constraint Engine | 100 |
| AP3.5 | kontrollierte KI-Komponente | 145 |
| AP3.6 | Multi-Evidence-Aggregation & Wahrscheinlichkeitsmodell | 105 |
| AP3.7 | Kalibrierung, Granularität und Abstain | 105 |
| AP3.8 | Evaluationssatz, Baselines und Sensitivitätsanalyse | 85 |
| AP3.9 | AP5-Schnittstelle, Dokumentation und Abschlussvalidierung | 55 |
|  | **Gesamt** | **875** |

---

# 48. Vorgeschlagene zeitliche Struktur Oktober 2026 bis März 2027

## Oktober 2026 – Spezifikation und Schnittstellen

- AP1-Ontologie technisch anbinden
- AP2-Datenformat einlesen
- AnnotationResult spezifizieren
- Referenzfälle definieren
- erste Rule-Baseline

## November 2026 – Text-/Memo-Pipeline

- Memo-/Textverarbeitung
- Evidenzextraktion
- Kandidatengenerierung
- erste kontrollierte KI-Komponente

## Dezember 2026 – Regel-KI-Kombination

- Constraint Engine
- Kanaltrennung
- Varianten Rules First / Parallel testen
- Audit Trail

## Januar 2027 – Probabilistik und Kalibrierung

- Rohscores zu Wahrscheinlichkeiten
- Kalibrierverfahren
- Granularitätslogik
- Abstain-Prototyp

## Februar 2027 – Evaluation und Sensitivität

- Referenzset ausbauen
- Baselines
- Risk-Coverage / Kalibrierung
- Sparse-/Konfliktfälle
- Fallbackmodelle

## März 2027 – Stabilisierung und Übergabe

- finale Pipelineversion
- Fehleranalyse
- AP5-Export
- Dokumentation
- Quality Gate und DoD

Die Monatsstruktur ist eine operative Projektplan-Ableitung und keine zusätzliche Vorgabe des ursprünglichen Projektauftrags.

---

# 49. Hauptrisiken und Fallbacks

| Risiko | Wirkung | Umgang |
|---|---|---|
| keine lokalen Trainingsdaten | Modell schlecht kalibrierbar | Regeln, schwache Überwachung, kontrollierte Referenzfälle |
| Ontologie zu fein | Klassen nicht trennbar | Fallback auf Parent / Rückkopplung an AP1 |
| Sprache mehrdeutig | flache Verteilungen | Abstain oder gröbere Klasse |
| Regeln zu dominant | Scheinsicherheit | Regeln als Evidenz statt harte Wahrheit |
| KI halluziniert Klassen | Ontologieverletzung | geschlossener Kandidatenraum |
| Kanalwiderspruch | falsche Sicherheit | Konflikt explizit modellieren |
| Kalibrierung instabil | Wahrscheinlichkeiten nicht belastbar | Sensitivitätsbereiche statt Punktwahrscheinlichkeit |
| Evaluationssatz zu klein | unsichere Qualitätsaussage | kontrollierte/synthetische Grenzfälle + dokumentierte Unsicherheit |

---

# 50. Offene Designentscheidungen

Innerhalb von AP3 müssen insbesondere folgende Punkte experimentell konkretisiert werden:

1. technische Sprach-/Text-Pipeline
2. Art der Evidenzextraktion
3. konkretes Regelwerk
4. konkrete KI-Komponente
5. Regeln-first vs. paralleles Ensemble
6. Score-Aggregation
7. Kalibrierverfahren
8. Abstain-Kriterium
9. Abstain-Schwelle
10. Granularitätsentscheidung
11. Umgang mit ObserverHint
12. Umgang mit widersprüchlichen Kanälen
13. Größe und Aufbau des Evaluationssatzes
14. Referenzlabel-Logik bei mehrdeutigen Fällen
15. Umgang mit Out-of-Scope-Eingaben
16. Mindestqualität für AP5-Übergabe
17. Fallback auf schwach überwachte Labelmodelle
18. Darstellung robuster Sensitivitätsbereiche

---

# 51. Rückkopplung an AP1 und AP2

AP3 ist nicht nur Konsument der vorherigen Arbeitspakete.

Fehlerbilder müssen rückwärts wirken können.

## Rückkopplung an AP1

Wenn Klassen regelmäßig nicht trennbar sind:

- Granularität prüfen,
- Definitionen schärfen,
- Klassen aggregieren,
- Evidenzanforderungen ergänzen.

## Rückkopplung an AP2

Wenn für bestimmte Klassen regelmäßig Evidenz fehlt:

- Beobachtungsmerkmale ergänzen,
- Kontextfelder anpassen,
- Memo-Guidance verbessern,
- Erfassungsqualität prüfen.

Damit wird AP3 zu einem zentralen empirischen Prüfpunkt für die Tragfähigkeit von AP1 und AP2.

---

# 52. Status und Quellenbasis

Direkt aus dem Projektplan abgeleitet sind insbesondere:

- AP3 als mehrkanalige unsichere Annotation mit Abstain-Logik,
- Zeitraum Oktober 2026 bis März 2027,
- 875 Stunden Aufwand,
- Eingänge aus AP1 und AP2,
- keine unternehmensspezifischen Trainingsdaten als Voraussetzung,
- Kombination aus Regeln und kontrollierter KI,
- Klassenwahrscheinlichkeiten statt harter Labels,
- Kalibrierung einer Unsicherheits-/Enthaltungslogik,
- probabilistische Evidenz bzw. Abstain als Übergabe an AP5,
- schwach überwachte Labelmodelle bzw. robuste Sensitivitätsmodelle als Fallback.

Die konkrete Pipelinearchitektur, Modelltechnik, Kalibrierverfahren, Evaluationsmetriken, Schwellen, Datenmodelle und Stundenverteilung sind **operative Designvorschläge zur Umsetzung von AP3** und müssen im Arbeitspaket experimentell geprüft, dokumentiert und versioniert entschieden werden.
