# AP1 – Fachontologie des Produktions- und Beobachtungsmodells

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP1 – Formale Modellierung des Produktions- und Beobachtungsmodells  
**Dokumenttyp:** Fachontologie / formale Spezifikation / Übergabegrundlage  
**Version:** 0.6.0 – neu strukturierter Arbeitsentwurf  
**Zielversion:** 1.0.0  
**Primäre Nachfolger:** AP2, AP3, AP5  
**Status:** fachlich und empirisch zu validieren  

---

# 1. Zielbild

Die Ontologie von AP1 soll einen konsistenten fachlichen Zustandsraum schaffen, auf den alle nachfolgenden Verarbeitungsschritte eindeutig referenzieren können.

Sie muss insbesondere vier Anforderungen gleichzeitig erfüllen:

1. **fachliche Eindeutigkeit**  
   Klassen müssen sauber definiert und voneinander abgegrenzt sein.

2. **Beobachtungsnähe**  
   Die Ontologie darf nur solche Unterschiede modellieren, die unter realistischen Beobachtungsbedingungen zumindest prinzipiell erfassbar sind.

3. **Unsicherheitsfähigkeit**  
   Mehrdeutigkeit, fehlende Evidenz und Nicht-Identifizierbarkeit müssen regulär modelliert werden.

4. **technische Anschlussfähigkeit**  
   Klassen, Relationen, Fallbacks und Constraints müssen maschinenlesbar und versionierbar sein.

Der zentrale Qualitätsmaßstab lautet:

> **Eine Unterscheidung wird nur dann Teil der freigegebenen Ontologie, wenn sie fachlich relevant, semantisch eindeutig und unter den vorgesehenen Evidenzbedingungen hinreichend trennbar ist.**

---

# 2. Rolle der Ontologie im Gesamtverfahren

```text
AP1 – Ontologie
      ↓
AP2 – Erfassung
      ↓
AP3 – probabilistische Annotation
      ↓
AP5 – latentes Mehrkanal-Messmodell
```

Die Ontologie stellt bereit:

- stabile Klassen-IDs,
- Klassenhierarchien,
- zulässige Kandidatenräume,
- Fallbackklassen,
- Relationen,
- Constraints,
- Kontextanforderungen,
- Evidenzanforderungen,
- Versionsinformationen.

---

# 3. Semantische Trennung der Ebenen

Die Ontologie trennt strikt:

```text
Observation
ProductionState
LossClass
CauseClass
MeasureClass
Evidence
Context
```

Es gelten folgende Grundsätze:

```text
Observation ≠ ProductionState
Evidence ≠ Ground Truth
ProductionState ≠ LossClass
ProductionState ≠ CauseClass
CauseClass ≠ MeasureClass
```

Ein Zustand kann einen Verlust repräsentieren, eine Ursache haben und durch eine Maßnahme adressiert werden. Diese Ebenen bleiben jedoch eigenständige Entitäten.

---

# 4. Fachliche Schichten

## 4.1 Observation Layer
Konkrete Beobachtungsinstanzen aus Multimomentaufnahmen.

## 4.2 Production State Layer
Fachlich mögliche Produktions- und Aktivitätszustände.

## 4.3 Loss Layer
Fachliche Verlustkategorien.

## 4.4 Cause Layer
Mögliche Ursachen oder Ursachengruppen.

## 4.5 Measure Layer
Mögliche Maßnahmenfamilien.

## 4.6 Evidence & Context Layer
Datenquellen, Kontext, Qualität, Provenienz und Missingness.

## 4.7 Governance Layer
Versionierung, Status, Freigaben und Ontologieentscheidungen.

---

# 5. Kompetenzfragen

Die Ontologie muss mindestens folgende Fragen beantworten können:

