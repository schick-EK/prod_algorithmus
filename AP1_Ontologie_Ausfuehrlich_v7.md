# AP1 – Fachontologie des Produktions- und Beobachtungsmodells

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP1 – Formale Modellierung des Produktions- und Beobachtungsmodells  
**Dokumenttyp:** Fachontologie / formale Spezifikation / Übergabegrundlage  
**Version:** 0.7.0 – vertiefter Arbeitsentwurf  
**Zielversion:** 1.0.0  
**Primäre Nachfolger:** AP2, AP3, AP5  
**Status:** fachlich und empirisch zu validieren  
**Leitprinzip:** Unsicherheit, Mehrdeutigkeit und Nicht-Identifizierbarkeit sind zulässige Ergebnisse und dürfen nicht durch die Ontologie künstlich entfernt werden.

---

# 1. Zielbild der Ontologie

Die Ontologie definiert den fachlichen Zustandsraum, auf dem die späteren Beobachtungs-, Annotations-, Fusions- und Entscheidungsstufen aufbauen.

Sie soll nicht nur eine Liste von Begriffen liefern, sondern eine konsistente Fachstruktur, die beantwortet:

- welche Zustände ein Produktionssystem oder eine beobachtete Tätigkeit annehmen kann,
- welche Zustände als Verlust interpretiert werden können,
- welche Ursachen fachlich plausibel sind,
- welche Maßnahmen grundsätzlich zu Ursachen passen,
- welche Evidenz eine Feinunterscheidung stützt,
- welche Kontextinformationen notwendig sind,
- wann eine Klasse nicht ausreichend identifizierbar ist,
- auf welche gröbere Klasse zurückgefallen wird,
- wie historische Analysen trotz Ontologieänderungen reproduzierbar bleiben.

Die Ontologie soll damit die Balance herstellen zwischen:

1. **fachlicher Ausdrucksstärke**
2. **Beobachtbarkeit**
3. **Unsicherheitsfähigkeit**
4. **technischer Nutzbarkeit**

---

# 2. Ontologische Grundannahmen

## 2.1 Beobachtung ist nicht gleich Zustand

Eine Beobachtung bildet nur einen Ausschnitt der Realität ab.

```text
Observation ≠ ProductionState
```

Eine Beobachtung kann daher eindeutig, mehrdeutig, unvollständig, widersprüchlich oder nicht ausreichend informativ sein.

## 2.2 Evidenz ist kein Ground Truth

Direkte Beobachtung, Sprachmemo, MES und ERP werden als Evidenzkanäle behandelt.

```text
Evidence ≠ Ground Truth
```

Auch ein MES-Zustand kann zeitlich falsch zugeordnet, semantisch anders definiert, unvollständig oder technisch fehlerhaft sein.

## 2.3 Zustand, Verlust, Ursache und Maßnahme sind verschiedene Ebenen

```text
ProductionState
      ↓ mayRepresentLoss
LossClass
      ↓ mayHaveCause
CauseClass
      ↓ mayBeAddressedBy
MeasureClass
```

Beispiel:

```text
PS_WAIT_MATERIAL
      ↓
LOSS_FLOW_WAIT
      ↓
CAUSE_LOGISTICS_REPLENISHMENT
      ↓
MEASURE_MATERIAL_LOGISTICS
```

Diese Kette beschreibt fachliche Zulässigkeit, nicht empirisch bewiesene Kausalität oder Wirkung.

---

# 3. Scope der Ontologie

## 3.1 Enthalten

- Produktionszustände
- Unterstützungszustände
- Verlustzustände
- Verlustklassen
- Ursachenklassen
- Maßnahmenklassen
- Evidenztypen
- Kontexttypen
- Provenienz
- Missingness
- Granularitätsstufen
- Relationen
- Constraints
- Fallbacks
- Versionierung
- Governance

## 3.2 Nicht enthalten

- Wahrscheinlichkeitsmodell
- Bayes-Fusion
- KPI-Berechnung
- Maßnahmenwirkung
- Maßnahmenpriorisierung
- statistische Schwellenwerte
- finale branchenspezifische Erweiterungen

---

# 4. Kompetenzfragen

Die Ontologie muss mindestens folgende Fragen beantworten können.

## 4.1 Zustände

1. Welche ProductionState-Klassen existieren?
2. Welche Klasse ist Parent einer gegebenen Klasse?
3. Welche Unterklassen existieren?
4. Welche Granularitätsstufe besitzt eine Klasse?
5. Welche Fallbackklasse gilt?
6. Welche Klassen sind deprecated oder aggregiert?

## 4.2 Evidenz

7. Welche Evidenztypen unterstützen eine Klasse?
8. Welche Evidenztypen sind notwendig?
9. Welche Evidenz fehlt?
10. Wie gut ist die zeitliche Zuordnung?
11. Wie zuverlässig ist die Quelle?
12. Wie eindeutig ist die Evidenz semantisch?

## 4.3 Kontext

13. Welcher Standort ist betroffen?
14. Welcher Bereich bzw. welches Workcenter?
15. Welche Maschine?
16. Welcher Auftrag?
17. Welches Produkt bzw. welche Variante?
18. Welcher Prozessschritt?
19. Welche Schicht?
20. Welcher Samplingkontext?

## 4.4 Semantische Konsistenz

21. Welche Klassen sind disjunkt?
22. Welche Klassen können gleichzeitig Kandidaten sein?
23. Welche LossClasses passen zu einem Zustand?
24. Welche CauseClasses sind fachlich möglich?
25. Welche MeasureClasses sind grundsätzlich passend?