1. Welche ProductionState-Klassen existieren?
2. Welche Oberklasse besitzt eine Klasse?
3. Welche Unterklassen besitzt eine Klasse?
4. Welche Granularitätsstufe besitzt eine Klasse?
5. Welche Fallbackklasse ist definiert?
6. Welche Evidenz ist hilfreich?
7. Welche Evidenz ist erforderlich?
8. Wie ist die Qualität der Evidenz?
9. Welche Evidenz fehlt?
10. Wie sicher ist die zeitliche Zuordnung?
11. Welcher Prozessschritt liegt vor?
12. Welche Maschine bzw. welches Workcenter ist betroffen?
13. Welcher Auftrag bzw. welches Produkt ist relevant?
14. Welcher Samplingkontext liegt vor?
15. Welche Klassen sind disjunkt?
16. Welche Klassen dürfen parallel Kandidaten bleiben?
17. Welche LossClasses können mit einem Zustand verbunden werden?
18. Welche Ursachen sind fachlich möglich?
19. Welche Maßnahmen können grundsätzlich passen?
20. Wann wird auf eine Oberklasse zurückgefallen?
21. Wann ist `PS_UNKNOWN` angemessen?
22. Welche Klassen sind nicht ausreichend trennbar?
23. Welche Klassen wurden aggregiert?
24. Welche Ontologieversion wurde verwendet?
25. Wann wurde eine Klasse eingeführt oder deprecated?

---

# 6. Namenskonvention

| Präfix | Entität |
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

IDs müssen eindeutig, stabil, sprachunabhängig, nicht wiederverwendbar und versionsübergreifend referenzierbar sein.

---

# 7. Pflichtattribute einer Klasse

| Attribut | Pflicht | Bedeutung |
|---|---:|---|
| `id` | ja | stabile technische ID |
| `type` | ja | Entitätstyp |
| `label_de` | ja | Bezeichnung |
| `definition` | ja | normative Definition |
| `parent` | falls vorhanden | direkte Oberklasse |
| `granularity` | ja | G0–G3 |
| `status` | ja | Lebenszyklusstatus |
| `fallback_to` | G2/G3 | Rückfallklasse |
| `positive_examples` | kritisch | Positivbeispiele |
| `negative_examples` | kritisch | Abgrenzungsbeispiele |
| `possible_losses` | optional | Verlustbezug |
| `possible_causes` | optional | Ursachenbezug |
| `useful_evidence` | optional | hilfreiche Evidenz |
| `required_evidence` | optional | erforderliche Evidenz |
| `required_context` | optional | notwendiger Kontext |
| `disjoint_with` | optional | disjunkte Klassen |
| `introduced_in_version` | ja | Einführungsversion |
| `deprecated_in_version` | optional | Ablöseversion |

---

# 8. Granularitätsstufen

## G0 – unbekannt / nicht identifizierbar
Keine hinreichende Evidenz für eine belastbare Zuordnung.

## G1 – Hauptzustandsfamilie
- `PS_PRODUCTIVE`
- `PS_NECESSARY_SUPPORT`
- `PS_LOSS`
- `PS_UNKNOWN`

## G2 – fachliche Hauptklasse
Beispiele: Warten, Störung, Nacharbeit, Rüsten, Prüfen, Instandhaltung.

## G3 – Feinklasse
Beispiele: Warten auf Material, Maschinenstörung, Materialsuche, Reparatur, Mikrostopp.

---

# 9. Fallback-Logik

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

1. Jede G3-Klasse besitzt einen G2-Fallback.
2. Jede G2-Klasse besitzt einen G1-Fallback.
3. `PS_UNKNOWN` ist globaler letzter Fallback.
4. Fallbackpfade sind zyklusfrei.
5. Fallback reduziert Granularität, nicht fachliche Bedeutung.

---

# 10. ProductionState – Kernbaum

```text
ProductionState
│
├── PS_UNKNOWN
├── PS_PRODUCTIVE
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
**Definition:** Der tatsächliche Produktionszustand kann mit der verfügbaren Evidenz nicht ausreichend bestimmt werden.  
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

# 12. Rüsten

## PS_SETUP
**Definition:** Geplante Umstellung eines Betriebsmittels, Arbeitsplatzes oder Prozesses von einem gültigen Sollzustand in einen anderen gültigen Sollzustand.

### Unterklassen
- `PS_SETUP_TOOL_CHANGE`
- `PS_SETUP_FORMAT_CHANGE`
- `PS_SETUP_PARAMETERIZATION`

### Abgrenzung
Rüsten = geplante Umstellung.  
Instandhaltung = ungeplante Wiederherstellung.

---

# 13. Prüfen

## PS_INSPECTION
**Definition:** Geplante Feststellung, ob Produkt, Prozess oder Betriebsmittel definierte Anforderungen erfüllt.

### Unterklassen
- `PS_INSPECTION_PRODUCT`
- `PS_INSPECTION_PROCESS`
- `PS_INSPECTION_EQUIPMENT`

---

# 14. Weitere notwendige Unterstützung

## PS_NECESSARY_TRANSPORT
Transport, der Bestandteil des definierten Sollprozesses ist.

## PS_PLANNED_MAINTENANCE
Geplante Wartung bzw. Instandhaltung.

## PS_PLANNED_CLEANING
Geplante Reinigung als regulärer Prozess- oder Wartungsbestandteil.

## PS_PLANNED_SUPPORT
Sonstige notwendige geplante Unterstützung.

---

# 15. Warten

## PS_WAITING
**Definition:** Der Sollprozess kann nicht fortgeführt werden, weil eine notwendige Voraussetzung fehlt.

### PS_WAIT_MATERIAL
Material, Bauteil oder Hilfsstoff fehlt.

**Positive Beispiele:**
- Materialbehälter leer.
- Bauteil noch nicht bereitgestellt.

**Negative Beispiele:**
- Material vorhanden, wird aber gesucht.
- Maschine technisch gestört.

**Mögliche Ursachen:**
- `CAUSE_MATERIAL_NOT_AVAILABLE`
- `CAUSE_LOGISTICS_REPLENISHMENT`
- `CAUSE_PLANNING_SEQUENCE`

### PS_WAIT_INFORMATION
Notwendige Information, Freigabe, Zeichnung oder Entscheidung fehlt.

### PS_WAIT_MACHINE
Maschine oder Anlage ist nicht verfügbar bzw. nicht betriebsbereit.

### PS_WAIT_PERSONNEL
Benötigte Person oder Rolle fehlt.

### PS_WAIT_PREVIOUS_PROCESS
Vorgelagerter Prozessschritt ist noch nicht abgeschlossen.

### PS_WAIT_QUALITY_RELEASE
Qualitäts- oder Prüffreigabe fehlt.

---

# 16. Störung

## PS_DISTURBANCE
**Definition:** Ungeplante Unterbrechung oder erhebliche Beeinträchtigung des Sollprozesses.

### PS_DISTURB_MACHINE
Technischer Fehler an Maschine, Anlage oder Werkzeug.

### PS_DISTURB_PROCESS
Prozessbezogene Abweichung ohne primären technischen Defekt.

### PS_DISTURB_SAFETY
Sicherheitsbedingte Unterbrechung.

### PS_DISTURB_ENERGY
Unterbrechung durch Energieversorgung.

### PS_DISTURB_IT_SYSTEM
Unterbrechung durch IT-, Steuerungs- oder Kommunikationssystem.

---

# 17. Nacharbeit

## PS_REWORK
**Definition:** Zusätzliche Bearbeitung aufgrund eines bereits entstandenen Fehlers.

### PS_REWORK_INTERNAL
Fehlerursprung im betrachteten Prozess.

### PS_REWORK_EXTERNAL
Fehlerursprung vorgelagert oder extern.

### PS_REWORK_UNKNOWN_ORIGIN
Fehlerursprung nicht identifizierbar.

---

# 18. Ungeplante Instandhaltung

## PS_UNPLANNED_MAINTENANCE
**Definition:** Ungeplante Tätigkeit zur Wiederherstellung der technischen Funktionsfähigkeit.

### PS_MAINT_DIAGNOSIS
Fehlersuche / Diagnose.

### PS_MAINT_REPAIR
Aktive Reparatur.

### PS_MAINT_TEST_RESTART
Funktionsprüfung und Wiederanlauf.

Typische Sequenz:

```text
PS_DISTURB_MACHINE
→ PS_MAINT_DIAGNOSIS
→ PS_MAINT_REPAIR
→ PS_MAINT_TEST_RESTART
```

---

# 19. Leistungsabweichung

## PS_PERFORMANCE_DEVIATION
Produktion läuft, aber unter dem erwarteten Leistungsniveau.

### PS_REDUCED_SPEED
Reduzierte Prozessgeschwindigkeit.

### PS_MICROSTOP
Kurze ungeplante Unterbrechung.

### PS_UNSTABLE_CYCLE
Schwankende oder instabile Zykluszeit.

Quantitative Schwellen sind nicht Bestandteil von AP1.

---

# 20. Bewegungs-, Transport- und Suchverluste

## PS_UNNECESSARY_MOTION
Nicht notwendige Bewegung einer Person.

## PS_UNNECESSARY_TRANSPORT
Nicht notwendiger Material-, Produkt- oder Werkzeugtransport.

## PS_SEARCHING
Aktive Suche nach benötigter Ressource oder Information.

Unterklassen:
- `PS_SEARCH_MATERIAL`
- `PS_SEARCH_TOOL`
- `PS_SEARCH_INFORMATION`
- `PS_SEARCH_PERSON`

---

# 21. LossClass

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

---

# 22. CauseClass

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

# 23. MeasureClass

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

`MEASURE_INFORMATION_COLLECTION` bildet gezielte zusätzliche Evidenzerhebung als legitime Handlungsoption ab.

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

# 25. Evidenzqualitätsmodell

| Dimension | Beispielwerte |
|---|---|
| `availability` | present/missing |
| `completeness` | full/partial |
| `temporal_alignment` | high/medium/low |
| `source_reliability` | high/medium/low |
| `semantic_clarity` | high/medium/low |
| `linkage_quality` | high/medium/low |
| `observation_quality` | high/medium/low |

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

Jede Observation besitzt entweder:

- `observed_at`

oder:

- `window_start`
- `window_end`

Evidenz kann zusätzlich zeitliche Unsicherheit besitzen.

```yaml
temporal_reference:
  event_time: 2026-08-25T09:05:00+02:00
  uncertainty_seconds: 15