## 4.5 Unsicherheit

26. Wann muss auf eine Oberklasse zurückgefallen werden?
27. Wann ist `PS_UNKNOWN` erforderlich?
28. Welche Klassen sind nicht identifizierbar?
29. Welche Klassen wurden aufgrund fehlender Trennschärfe aggregiert?
30. Welche Klassen sind nur unter zusätzlichen Evidenzbedingungen zulässig?

## 4.6 Reproduzierbarkeit

31. Welche Ontologieversion wurde verwendet?
32. Wann wurde eine Klasse eingeführt?
33. Wann wurde sie geändert?
34. Wann wurde sie deprecated?
35. Welche Beobachtungen sind von einer Änderung betroffen?

---

# 5. Entitätstypen

| Entität | Bedeutung |
|---|---|
| `Observation` | konkrete Beobachtung |
| `ProductionState` | fachlich möglicher Produktionszustand |
| `LossClass` | Verlustkategorie |
| `CauseClass` | mögliche Ursache |
| `MeasureClass` | mögliche Maßnahme |
| `Evidence` | konkrete Evidenzinstanz |
| `EvidenceType` | Evidenztyp |
| `Context` | Kontextinstanz |
| `ContextType` | Kontexttyp |
| `Constraint` | formale Regel |
| `Provenance` | Herkunft und Transformation |
| `GranularityLevel` | G0–G3 |
| `OntologyDecision` | dokumentierte Ontologieentscheidung |

---

# 6. ID- und Namenskonventionen

| Präfix | Bedeutung |
|---|---|
| `OBS_` | Observation |
| `PS_` | ProductionState |
| `LOSS_` | LossClass |
| `CAUSE_` | CauseClass |
| `MEASURE_` | MeasureClass |
| `EV_` | EvidenceType |
| `CTX_` | ContextType |
| `CON_` | Constraint |
| `DEC_` | OntologyDecision |

IDs müssen stabil, eindeutig, sprachunabhängig, nicht wiederverwendbar, maschinenlesbar und versionsübergreifend referenzierbar sein.

---

# 7. Pflichtattribute einer Klasse

| Attribut | Pflicht | Beschreibung |
|---|---:|---|
| `id` | ja | stabile ID |
| `type` | ja | Entitätstyp |
| `label_de` | ja | deutsche Bezeichnung |
| `definition` | ja | normative Definition |
| `parent` | falls vorhanden | direkte Oberklasse |
| `granularity` | ja | G0–G3 |
| `status` | ja | Lebenszyklusstatus |
| `fallback_to` | G2/G3 | gröbere Klasse |
| `positive_examples` | kritisch | Positivbeispiele |
| `negative_examples` | kritisch | Abgrenzungsbeispiele |
| `possible_losses` | optional | mögliche Verlustklassen |
| `possible_causes` | optional | mögliche Ursachen |
| `useful_evidence` | optional | hilfreiche Evidenz |
| `required_evidence` | optional | zwingende Evidenz |
| `required_context` | optional | notwendiger Kontext |
| `disjoint_with` | optional | disjunkte Klassen |
| `status_reason` | bei nicht accepted | Begründung |
| `introduced_in_version` | ja | Einführung |
| `deprecated_in_version` | optional | Ablösung |

---

# 8. Granularitätsmodell

## G0 – Nicht identifizierbar
Keine ausreichend belastbare Zuordnung. Klasse: `PS_UNKNOWN`.

## G1 – Hauptzustandsfamilie
- `PS_PRODUCTIVE`
- `PS_NECESSARY_SUPPORT`
- `PS_LOSS`
- `PS_UNKNOWN`

## G2 – fachliche Hauptklasse
Beispiele: Rüsten, Prüfen, Warten, Störung, Nacharbeit, ungeplante Instandhaltung, Leistungsabweichung.

## G3 – Feinklasse
Beispiele: Warten auf Material, Maschinenstörung, Reparatur, Mikrostopp, Materialsuche.

---

# 9. Fallback-Prinzip

```text
PS_WAIT_MATERIAL
     ↓
PS_WAITING
     ↓
PS_LOSS
     ↓
PS_UNKNOWN
```

Regeln:

1. jede G3-Klasse → G2-Fallback
2. jede G2-Klasse → G1-Fallback
3. `PS_UNKNOWN` = globaler letzter Fallback
4. keine Zyklen
5. Fallback reduziert nur Granularität
6. kein Fallback darf Ursache und Zustand vermischen

---

# 10. ProductionState – Kernhierarchie