```

---

# 28. Provenienzmodell

```yaml
provenance:
  source_type: EV_MES
  source_system: MES_A
  source_record_id: EVENT_12345
  captured_at: 2026-08-25T09:05:00+02:00
  transformations:
    - timestamp_normalization
    - status_mapping
  ontology_version: 0.6.0
```

---

# 29. Missingness-Modell

| Status | Bedeutung |
|---|---|
| `present` | Evidenz vorhanden |
| `missing_expected` | erwartet, fehlt |
| `missing_not_applicable` | nicht anwendbar |
| `missing_not_collected` | nicht erhoben |
| `missing_linkage_failed` | Zuordnung fehlgeschlagen |
| `missing_unknown_reason` | Grund unbekannt |

Grundsatz:

```text
missing ≠ false
missing ≠ no_event
```

---

# 30. Relationen

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

# 31. Kardinalitätsregeln

## Observation

Eine Observation:

- besitzt genau eine ID,
- besitzt mindestens einen Zeitbezug,
- referenziert genau eine Ontologieversion,
- besitzt 0..n Evidenzen,
- besitzt 0..n Kandidatenklassen,
- besitzt 0..n Kontextinstanzen.

## ProductionState

Ein ProductionState:

- besitzt genau eine stabile ID,
- besitzt genau eine Granularitätsstufe,
- besitzt 0..1 direkten Parent,
- besitzt bei G2/G3 mindestens einen Fallback.

## Evidence

Eine Evidence:

- besitzt genau einen EvidenceType,
- besitzt genau eine Provenienz,
- besitzt mindestens einen Zeitbezug oder dokumentierte zeitliche Unsicherheit.

---

# 32. Disjunktheitsregeln

Für denselben Beobachtungsgegenstand und denselben Zeitpunkt können beispielsweise folgende Klassen disjunkt sein:

```text
PS_PRODUCTIVE ⊥ PS_WAITING
PS_PRODUCTIVE ⊥ PS_REWORK
PS_SETUP ⊥ PS_UNPLANNED_MAINTENANCE
PS_NECESSARY_TRANSPORT ⊥ PS_UNNECESSARY_TRANSPORT
```

Die Disjunktheit gilt immer nur innerhalb einer klar definierten Beobachtungseinheit.

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
- **CON-009:** Konfligierende Evidenz bleibt sichtbar.
- **CON-010:** Jede Observation besitzt Zeitbezug.
- **CON-011:** Klassen mit `requiresContext` dürfen nur bei vorhandenem oder explizit unsicherem Kontext fein ausgewertet werden.
- **CON-012:** Bei mehreren gleich plausiblen G3-Kandidaten bleibt der gemeinsame G2-Parent zulässig.
- **CON-013:** `mayHaveCause` bedeutet fachliche Plausibilität, nicht Kausalität.
- **CON-014:** `mayBeAddressedBy` bedeutet fachliche Passung, nicht Wirksamkeit.
- **CON-015:** Freigegebene IDs werden nicht wiederverwendet.
- **CON-016:** Historische Beobachtungen müssen mit der damals verwendeten Ontologieversion rekonstruierbar bleiben.
- **CON-017:** Deprecated Klassen dürfen nicht für neue Beobachtungen verwendet werden.
- **CON-018:** Aggregierte Klassen müssen auf ihre Nachfolgeklasse verweisen.

---

# 34. Kritische Abgrenzungsregeln

## Warten vs. Suchen
**Warten:** benötigte Ressource fehlt; keine aktive Suchhandlung.  
**Suchen:** aktive Suche nach Ressource, Information oder Person.

## Störung vs. Instandhaltung
**Störung:** Ausfall- bzw. Unterbrechungszustand.  
**Instandhaltung:** Diagnose, Reparatur oder Wiederherstellung.

## notwendiger vs. unnötiger Transport
**Notwendig:** Bestandteil des Sollprozesses.  
**Unnötig:** durch Prozess- oder Layoutgestaltung vermeidbar.

## Rüsten vs. Reparatur
**Rüsten:** geplante Umstellung.  
**Reparatur:** ungeplante Wiederherstellung.

## Nacharbeit vs. normale Bearbeitung
**Nacharbeit:** zusätzliche Bearbeitung wegen bereits entstandenem Fehler.  
**Normal:** regulärer Sollprozess.

## Warten auf Material vs. Warten auf Vorprozess
**Material:** physisches Material fehlt.  
**Vorprozess:** fachliche Prozessabhängigkeit ist nicht erfüllt.

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

Diese Matrix beschreibt zulässige fachliche Zusammenhänge, keine empirisch bewiesenen Wirkbeziehungen.

---

# 36. Granularitätsprüfung

Jede G3-Klasse wird bewertet auf:

1. Beobachtbarkeit
2. semantische Trennschärfe
3. zusätzliche Evidenz
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

- Definition eindeutig,
- Parent vorhanden,
- Fallback vorhanden,
- Abgrenzung dokumentiert,
- mindestens ein plausibler Evidenzpfad vorhanden,
- fachliche Relevanz gegeben,
- Testfälle keine systematische Untrennbarkeit zeigen.

---

# 37. Klassensteckbrief – Standardtemplate

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

introduced_in_version: 0.6.0
```

---

# 38. Observation – Standardtemplate

```yaml
observation_id: OBS_2026_000184
observed_at: 2026-08-25T09:05:00+02:00
ontology_version: 0.6.0

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

## Fall A – Person steht neben laufender Maschine
Mögliche Interpretationen: produktive Überwachung, Prüfen, Warten.  
Ohne Prozesskontext keine harte Zuordnung.

## Fall B – Person läuft Richtung Materiallager
Mögliche Interpretationen: notwendiger Transport, Materialsuche, unnötige Bewegung.

## Fall C – Maschine stoppt wenige Sekunden
Mögliche Interpretationen: Mikrostopp, regulärer Prozesszustand, kurze Störung.  
Die quantitative Schwelle wird nicht in AP1 festgelegt.

## Fall D – Qualitätsprüfung gefolgt von Korrektur
Zeitlich getrennte Zustände:

```text
PS_INSPECTION_PRODUCT
→ PS_REWORK
```

Keine Mischklasse notwendig.

---

# 40. Testfälle

## T-01
Maschine steht, Person wartet, Grund unbekannt.  
**Erwartung:** `PS_WAITING` bzw. `PS_UNKNOWN`; keine erzwungene G3-Klasse.

## T-02
Memo sagt „Material fehlt“.  
**Erwartung:** `PS_WAIT_MATERIAL` als plausibler Kandidat.

## T-03
MES-Fehlercode, anschließend Reparatur.  
**Erwartung:** `PS_DISTURB_MACHINE` → `PS_MAINT_REPAIR`.

## T-04
Person transportiert Material ohne Kontext.  
**Erwartung:** notwendiger und unnötiger Transport bleiben Kandidaten.

## T-05
Beobachtung meldet Stillstand, MES meldet Betrieb.  
**Erwartung:** Konflikt bleibt erhalten.

---

# 41. Validierung

## Strukturell
- IDs eindeutig
- keine Zyklen
- Parents gültig
- Fallbacks gültig
- keine verwaisten Klassen

## Fachlich
- Definition eindeutig
- Positiv-/Negativbeispiele plausibel
- Abgrenzungen konsistent
- Ebenen sauber getrennt

## Beobachtungsbezogen
- Klasse realistisch beobachtbar?
- Mehrdeutigkeit korrekt erhalten?
- Fallback funktional?
- Granularität tragfähig?

## Technisch
- YAML/JSON gültig
- Referenzen auf existierende IDs
- Pflichtfelder vollständig
- Versionen korrekt

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
target_version: 0.7.0
```