```text
ProductionState
│
├── PS_UNKNOWN
│
├── PS_PRODUCTIVE
│
├── PS_NECESSARY_SUPPORT
│   ├── PS_SETUP
│   │   ├── PS_SETUP_TOOL_CHANGE
│   │   ├── PS_SETUP_FORMAT_CHANGE
│   │   └── PS_SETUP_PARAMETERIZATION
│   ├── PS_INSPECTION
│   │   ├── PS_INSPECTION_PRODUCT
│   │   ├── PS_INSPECTION_PROCESS
│   │   └── PS_INSPECTION_EQUIPMENT
│   ├── PS_NECESSARY_TRANSPORT
│   ├── PS_PLANNED_MAINTENANCE
│   ├── PS_PLANNED_CLEANING
│   └── PS_PLANNED_SUPPORT
│
└── PS_LOSS
    ├── PS_WAITING
    │   ├── PS_WAIT_MATERIAL
    │   ├── PS_WAIT_INFORMATION
    │   ├── PS_WAIT_MACHINE
    │   ├── PS_WAIT_PERSONNEL
    │   ├── PS_WAIT_PREVIOUS_PROCESS
    │   └── PS_WAIT_QUALITY_RELEASE
    ├── PS_DISTURBANCE
    │   ├── PS_DISTURB_MACHINE
    │   ├── PS_DISTURB_PROCESS
    │   ├── PS_DISTURB_SAFETY
    │   ├── PS_DISTURB_ENERGY
    │   └── PS_DISTURB_IT_SYSTEM
    ├── PS_REWORK
    │   ├── PS_REWORK_INTERNAL
    │   ├── PS_REWORK_EXTERNAL
    │   └── PS_REWORK_UNKNOWN_ORIGIN
    ├── PS_UNPLANNED_MAINTENANCE
    │   ├── PS_MAINT_DIAGNOSIS
    │   ├── PS_MAINT_REPAIR
    │   └── PS_MAINT_TEST_RESTART
    ├── PS_PERFORMANCE_DEVIATION
    │   ├── PS_REDUCED_SPEED
    │   ├── PS_MICROSTOP
    │   └── PS_UNSTABLE_CYCLE
    ├── PS_UNNECESSARY_MOTION
    ├── PS_UNNECESSARY_TRANSPORT
    └── PS_SEARCHING
        ├── PS_SEARCH_MATERIAL
        ├── PS_SEARCH_TOOL
        ├── PS_SEARCH_INFORMATION
        └── PS_SEARCH_PERSON
```

---

# 11. Normative Definitionen der G1-Klassen

## PS_UNKNOWN
**Definition:** Der tatsächliche Zustand kann mit der verfügbaren Evidenz nicht ausreichend bestimmt werden.  
**Status:** accepted.  
**Fallback:** keiner.

## PS_PRODUCTIVE
**Definition:** Unmittelbar produktive Tätigkeit entsprechend dem fachlich definierten Sollprozess.  
**Positive Beispiele:** Bearbeiten, Montieren, Fügen.  
**Negative Beispiele:** Warten, Nacharbeit, Reparatur, Suchen.

## PS_NECESSARY_SUPPORT
**Definition:** Notwendige unterstützende Tätigkeit, die nicht als unmittelbarer produktiver Kernschritt gilt.

## PS_LOSS
**Definition:** Zustand, in dem Zeit, Leistung, Qualität oder Ressourcen gegenüber einem definierten Referenzzustand nicht wie vorgesehen genutzt werden.

---

# 12. G2/G3 – Rüsten

## PS_SETUP
**Definition:** Geplante Umstellung eines Betriebsmittels, Arbeitsplatzes oder Prozesses von einem gültigen Sollzustand in einen anderen.

### PS_SETUP_TOOL_CHANGE
Werkzeugwechsel.

### PS_SETUP_FORMAT_CHANGE
Produkt-, Format- oder Variantenwechsel.

### PS_SETUP_PARAMETERIZATION
Parametrierung, Programmeinstellung oder Sollwertanpassung.

**Abgrenzung:** geplant → Rüsten; ungeplant nach Fehler → Instandhaltung.

---

# 13. G2/G3 – Prüfen

## PS_INSPECTION
**Definition:** Geplante Feststellung, ob Produkt, Prozess oder Betriebsmittel definierte Anforderungen erfüllt.

### PS_INSPECTION_PRODUCT
Produkt-/Bauteilprüfung.

### PS_INSPECTION_PROCESS
Prüfung von Prozesszuständen oder Parametern.

### PS_INSPECTION_EQUIPMENT
Prüfung von Maschinen/Betriebsmitteln.

---

# 14. Weitere notwendige Unterstützung

## PS_NECESSARY_TRANSPORT
Transport als Bestandteil des Sollprozesses.

## PS_PLANNED_MAINTENANCE
Geplante Wartung/Instandhaltung.

## PS_PLANNED_CLEANING
Geplante Reinigung als regulärer Prozessbestandteil.

## PS_PLANNED_SUPPORT
Sonstige geplante notwendige Unterstützung.

---

# 15. G2/G3 – Warten

## PS_WAITING
**Definition:** Der Sollprozess kann nicht fortgeführt werden, weil eine notwendige Voraussetzung fehlt.

### PS_WAIT_MATERIAL
**Definition:** Material, Bauteil oder Hilfsstoff ist nicht verfügbar.

**Positive Beispiele:**
- Materialbehälter leer
- Bauteil fehlt
- vorgelagerte Materialbereitstellung nicht erfolgt

**Negative Beispiele:**
- Material vorhanden, wird aber gesucht
- Maschine technisch gestört
- Information fehlt

**Mögliche Ursachen:**
- `CAUSE_MATERIAL_NOT_AVAILABLE`
- `CAUSE_LOGISTICS_REPLENISHMENT`
- `CAUSE_PLANNING_SEQUENCE`

**Hilfreiche Evidenz:**
- `EV_OBSERVATION`
- `EV_MEMO`
- `EV_ERP`

**Fallback:** `PS_WAITING`

### PS_WAIT_INFORMATION
Notwendige Information, Freigabe, Zeichnung oder Entscheidung fehlt.

### PS_WAIT_MACHINE
Maschine/Anlage ist nicht verfügbar oder nicht betriebsbereit.