---

# 43. Versionierung

## MAJOR
Semantisch inkompatible Änderung.

## MINOR
Kompatible Erweiterung.

## PATCH
Dokumentationsänderung.

Beispiel:

```text
0.6.0 neu strukturierter Arbeitsentwurf
0.7.0 nach Granularitätsreview
0.8.0 nach Pilotbeobachtungen
1.0.0 freigegebene AP1-Ontologie
```

---

# 44. Branchenspezifische Erweiterung

Die Kernontologie bleibt generisch.

```text
core/
  PS_DISTURBANCE

extensions/automotive/
  PS_DISTURB_ANDON

extensions/process_industry/
  PS_DISTURB_CIP
```

Erweiterungen dürfen Kernklassen spezialisieren, aber nicht semantisch umdefinieren.

---

# 45. Offene Entscheidungen vor v1.0

1. Soll `PS_PRODUCTIVE` weiter untergliedert werden?
2. Wie werden geplante Pausen behandelt?
3. Wie werden persönliche Unterbrechungen behandelt?
4. Bleibt `PS_MICROSTOP` eigene Klasse?
5. Wie wird Mikrostopp quantitativ von Störung abgegrenzt?
6. Welche G3-Klassen benötigen MES?
7. Welche G3-Klassen benötigen ERP?
8. Welche Klassen gehören in die Kernontologie?
9. Welche Klassen sind branchenspezifisch?
10. Welche Mindestzahl an Testfällen ist für G3-Freigabe notwendig?
11. Wie werden historische Daten bei Aggregation migriert?
12. Wie werden deprecated Klassen in Altanalysen behandelt?
13. Welche LossClasses werden in AP6 tatsächlich verwendet?
14. Welche CauseClasses müssen gröber gefasst werden?
15. Welche Relationen sollen technisch validiert werden?

---

# 46. Definition of Done für Ontologie v1.0

- [ ] stabile IDs für alle Klassen
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
- [ ] Kardinalitätsregeln dokumentiert
- [ ] Disjunktheitsregeln dokumentiert
- [ ] Constraint-Katalog vollständig
- [ ] kritische Abgrenzungen dokumentiert
- [ ] Granularitätsprüfung abgeschlossen
- [ ] nicht trennbare Klassen aggregiert oder markiert
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

- stabile IDs,
- Beobachtungsfelder,
- Kontexttypen,
- Evidenzreferenzen,
- Missingness-Status,
- Zeitmodell,
- Ontologieversion.

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

- stabilen Zustandsraum,
- stabile Klassen-IDs,
- konsistente Hierarchie,
- dokumentierte Fallbacks,
- eindeutige Ontologieversion,
- klare Trennung Zustand/Evidenz,
- klare Trennung Zustand/Ursache,
- reproduzierbare Änderungen.

---

# 50. Ergebnisbild

Die Zielontologie ist eine **fachlich belastbare, formal konsistente, beobachtungsnahe, versionierbare und unsicherheitsfähige Ontologie**.

Sie soll nur solche Klassen enthalten, die:

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