### PS_WAIT_PERSONNEL
Benötigte Person oder Rolle ist nicht verfügbar.

### PS_WAIT_PREVIOUS_PROCESS
Vorgelagerter Prozessschritt ist noch nicht abgeschlossen.

### PS_WAIT_QUALITY_RELEASE
Qualitäts-/Prüffreigabe fehlt.

---

# 16. G2/G3 – Störung

## PS_DISTURBANCE
**Definition:** Ungeplante Unterbrechung oder erhebliche Beeinträchtigung des Sollprozesses.

### PS_DISTURB_MACHINE
Technischer Fehler an Maschine, Anlage oder Werkzeug.

### PS_DISTURB_PROCESS
Prozessbezogene Störung ohne primären technischen Defekt.

### PS_DISTURB_SAFETY
Sicherheitsbedingte Unterbrechung.

### PS_DISTURB_ENERGY
Unterbrechung aufgrund Energieversorgung.

### PS_DISTURB_IT_SYSTEM
Unterbrechung durch IT-, Steuerungs- oder Kommunikationssystem.

---

# 17. G2/G3 – Nacharbeit

## PS_REWORK
**Definition:** Zusätzliche Bearbeitung aufgrund eines bereits entstandenen Fehlers.

### PS_REWORK_INTERNAL
Fehlerursprung im betrachteten Prozess.

### PS_REWORK_EXTERNAL
Fehlerursprung vorgelagert/extern.

### PS_REWORK_UNKNOWN_ORIGIN
Fehlerursprung unklar.

---

# 18. G2/G3 – ungeplante Instandhaltung

## PS_UNPLANNED_MAINTENANCE
**Definition:** Ungeplante Tätigkeit zur Wiederherstellung der technischen Funktionsfähigkeit.

### PS_MAINT_DIAGNOSIS
Fehlersuche/Diagnose.

### PS_MAINT_REPAIR
Aktive Reparatur.

### PS_MAINT_TEST_RESTART
Funktionsprüfung/Wiederanlauf.

**Typische Sequenz:**

```text
PS_DISTURB_MACHINE
→ PS_MAINT_DIAGNOSIS
→ PS_MAINT_REPAIR
→ PS_MAINT_TEST_RESTART
```

---

# 19. G2/G3 – Leistungsabweichung

## PS_PERFORMANCE_DEVIATION
Produktion läuft, aber unter erwartetem Leistungsniveau.

### PS_REDUCED_SPEED
Reduzierte Prozessgeschwindigkeit.

### PS_MICROSTOP
Kurze ungeplante Unterbrechung.

### PS_UNSTABLE_CYCLE
Schwankende oder instabile Zykluszeit.

**Hinweis:** quantitative Grenzwerte sind nicht Bestandteil von AP1.

---

# 20. Bewegung, Transport und Suchen

## PS_UNNECESSARY_MOTION
Nicht notwendige Bewegung einer Person.

## PS_UNNECESSARY_TRANSPORT
Nicht notwendiger Material-, Produkt- oder Werkzeugtransport.

## PS_SEARCHING
Aktive Suche nach benötigter Ressource.

### PS_SEARCH_MATERIAL
Suche nach Material.

### PS_SEARCH_TOOL
Suche nach Werkzeug.

### PS_SEARCH_INFORMATION
Suche nach Information/Dokumentation.

### PS_SEARCH_PERSON
Suche nach zuständiger Person.

---

# 21. LossClass – Verlustontologie

```text
LossClass
├── LOSS_AVAILABILITY
├── LOSS_PERFORMANCE
├── LOSS_QUALITY
├── LOSS_FLOW_WAIT
├── LOSS_CHANGEOVER
├── LOSS_MOTION
├── LOSS_TRANSPORT
├── LOSS_SEARCH
├── LOSS_INFORMATION
└── LOSS_UNKNOWN
```

**Definitionen:**

- `LOSS_AVAILABILITY` – Verlust durch fehlende Verfügbarkeit
- `LOSS_PERFORMANCE` – Verlust durch reduzierte Leistung
- `LOSS_QUALITY` – Verlust durch Fehler/Nacharbeit/Ausschuss
- `LOSS_FLOW_WAIT` – Verlust durch Unterbrechung des Flusses
- `LOSS_CHANGEOVER` – Verlust durch Umstellung/Wechsel
- `LOSS_MOTION` – Verlust durch unnötige Bewegung
- `LOSS_TRANSPORT` – Verlust durch unnötigen Transport
- `LOSS_SEARCH` – Verlust durch Suchaktivität
- `LOSS_INFORMATION` – Verlust durch fehlende/verspätete Information
- `LOSS_UNKNOWN` – Verlust vorhanden, Typ unklar

---

# 22. CauseClass – Ursachenontologie

```text
CauseClass
├── CAUSE_EQUIPMENT
│   ├── CAUSE_MACHINE_FAILURE
│   ├── CAUSE_TOOL_WEAR
│   ├── CAUSE_SENSOR_FAILURE
│   └── CAUSE_CONTROL_FAILURE
├── CAUSE_MATERIAL
│   ├── CAUSE_MATERIAL_NOT_AVAILABLE
│   ├── CAUSE_MATERIAL_DEFECT
│   └── CAUSE_MATERIAL_WRONG
├── CAUSE_METHOD_PROCESS
│   ├── CAUSE_STANDARD_INADEQUATE
│   ├── CAUSE_PROCESS_UNSTABLE
│   ├── CAUSE_SEQUENCE_INADEQUATE
│   └── CAUSE_PROCESS_STEP_UNNECESSARY
├── CAUSE_PLANNING_INFORMATION
│   ├── CAUSE_INFORMATION_MISSING
│   ├── CAUSE_APPROVAL_MISSING
│   ├── CAUSE_PLANNING_SEQUENCE
│   └── CAUSE_PRIORITY_UNCLEAR
├── CAUSE_LOGISTICS
│   ├── CAUSE_LOGISTICS_REPLENISHMENT
│   ├── CAUSE_LOGISTICS_LOCATION
│   └── CAUSE_LOGISTICS_TRANSPORT
├── CAUSE_ORGANIZATION_PERSONNEL
│   ├── CAUSE_PERSON_NOT_AVAILABLE
│   ├── CAUSE_QUALIFICATION
│   ├── CAUSE_RESPONSIBILITY_UNCLEAR
│   └── CAUSE_STAFFING_PLAN
├── CAUSE_LAYOUT
├── CAUSE_EXTERNAL
└── CAUSE_UNKNOWN
```

---

# 23. MeasureClass – Maßnahmenontologie

```text
MeasureClass
├── MEASURE_MAINTENANCE
├── MEASURE_PROCESS_STANDARDIZATION
├── MEASURE_MATERIAL_LOGISTICS
├── MEASURE_PLANNING_CONTROL
├── MEASURE_QUALITY_ASSURANCE
├── MEASURE_TRAINING
├── MEASURE_WORK_ORGANIZATION
├── MEASURE_LAYOUT_FLOW
├── MEASURE_AUTOMATION
├── MEASURE_DATA_MONITORING
└── MEASURE_INFORMATION_COLLECTION
```

`MEASURE_INFORMATION_COLLECTION` repräsentiert gezielte zusätzliche Evidenzerhebung als legitime Handlungsoption.

---

# 24. EvidenceType

```text
EvidenceType
├── EV_OBSERVATION
├── EV_MEMO
├── EV_MES
├── EV_ERP
└── EV_DERIVED
```

---

# 25. Evidenzqualität

| Dimension | Wertebeispiele | Bedeutung |
|---|---|---|
| `availability` | present/missing | vorhanden? |
| `completeness` | full/partial | vollständig? |
| `temporal_alignment` | high/medium/low | zeitliche Passung |
| `source_reliability` | high/medium/low | Quellenverlässlichkeit |
| `semantic_clarity` | high/medium/low | Eindeutigkeit |
| `linkage_quality` | high/medium/low | Qualität der Zuordnung |
| `observation_quality` | high/medium/low | Beobachtungsqualität |

---

# 26. ContextType

```text
ContextType
├── CTX_SITE
├── CTX_AREA
├── CTX_LINE
├── CTX_WORKCENTER
├── CTX_MACHINE
├── CTX_ORDER
├── CTX_PRODUCT
├── CTX_VARIANT
├── CTX_PROCESS_STEP
├── CTX_SHIFT
├── CTX_OPERATOR_ROLE
├── CTX_TIME
├── CTX_SAMPLING_STRATUM
└── CTX_SAMPLING_CLUSTER
```

---

# 27. Zeitmodell

Jede Observation besitzt mindestens einen Zeitpunkt oder ein Beobachtungsintervall.

Beispiel:

```yaml
temporal_reference:
  event_time: 2026-08-26T10:48:00+02:00
  uncertainty_seconds: 15
```

Zeitliche Unsicherheit darf explizit modelliert werden.

---

# 28. Provenienzmodell

```yaml
provenance:
  source_type: EV_MES
  source_system: MES_A
  source_record_id: EVENT_12345
  captured_at: 2026-08-26T10:48:00+02:00
  transformations:
    - timestamp_normalization
    - status_mapping
  ontology_version: 0.7.0
```

---

# 29. Missingness-Modell

| Status | Bedeutung |
|---|---|
| `present` | Evidenz vorhanden |
| `missing_expected` | erwartet, fehlt |
| `missing_not_applicable` | nicht anwendbar |
| `missing_not_collected` | nicht erhoben |
| `missing_linkage_failed` | Verknüpfung fehlgeschlagen |
| `missing_unknown_reason` | Grund unbekannt |

Grundsatz:

```text
missing ≠ false
missing ≠ no_event
```

---

# 30. Relationenkatalog

| Relation | Domain | Range | Bedeutung |
|---|---|---|---|
| `subClassOf` | Klasse | gleiche Klassenfamilie | Hierarchie |
| `fallbackTo` | ProductionState | ProductionState | Rückfall |
| `mayRepresentLoss` | ProductionState | LossClass | möglicher Verlust |
| `mayHaveCause` | State/Loss | CauseClass | mögliche Ursache |
| `mayBeAddressedBy` | CauseClass | MeasureClass | mögliche Maßnahme |
| `usefulEvidence` | Klasse | EvidenceType | hilfreiche Evidenz |
| `requiresEvidence` | Klasse | EvidenceType | erforderliche Evidenz |
| `requiresContext` | Klasse | ContextType | notwendiger Kontext |
| `incompatibleWith` | Klasse | Klasse | Unvereinbarkeit |
| `temporallyPrecedes` | ProductionState | ProductionState | zeitliche Folge |
| `hasEvidence` | Observation | Evidence | Evidenzzuordnung |
| `occursInContext` | Observation/State | Context | Kontextbezug |
| `usesOntologyVersion` | Observation | Version | Reproduzierbarkeit |

---

# 31. Kardinalitäten

## Observation
- genau 1 ID
- mindestens 1 Zeitbezug
- genau 1 Ontologieversion
- 0..n Evidenzen
- 0..n Kandidatenklassen
- 0..n Kontextinstanzen

## ProductionState
- genau 1 stabile ID
- genau 1 Granularitätsstufe
- 0..1 direkter Parent
- mindestens 1 Fallback bei G2/G3

## Evidence
- genau 1 EvidenceType
- genau 1 Provenienz
- mindestens 1 Zeitbezug oder dokumentierte zeitliche Unsicherheit

---

# 32. Disjunktheitsregeln

Für denselben Beobachtungsgegenstand und Zeitpunkt können beispielsweise gelten:

```text
PS_PRODUCTIVE ⊥ PS_WAITING
PS_PRODUCTIVE ⊥ PS_REWORK
PS_SETUP ⊥ PS_UNPLANNED_MAINTENANCE
PS_NECESSARY_TRANSPORT ⊥ PS_UNNECESSARY_TRANSPORT
```

Diese Regeln gelten nur für dieselbe semantische Beobachtungseinheit.

---

# 33. Constraint-Katalog

- **CON-001:** `PS_UNKNOWN` ist immer zulässig.
- **CON-002:** Keine G3-Klasse darf zwingend gewählt werden.
- **CON-003:** Jede G3-Klasse benötigt einen Fallback.
- **CON-004:** `subClassOf` und `fallbackTo` sind zyklusfrei.
- **CON-005:** ProductionState, LossClass, CauseClass und MeasureClass bleiben getrennt.
- **CON-006:** Jede Evidenz benötigt Provenienz.
- **CON-007:** Missingness wird explizit modelliert.
- **CON-008:** Missingness ist kein negatives Signal.
- **CON-009:** Konfligierende Evidenz bleibt erhalten.
- **CON-010:** Jede Observation besitzt Zeitbezug.
- **CON-011:** `requiresContext` begrenzt zulässige Feininterpretation.
- **CON-012:** Bei gleich plausiblen G3-Kandidaten bleibt der gemeinsame G2-Parent zulässig.
- **CON-013:** `mayHaveCause` ist keine Kausalitätsaussage.
- **CON-014:** `mayBeAddressedBy` ist keine Wirkungsgarantie.
- **CON-015:** Freigegebene IDs werden nicht wiederverwendet.
- **CON-016:** Historische Beobachtungen bleiben mit alter Ontologieversion reproduzierbar.
- **CON-017:** Deprecated Klassen werden nicht für neue Beobachtungen verwendet.
- **CON-018:** Aggregierte Klassen verweisen auf ihre Nachfolgeklasse.
- **CON-019:** Fehlende Evidenz darf nicht automatisch zum Ausschluss einer Klasse führen, sofern sie nicht als `requiredEvidence` definiert ist.
- **CON-020:** Ein Klassenwechsel über die Zeit ist als Zustandssequenz und nicht als Mehrfachlabel derselben Zeitinstanz zu modellieren.

---

# 34. Kritische Abgrenzungen

## Warten vs. Suchen
**Warten:** Ressource fehlt; keine aktive Suchhandlung.  
**Suchen:** aktive Suche.

## Störung vs. Instandhaltung
**Störung:** Ausfallzustand.  
**Instandhaltung:** Diagnose/Reparatur/Wiederherstellung.

## notwendiger vs. unnötiger Transport
**Notwendig:** Teil des Sollprozesses.  
**Unnötig:** vermeidbar.

## Rüsten vs. Reparatur
**Rüsten:** geplante Umstellung.  
**Reparatur:** ungeplante Wiederherstellung.

## Nacharbeit vs. normale Bearbeitung
**Nacharbeit:** zusätzliche Bearbeitung aufgrund vorherigem Fehler.  
**Normal:** regulärer Sollprozess.

## Warten auf Material vs. Warten auf Vorprozess
**Material:** physische Ressource fehlt.  
**Vorprozess:** Prozessabhängigkeit noch nicht erfüllt.

---

# 35. Ursache–Zustand–Maßnahme-Matrix

| Zustand | Verlust | mögliche Ursachen | mögliche Maßnahmen |
|---|---|---|---|
| PS_WAIT_MATERIAL | LOSS_FLOW_WAIT | Material, Logistik, Planung | Materiallogistik, Planung |
| PS_WAIT_INFORMATION | LOSS_INFORMATION | Information, Organisation | Planung, Arbeitsorganisation |
| PS_WAIT_MACHINE | LOSS_AVAILABILITY | Equipment, Planung | Instandhaltung, Planung |
| PS_DISTURB_MACHINE | LOSS_AVAILABILITY | Equipment | Instandhaltung |
| PS_DISTURB_PROCESS | LOSS_FLOW_WAIT | Prozess, Material | Standardisierung, Qualität |
| PS_REWORK | LOSS_QUALITY | Prozess, Material, Inputqualität | Qualitätssicherung, Standardisierung |
| PS_SEARCH_MATERIAL | LOSS_SEARCH | Logistik, Layout | Logistik, Layout |
| PS_UNNECESSARY_MOTION | LOSS_MOTION | Layout, Methode | Layout, Standardisierung |
| PS_PERFORMANCE_DEVIATION | LOSS_PERFORMANCE | Equipment, Prozess, Personal | Instandhaltung, Standardisierung, Training |

---

# 36. Granularitätsprüfung

Jede G3-Klasse wird bewertet auf:

1. Beobachtbarkeit
2. semantische Trennschärfe
3. Zusatz-Evidenz
4. Sparsity-Robustheit
5. erwartbare Häufigkeit
6. fachliche Relevanz
7. Definitionsstabilität
8. Fallback-Fähigkeit
9. Datenverknüpfbarkeit
10. spätere Entscheidungsrelevanz

## Statuswerte

- `draft`
- `candidate`
- `accepted`
- `accepted_with_constraints`
- `aggregated`
- `rejected`
- `deprecated`

## Freigabebedingungen

Eine G3-Klasse wird nur freigegeben, wenn:

- Definition eindeutig
- Parent vorhanden
- Fallback vorhanden
- Abgrenzung dokumentiert
- mindestens ein plausibler Evidenzpfad vorhanden
- fachliche Relevanz gegeben
- Testfälle keine systematische Untrennbarkeit zeigen

---

# 37. Klassensteckbrief – Standard

```yaml
id: PS_WAIT_MATERIAL
type: ProductionState
label_de: Warten auf Material
granularity: G3
parent: PS_WAITING
fallback_to: PS_WAITING
status: candidate

definition: >
  Zustand, in dem eine vorgesehene Aktivität nicht fortgeführt
  werden kann, weil benötigtes Material, Bauteil oder Hilfsmittel
  nicht verfügbar ist.

positive_examples:
  - Materialbehälter leer.
  - Bauteil wurde noch nicht bereitgestellt.

negative_examples:
  - Mitarbeiter sucht vorhandenes Material.
  - Maschine ist technisch gestört.
  - Freigabeinformation fehlt.

possible_losses:
  - LOSS_FLOW_WAIT

possible_causes:
  - CAUSE_MATERIAL_NOT_AVAILABLE
  - CAUSE_LOGISTICS_REPLENISHMENT
  - CAUSE_PLANNING_SEQUENCE

useful_evidence:
  - EV_OBSERVATION
  - EV_MEMO
  - EV_ERP

required_context:
  - CTX_PROCESS_STEP

introduced_in_version: 0.7.0
```

---

# 38. Beobachtungsinstanz – Beispiel

```yaml
observation_id: OBS_2026_000184
observed_at: 2026-08-26T10:48:00+02:00
ontology_version: 0.7.0

context:
  workcenter_id: WC_12
  process_step: ASSEMBLY_04
  order_id: ORDER_4711

evidence:
  - type: EV_OBSERVATION
    structured_status:
      - machine_stopped
      - operator_waiting
    observation_quality: medium

  - type: EV_MEMO
    text: "Material für den Auftrag ist noch nicht da."

candidate_classes:
  - PS_WAIT_MATERIAL
  - PS_WAITING
```

---

# 39. Grenzfälle

## Person steht neben laufender Maschine
Mögliche Klassen: produktive Überwachung, Prüfen, Warten.

## Person läuft zum Materiallager
Mögliche Klassen: notwendiger Transport, Materialsuche, unnötige Bewegung.

## Maschine stoppt wenige Sekunden
Mögliche Klassen: Mikrostopp, regulärer Prozesszustand, kurze Störung.

## Prüfung gefolgt von Korrektur
Zeitlich getrennt:

```text
PS_INSPECTION_PRODUCT
→ PS_REWORK
```

---

# 40. Testfälle

## T-01
Maschine steht, Person wartet, Grund unbekannt.  
**Erwartung:** `PS_WAITING` oder `PS_UNKNOWN`.

## T-02
Memo: „Material fehlt.“  
**Erwartung:** `PS_WAIT_MATERIAL` plausibel.

## T-03
MES-Fehlercode, danach Reparatur.  
**Erwartung:** `PS_DISTURB_MACHINE` → `PS_MAINT_REPAIR`.

## T-04
Materialtransport ohne Kontext.  
**Erwartung:** notwendiger und unnötiger Transport bleiben Kandidaten.

## T-05
Beobachtung sagt Stillstand, MES sagt Betrieb.  
**Erwartung:** Konflikt bleibt erhalten.

---

# 41. Validierung

## Strukturell
- eindeutige IDs
- keine Zyklen
- gültige Parents
- gültige Fallbacks
- keine verwaisten Klassen

## Fachlich
- eindeutige Definition
- plausible Beispiele
- konsistente Abgrenzungen
- keine Ebenenvermischung

## Beobachtungsbezogen
- realistisch beobachtbar?
- Mehrdeutigkeit erhalten?
- Fallback funktionsfähig?
- Granularität tragfähig?

## Technisch
- YAML/JSON gültig
- Referenzen gültig
- Pflichtfelder vollständig
- Versionsinformationen korrekt

---

# 42. Governance

Jede Änderung wird als `OntologyDecision` dokumentiert.

```yaml
decision_id: DEC_0042
change_type: aggregate_class
affected_classes:
  - PS_WAIT_INFORMATION
reason: >
  In Pilotfällen nicht ausreichend trennbar von PS_WAITING.
decision: aggregate
target_class: PS_WAITING
target_version: 0.8.0
```

---

# 43. Versionierung

## MAJOR
Inkompatible semantische Änderung.

## MINOR
Kompatible Erweiterung.

## PATCH
Dokumentationsänderung.

Beispiel:

```text
0.7.0 vertiefter Arbeitsentwurf
0.8.0 nach Granularitätsreview
0.9.0 nach Pilotbeobachtungen
1.0.0 freigegebene AP1-Ontologie
```

---

# 44. Branchenspezifische Erweiterbarkeit

Die Kernontologie bleibt generisch.

```text
core/
  PS_DISTURBANCE

extensions/automotive/
  PS_DISTURB_ANDON

extensions/process_industry/
  PS_DISTURB_CIP
```

Erweiterungen dürfen neue Klassen ergänzen und Kernklassen spezialisieren. Sie dürfen Kernklassen nicht umdefinieren, IDs nicht überschreiben und Kernconstraints nicht verletzen.

---

# 45. Offene Designentscheidungen vor v1.0

1. Soll `PS_PRODUCTIVE` feiner untergliedert werden?
2. Wie werden geplante Pausen behandelt?
3. Wie werden persönliche Unterbrechungen behandelt?
4. Bleibt `PS_MICROSTOP` eigene Klasse?
5. Wie wird Mikrostopp quantitativ von Störung abgegrenzt?
6. Welche G3-Klassen benötigen MES?
7. Welche G3-Klassen benötigen ERP?
8. Welche Klassen gehören in die Kernontologie?
9. Welche Klassen werden branchenspezifisch?
10. Welche Mindestzahl an Testfällen ist für G3-Freigabe nötig?
11. Wie werden historische Daten bei Aggregation migriert?
12. Wie werden deprecated Klassen in Altanalysen behandelt?
13. Welche LossClasses werden später tatsächlich genutzt?
14. Welche CauseClasses sind zu fein?
15. Welche Relationen sollen maschinenlogisch validiert werden?

---

# 46. Definition of Done für Ontologie v1.0

- [ ] stabile IDs
- [ ] normative Definitionen
- [ ] vollständige Parent-Beziehungen
- [ ] vollständige Fallback-Beziehungen
- [ ] keine Zyklen
- [ ] `PS_UNKNOWN` global zulässig
- [ ] getrennte Loss-, Cause- und Measure-Ontologie
- [ ] EvidenceType definiert
- [ ] ContextType definiert
- [ ] Evidenzqualitätsmodell definiert
- [ ] Zeitmodell definiert
- [ ] Provenienzmodell definiert
- [ ] Missingness-Modell definiert
- [ ] Relationen mit Domain/Range definiert
- [ ] Kardinalitäten dokumentiert
- [ ] Disjunktheitsregeln dokumentiert
- [ ] Constraint-Katalog vollständig
- [ ] kritische Abgrenzungen dokumentiert
- [ ] Granularitätsprüfung abgeschlossen
- [ ] nicht trennbare Klassen aggregiert/markiert
- [ ] Testfälle dokumentiert
- [ ] strukturelle Validierung bestanden
- [ ] fachlicher Review abgeschlossen
- [ ] technische Schema-Validierung bestanden
- [ ] Versionierung definiert
- [ ] Governance definiert
- [ ] Übergabe an AP2/AP3 dokumentiert

---

# 47. Übergabe an AP2

AP2 erhält:

- stabile IDs
- Beobachtungsfelder
- Kontexttypen
- Evidenzreferenzen
- Missingness-Status
- Zeitmodell
- Ontologieversion

AP2 darf keine Feinklasse erzwingen.

---

# 48. Übergabe an AP3

AP3 erhält:

```text
Klassenraum
+ Hierarchie
+ Fallbacks
+ Disjunktheiten
+ Constraints
+ Evidenztypen
+ Kontextbedingungen
+ Positiv-/Negativbeispiele
+ Ontologieversion
```

AP3 erzeugt daraus:

```text
P(Klasse | Evidenz)
oder
Abstain
```

---

# 49. Vorwirkung auf AP5

AP5 benötigt:

- stabilen Zustandsraum
- stabile IDs
- konsistente Hierarchie
- dokumentierte Fallbacks
- eindeutige Ontologieversion
- klare Trennung Zustand/Evidenz
- klare Trennung Zustand/Ursache
- reproduzierbare Änderungen

---

# 50. Ergebnisbild

Die Zielontologie ist eine **fachlich belastbare, formal konsistente, beobachtungsnahe, versionierbare und unsicherheitsfähige Ontologie**.

Sie soll nur Unterscheidungen enthalten, die:

1. fachlich relevant,
2. semantisch eindeutig,
3. beobachtbar oder evidenzgestützt,
4. bei Unsicherheit rückfallfähig,
5. technisch referenzierbar

sind.

Der entscheidende Qualitätsmaßstab bleibt:

> **Kann jede modellierte Unterscheidung mit den vorgesehenen Evidenzkanälen fachlich begründet, beobachtet und bei unzureichender Evidenz sauber auf eine gröbere Ebene zurückgeführt werden?**

---

# 51. Status und Quellenbasis

Diese Ausarbeitung konkretisiert die in AP1 vorgesehenen Inhalte:

- ontologisches Fachmodell,
- Aktivitäts-, Verlust-, Ursachen- und Maßnahmenklassen,
- Relationen und Constraints,
- Beobachtungsschema,
- Granularitätsanalyse,
- formale Grundlage für nachfolgende Annotation.

Die konkrete Klassenstruktur, IDs, Unterklassen, Disjunktheitsregeln, Missingness-Status, Governance-Regeln und maschinenlesbaren Vorschläge sind **operative Arbeitsentwürfe** und müssen innerhalb von AP1 anhand realer bzw. kontrollierter Beobachtungsfälle geprüft, angepasst und versioniert freigegeben werden.
