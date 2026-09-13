# AP1 – Detaillierte Fachontologie des Produktions- und Beobachtungsmodells

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP1 – Formale Modellierung des Produktions- und Beobachtungsmodells  
**Dokumenttyp:** Fachontologie / formale Spezifikation  
**Version:** 0.4.0 – detaillierter Arbeitsentwurf  
**Zielversion:** 1.0.0  
**Primäre Nachfolger:** AP2, AP3, AP5  
**Leitprinzip:** Die Ontologie darf Unsicherheit nicht durch zu frühe oder zu feine Festlegungen künstlich reduzieren.

---

# 1. Zweck der Ontologie

Die Ontologie definiert den fachlichen Zustandsraum für Beobachtung, Annotation und spätere probabilistische Modellierung. Sie beschreibt nicht nur Klassen, sondern auch Hierarchien, Relationen, Constraints, Fallbacks, Evidenzanforderungen, Kontextbezüge, Provenienz und Versionierung.

Sie soll sicherstellen, dass:

- Beobachtung und tatsächlicher Produktionszustand strikt getrennt bleiben,
- Produktionszustand, Verlust, Ursache und Maßnahme semantisch nicht vermischt werden,
- mehrere fachlich zulässige Kandidatenklassen gleichzeitig möglich sind,
- `UNKNOWN` bzw. Nicht-Identifizierbarkeit reguläre Modellzustände sind,
- feinere Klassen auf gröbere Klassen zurückfallen können,
- Evidenz aus Beobachtung, Memo, MES und ERP getrennt gespeichert und referenziert wird,
- die Herkunft und Qualität der Evidenz erhalten bleibt,
- AP3 einen formal eingeschränkten Kandidatenraum für die probabilistische Annotation erhält,
- AP5 einen stabilen Zustandsraum für latente Produktionszustände erhält,
- Änderungen versionierbar und auditierbar bleiben.

---

# 2. Abgrenzung

## 2.1 Die Ontologie beantwortet

- Welche Produktionszustände grundsätzlich zulässig sind.
- Welche Ober- und Unterklassen existieren.
- Welche Verluste zu einem Zustand passen können.
- Welche Ursachen fachlich plausibel sind.
- Welche Maßnahmen grundsätzlich zu einer Ursache passen können.
- Welche Evidenz für eine Klasse relevant ist.
- Welcher Kontext für eine Feinunterscheidung benötigt wird.
- Welche Klassen miteinander unvereinbar sind.
- Welche Fallbackklasse bei zu geringer Evidenz verwendet wird.
- Welche Klasse in welcher Ontologieversion gültig ist.

## 2.2 Die Ontologie beantwortet ausdrücklich nicht

- Welche Klasse tatsächlich vorliegt.
- Wie hoch die Wahrscheinlichkeit einer Klasse ist.
- Welche Evidenzquelle stärker gewichtet wird.
- Welche Ursache kausal bewiesen ist.
- Welche Maßnahme tatsächlich wirkt.
- Welche Maßnahme priorisiert werden soll.
- Welche Kennzahl quantitativ resultiert.

Diese Aufgaben gehören in AP3, AP5, AP6, AP8 und AP9.

---

# 3. Grundmodell der Realität und Beobachtung

```text
reale Produktionssituation
        ↓
latenter tatsächlicher Zustand Z
        ↓
beobachtbare Evidenz X
        ↓
zulässige Kandidatenklassen K
        ↓
probabilistische Annotation / Abstain
```

Daraus folgen die semantischen Invarianten:

```text
Observation ≠ ProductionState
Evidence ≠ Ground Truth
ProductionState ≠ CauseClass
CauseClass ≠ MeasureClass
LossClass ≠ ProductionState
LossClass ≠ MeasureClass
```

Ein Zustand kann einen Verlust repräsentieren. Er ist aber nicht identisch mit einer Verlustklasse.

---

# 4. Kompetenzfragen

Die Ontologie muss mindestens folgende Fragen beantworten können:

1. Welche ProductionState-Klassen existieren?
2. Welche Klasse ist Parent einer gegebenen Klasse?
3. Welche Granularitätsstufe besitzt eine Klasse?
4. Welche Fallbackklasse gilt?
5. Welche Klassen sind Geschwisterklassen?
6. Welche Zustände können denselben Verlusttyp repräsentieren?
7. Welche Ursachen können zu einem Zustand oder Verlust passen?
8. Welche Maßnahmen können eine Ursache grundsätzlich adressieren?
9. Welche Evidenztypen sind für eine Klasse hilfreich?
10. Welche Evidenztypen sind für eine Klasse zwingend?
11. Welche Kontexttypen sind für eine Klasse nötig?
12. Welche Klassen sind gegenseitig unvereinbar?
13. Welche Klassen dürfen parallel Kandidaten bleiben?
14. Welche Klasse ist bei Mehrdeutigkeit der gemeinsame zulässige Parent?
15. Welche Klassen sind deprecated, aggregiert oder verworfen?
16. Welche Version führte eine Klasse ein?
17. Welche Klassen wurden aufgrund mangelnder Identifizierbarkeit gröber gefasst?
18. Welche Evidenz war Grundlage einer späteren Kandidatenbildung?
19. Welche Beobachtung wurde mit welcher Ontologieversion verarbeitet?
20. Welche Änderungen haben die Semantik einer Klasse verändert?

Diese Kompetenzfragen dienen zugleich als Validierungskatalog.

---

# 5. Namensraum und ID-Konvention

| Präfix | Entität |
|---|---|
| `PS_` | ProductionState |
| `LOSS_` | LossClass |
| `CAUSE_` | CauseClass |
| `MEASURE_` | MeasureClass |
| `EV_` | EvidenceType |
| `CTX_` | ContextType |
| `CON_` | Constraint |
| `REL_` | RelationType |
| `OBS_` | Observation |
| `DEC_` | OntologyDecision |

IDs müssen eindeutig, stabil, sprachunabhängig, nicht wiederverwendbar und versionsübergreifend referenzierbar sein.

---

# 6. Entitätstypen

| Typ | Bedeutung |
|---|---|
| `Observation` | konkrete Beobachtung |
| `ProductionState` | tatsächlicher oder möglicher Produktionszustand |
| `LossClass` | Verlustart |
| `CauseClass` | mögliche Ursache |
| `MeasureClass` | mögliche Maßnahme |
| `Evidence` | konkrete Evidenzinstanz |
| `EvidenceType` | Evidenztyp |
| `Context` | konkrete Kontextinstanz |
| `ContextType` | Kontexttyp |
| `Constraint` | formale Regel |
| `Provenance` | Herkunft einer Information |
| `GranularityLevel` | G0–G3 |
| `OntologyDecision` | dokumentierte Modellierungsentscheidung |

---

# 7. Pflichtattribute jeder fachlichen Klasse

| Attribut | Pflicht | Bedeutung |
|---|---:|---|
| `id` | ja | stabile technische ID |
| `type` | ja | Entitätstyp |
| `label_de` | ja | deutsche Bezeichnung |
| `definition` | ja | normative Definition |
| `parent` | falls vorhanden | direkte Oberklasse |
| `granularity` | ja | G0–G3 |
| `status` | ja | Lebenszyklusstatus |
| `fallback_to` | bei G2/G3 | gröbere Rückfallklasse |
| `positive_examples` | ja bei kritischen Klassen | typische Positivfälle |
| `negative_examples` | ja bei kritischen Klassen | Abgrenzungsfälle |
| `possible_losses` | optional | mögliche Verlusttypen |
| `possible_causes` | optional | mögliche Ursachen |
| `useful_evidence` | optional | hilfreiche Evidenz |
| `required_evidence` | optional | zwingende Evidenz |
| `required_context` | optional | notwendiger Kontext |
| `constraints` | optional | anwendbare Constraints |
| `status_reason` | bei nicht accepted | Begründung |
| `introduced_in_version` | ja | Einführungsversion |
| `deprecated_in_version` | optional | Ablöseversion |
| `valid_from` | ja | Beginn Gültigkeit |
| `valid_to` | optional | Ende Gültigkeit |

---

# 8. Granularitätsmodell

- **G0:** unbekannt / nicht identifizierbar
- **G1:** grobe Hauptzustandsklasse
- **G2:** fachliche Hauptklasse
- **G3:** Feinklasse

Grundregel:

> Eine Klasse darf nur so fein sein, wie ihre Abgrenzung unter realistischen Evidenzbedingungen nachvollziehbar möglich ist.

Fallback-Beispiel:

```text
PS_WAIT_MATERIAL
   ↓
PS_WAITING
   ↓
PS_LOSS
   ↓
PS_UNKNOWN
```

---

# 9. ProductionState – Klassenbaum

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

# 10. Normative Definitionen der G1-Klassen

## PS_UNKNOWN

**Definition:** Der tatsächliche Produktionszustand kann mit der verfügbaren Evidenz nicht ausreichend bestimmt werden.

**Zulässig bei:** schlechter Beobachtbarkeit, widersprüchlicher Evidenz, fehlendem Kontext, mehreren gleich plausiblen Klassen oder fehlender Ontologieabdeckung.

**Status:** `accepted`  
**Fallback:** keiner  
**Besonderheit:** global zulässig.

## PS_PRODUCTIVE

**Definition:** Unmittelbar produktive Tätigkeit entsprechend dem fachlich definierten Sollprozess.

**Positive Beispiele:** Bearbeiten, Montieren, Fügen, reguläres Verpacken.  
**Negative Beispiele:** Warten, Nacharbeit, ungeplante Reparatur, Suchen.

## PS_NECESSARY_SUPPORT

**Definition:** Für die Produktion erforderliche unterstützende Tätigkeit, die nicht als unmittelbarer produktiver Kernschritt klassifiziert wird.

## PS_LOSS

**Definition:** Zustand, in dem Zeit, Leistung, Qualität oder Ressourcen gegenüber einem definierten Referenzzustand nicht wie vorgesehen genutzt werden.

---

# 11. Rüsten und notwendige Unterstützung

## PS_SETUP

Geplante Vorbereitung oder Umstellung eines Betriebsmittels, Arbeitsplatzes oder Prozesses auf einen neuen Sollzustand.

### PS_SETUP_TOOL_CHANGE
Werkzeugwechsel.

### PS_SETUP_FORMAT_CHANGE
Format-, Produkt- oder Variantenwechsel.

### PS_SETUP_PARAMETERIZATION
Parametrierung oder Einstellung eines Prozesses oder Betriebsmittels.

## PS_INSPECTION

Geplante Kontrolle eines Produkts, Prozesses oder Betriebsmittels.

### PS_INSPECTION_PRODUCT
Produkt- oder Bauteilprüfung.

### PS_INSPECTION_PROCESS
Prüfung eines Prozesszustands.

### PS_INSPECTION_EQUIPMENT
Prüfung einer Maschine bzw. eines Betriebsmittels.

## PS_NECESSARY_TRANSPORT

Transport, der Teil des definierten Sollprozesses ist.

## PS_PLANNED_MAINTENANCE

Geplante Wartungs- oder Instandhaltungsaktivität.

## PS_PLANNED_SUPPORT

Geplante notwendige Unterstützung ohne spezifischere Zuordnung.

---

# 12. Warten

## PS_WAITING

**Definition:** Der vorgesehene Prozess kann nicht fortgeführt werden, weil eine notwendige Voraussetzung fehlt.

## PS_WAIT_MATERIAL

Material, Bauteil oder Hilfsstoff fehlt.

**Positive Beispiele:** Materialbehälter leer; Bauteil noch nicht bereitgestellt.  
**Negative Beispiele:** Material vorhanden, wird aber gesucht; Maschine technisch gestört; Freigabe fehlt.  
**Mögliche Ursachen:** `CAUSE_MATERIAL_NOT_AVAILABLE`, `CAUSE_LOGISTICS_REPLENISHMENT`, `CAUSE_PLANNING_SEQUENCE`.  
**Hilfreiche Evidenz:** `EV_OBSERVATION`, `EV_MEMO`, `EV_ERP`.  
**Fallback:** `PS_WAITING`.

## PS_WAIT_INFORMATION

Information, Freigabe, Zeichnung, Entscheidung oder Anweisung fehlt.

## PS_WAIT_MACHINE

Maschine oder Anlage ist nicht verfügbar bzw. nicht betriebsbereit.

## PS_WAIT_PERSONNEL

Benötigte Person oder Rolle ist nicht verfügbar.

## PS_WAIT_PREVIOUS_PROCESS

Vorgelagerter Prozessschritt ist nicht abgeschlossen.

## PS_WAIT_QUALITY_RELEASE

Prozess wartet auf Qualitäts- oder Prüffreigabe.

---

# 13. Störung

## PS_DISTURBANCE

Ungeplante Unterbrechung oder erhebliche Beeinträchtigung des vorgesehenen Prozessablaufs.

### PS_DISTURB_MACHINE
Technischer Fehler an Maschine, Anlage oder Werkzeug.

### PS_DISTURB_PROCESS
Prozessbezogene Störung ohne primären technischen Maschinenausfall.

### PS_DISTURB_SAFETY
Unterbrechung aufgrund eines sicherheitsbezogenen Ereignisses.

### PS_DISTURB_ENERGY
Unterbrechung aufgrund fehlender oder instabiler Energieversorgung.

### PS_DISTURB_IT_SYSTEM
Unterbrechung aufgrund eines IT-, System- oder Kommunikationsproblems.

---

# 14. Nacharbeit

## PS_REWORK

Zusätzliche Bearbeitung aufgrund eines bereits entstandenen Fehlers oder Qualitätsproblems.

- `PS_REWORK_INTERNAL` – Fehlerursprung im betrachteten Prozess.
- `PS_REWORK_EXTERNAL` – Fehlerursprung in vorgelagertem oder externem Prozess.
- `PS_REWORK_UNKNOWN_ORIGIN` – Fehlerursprung nicht identifizierbar.

---

# 15. Ungeplante Instandhaltung

## PS_UNPLANNED_MAINTENANCE

Ungeplante Tätigkeit zur Wiederherstellung der technischen Funktionsfähigkeit.

- `PS_MAINT_DIAGNOSIS` – Fehlersuche und Diagnose.
- `PS_MAINT_REPAIR` – aktive Reparatur.
- `PS_MAINT_TEST_RESTART` – Funktionsprüfung und Wiederanlauf.

---

# 16. Leistungsabweichung

## PS_PERFORMANCE_DEVIATION

Produktion läuft grundsätzlich, aber unter dem erwarteten Leistungsniveau.

- `PS_REDUCED_SPEED` – reduzierte Prozess- oder Maschinengeschwindigkeit.
- `PS_MICROSTOP` – kurze ungeplante Unterbrechung.
- `PS_UNSTABLE_CYCLE` – schwankende bzw. instabile Zykluszeit.

Quantitative Schwellen sind nicht Bestandteil von AP1.

---

# 17. Bewegungs-, Transport- und Suchverluste

## PS_UNNECESSARY_MOTION
Nicht notwendige Bewegung einer Person.

## PS_UNNECESSARY_TRANSPORT
Nicht notwendiger Material-, Produkt- oder Werkzeugtransport.

## PS_SEARCHING
Aktive Suche nach einer benötigten Ressource oder Information.

Unterklassen:

- `PS_SEARCH_MATERIAL`
- `PS_SEARCH_TOOL`
- `PS_SEARCH_INFORMATION`
- `PS_SEARCH_PERSON`

---

# 18. LossClass – Verlustontologie

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

`LOSS_UNKNOWN` ist zulässig, wenn ein Verlust erkennbar ist, der Verlusttyp aber nicht belastbar bestimmt werden kann.

---

# 19. CauseClass – Ursachenontologie

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

`CauseClass` beschreibt fachliche Plausibilität, keinen Kausalnachweis.

---

# 20. MeasureClass – Maßnahmenontologie

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

`MEASURE_INFORMATION_COLLECTION` bildet zusätzliche Evidenzerhebung als legitime Handlungsoption ab.

---

# 21. EvidenceType – Evidenzontologie

- `EV_OBSERVATION` – direkte Beobachtung
- `EV_MEMO` – Sprach-/Textmemo
- `EV_MES` – Maschinenzustände, Zeiten und Ereignisse
- `EV_ERP` – Auftrag, Produkt, Menge und Planungskontext
- `EV_DERIVED` – abgeleitete Evidenz

---

# 22. Evidenzqualitätsmodell

| Dimension | Wertebeispiel | Bedeutung |
|---|---|---|
| `availability` | present/missing | vorhanden? |
| `completeness` | full/partial | vollständig? |
| `temporal_alignment` | high/medium/low | zeitliche Passung |
| `source_reliability` | high/medium/low | Verlässlichkeit |
| `semantic_clarity` | high/medium/low | Eindeutigkeit |
| `linkage_quality` | high/medium/low | Zuordnungsqualität |
| `observation_quality` | high/medium/low | Beobachtungsqualität |

---

# 23. ContextType

- `CTX_SITE`
- `CTX_AREA`
- `CTX_LINE`
- `CTX_WORKCENTER`
- `CTX_MACHINE`
- `CTX_ORDER`
- `CTX_PRODUCT`
- `CTX_VARIANT`
- `CTX_PROCESS_STEP`
- `CTX_SHIFT`
- `CTX_OPERATOR_ROLE`
- `CTX_TIME`
- `CTX_SAMPLING_STRATUM`
- `CTX_SAMPLING_CLUSTER`

---

# 24. Provenienzmodell

```yaml
provenance:
  source_type: EV_MES
  source_system: MES_A
  source_record_id: EVENT_12345
  captured_at: 2026-08-21T10:04:00+02:00
  ingested_at: 2026-08-21T10:04:03+02:00
  transformation:
    - timestamp_normalization
  ontology_version: 0.4.0
```

---

# 25. Missingness-Modell

| Status | Bedeutung |
|---|---|
| `present` | Evidenz vorhanden |
| `missing_expected` | erwartet, aber fehlt |
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

# 26. Relationen mit Domain und Range

| Relation | Domain | Range | Semantik |
|---|---|---|---|
| `subClassOf` | fachliche Klasse | gleiche Klassenfamilie | Hierarchie |
| `fallbackTo` | ProductionState | ProductionState | gröbere zulässige Klasse |
| `mayRepresentLoss` | ProductionState | LossClass | möglicher Verlust |
| `mayHaveCause` | ProductionState/LossClass | CauseClass | mögliche Ursache |
| `mayBeAddressedBy` | CauseClass | MeasureClass | mögliche Maßnahme |
| `usefulEvidence` | fachliche Klasse | EvidenceType | hilfreiche Evidenz |
| `requiresEvidence` | fachliche Klasse | EvidenceType | notwendige Evidenz |
| `requiresContext` | fachliche Klasse | ContextType | benötigter Kontext |
| `incompatibleWith` | fachliche Klasse | gleiche Klassenfamilie | Unvereinbarkeit |
| `temporallyPrecedes` | ProductionState | ProductionState | zeitliche Reihenfolge |
| `occursInContext` | Observation/State | Context | Kontextbezug |
| `hasEvidence` | Observation | Evidence | Evidenzzuordnung |
| `usesOntologyVersion` | Observation | Version | Reproduzierbarkeit |

---

# 27. Kardinalitätsregeln

## Observation

Eine Observation:

- hat genau eine ID,
- besitzt mindestens einen Zeitbezug,
- referenziert genau eine Ontologieversion,
- kann 0..n Evidenzen besitzen,
- kann 0..n Kandidatenklassen besitzen,
- kann 0..n Kontextinstanzen besitzen.

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
- besitzt mindestens einen Zeitbezug oder dokumentierte zeitliche Unschärfe.

---

# 28. Constraint-Katalog

- **CON-001:** `PS_UNKNOWN` muss immer zulässig sein.
- **CON-002:** Keine G3-Klasse darf zwingend ausgewählt werden.
- **CON-003:** Jede G3-Klasse benötigt einen Fallback.
- **CON-004:** `subClassOf` und `fallbackTo` müssen zyklusfrei sein.
- **CON-005:** ProductionState, LossClass, CauseClass und MeasureClass bleiben getrennt.
- **CON-006:** Jede Evidence benötigt Provenienz.
- **CON-007:** Missingness muss explizit modelliert werden.
- **CON-008:** Missingness darf nicht als negatives Signal interpretiert werden.
- **CON-009:** Konfligierende Evidenz bleibt erhalten.
- **CON-010:** Jede Observation benötigt Zeitbezug.
- **CON-011:** Klassen mit `requiresContext` dürfen nur unter diesem Kontext fein ausgewertet werden.
- **CON-012:** Bei gleich plausiblen G3-Kandidaten muss der gemeinsame G2-Parent zulässig bleiben.
- **CON-013:** `mayHaveCause` ist keine Kausalitätsaussage.
- **CON-014:** `mayBeAddressedBy` ist keine Wirkungsgarantie.
- **CON-015:** Freigegebene IDs dürfen nicht rückwirkend geändert oder wiederverwendet werden.
- **CON-016:** Historische Beobachtungen müssen mit der damals verwendeten Ontologieversion reproduzierbar bleiben.

---

# 29. Kritische Abgrenzungsregeln

## Warten vs. Suchen

**Warten:** benötigte Ressource fehlt; keine aktive Suchhandlung.  
**Suchen:** aktive Suche nach Ressource, Person oder Information.

## Störung vs. Instandhaltung

**Störung:** ungeplantes Ereignis oder Ausfallzustand.  
**Instandhaltung:** Diagnose, Reparatur oder Wiederherstellung.

## notwendiger vs. unnötiger Transport

**Notwendig:** Bestandteil des definierten Sollprozesses.  
**Unnötig:** vermeidbar durch Prozess- oder Layoutgestaltung.

## Rüsten vs. Reparatur

**Rüsten:** geplante Umstellung.  
**Reparatur:** ungeplante Wiederherstellung.

## Nacharbeit vs. normale Bearbeitung

**Nacharbeit:** zusätzliche Bearbeitung aufgrund eines bereits entstandenen Fehlers.  
**Normal:** regulärer Sollprozess.

## Warten auf Material vs. vorgelagerten Prozess

**Material:** benötigtes physisches Material ist nicht verfügbar.  
**Vorgelagerter Prozess:** Prozessabhängigkeit ist noch nicht erfüllt.

---

# 30. Ursache–Zustand–Maßnahme-Matrix

| Zustand | mögliche Verlustklasse | mögliche Ursachen | mögliche Maßnahmen |
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

Die Matrix beschreibt fachliche Zulässigkeit, keine nachgewiesene Wirkung.

---

# 31. Granularitätsprüfung

Jede G3-Klasse wird vor Freigabe bewertet auf:

1. Beobachtbarkeit
2. semantische Trennschärfe
3. zusätzliche Evidenz
4. Sparsity-Robustheit
5. erwartbare Häufigkeit
6. fachliche Relevanz
7. Definitionsstabilität
8. Fallback-Fähigkeit
9. Datenverknüpfbarkeit
10. Nutzen für spätere Entscheidungen

Statuswerte:

- `draft`
- `candidate`
- `accepted`
- `accepted_with_constraints`
- `aggregated`
- `rejected`
- `deprecated`

Eine G3-Klasse wird nur akzeptiert, wenn Definition, Parent, Fallback, Abgrenzung und mindestens ein plausibler Evidenzpfad dokumentiert sind und Testfälle keine systematische Untrennbarkeit zeigen.

---

# 32. Maschinenlesbares Klassenbeispiel

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

introduced_in_version: 0.4.0
valid_from: 2026-08-22
```

---

# 33. Beispiel einer Beobachtungsinstanz

```yaml
observation_id: OBS-2026-000184
observed_at: 2026-08-22T10:43:00+02:00
ontology_version: 0.4.0

context:
  workcenter_id: WC-12
  process_step: ASSEMBLY-04
  order_id: ORDER-4711

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

# 34. Testfälle

## T-01 Grobzustand eindeutig, Feinklasse unklar

Maschine steht, Person wartet, Grund unbekannt.  
**Erwartung:** `PS_WAITING` und `PS_UNKNOWN`; keine erzwungene Feinklasse.

## T-02 Materialmangel

Beobachtung: Warten. Memo: „Material fehlt.“  
**Erwartung:** `PS_WAIT_MATERIAL` und `PS_WAITING`.

## T-03 Maschinenfehler und Reparatur

MES meldet Fehlercode, danach arbeitet Instandhalter an der Maschine.  
**Erwartung:** zeitlich getrennt `PS_DISTURB_MACHINE` → `PS_MAINT_REPAIR`.

## T-04 Transport ohne Prozesskontext

Person bewegt Material.  
**Erwartung:** `PS_NECESSARY_TRANSPORT` oder `PS_UNNECESSARY_TRANSPORT`; keine harte Entscheidung ohne Kontext.

## T-05 Konfligierende Evidenz

Beobachtung meldet „Maschine steht“, MES meldet „läuft“.  
**Erwartung:** beide Evidenzen bleiben erhalten; Kandidatenraum bleibt offen.

---

# 35. Validierung der Ontologie

## Strukturell

- IDs eindeutig
- keine Zyklen
- Parents gültig
- Fallbacks gültig
- keine verwaisten Klassen
- keine ungültigen Relationstypen

## Fachlich

- Definition eindeutig
- Beispiele plausibel
- Abgrenzungen konsistent
- Zustand/Ursache/Maßnahme getrennt

## Beobachtungsbezogen

- Klasse realistisch beobachtbar?
- Mehrdeutigkeit bleibt erhalten?
- Fallback funktioniert?
- Granularität tragfähig?

## Technisch

- YAML/JSON-Struktur gültig
- Referenzen auf existierende IDs
- Pflichtfelder vollständig
- Versionen konsistent

---

# 36. Governance und Änderungsmanagement

Jede Ontologieänderung wird als `OntologyDecision` dokumentiert.

Pflichtfelder:

1. Änderungs-ID
2. betroffene Klasse(n)
3. Änderungstyp
4. Begründung
5. Evidenzbasis
6. Auswirkungen
7. Migrationsbedarf
8. Entscheidung
9. Reviewer
10. Freigabedatum
11. Zielversion

Empfohlene Rollen:

- Antragsteller
- fachlicher Reviewer
- technischer Reviewer
- Freigabeverantwortlicher

---

# 37. Versionierung

- **MAJOR:** inkompatible fachliche Änderung
- **MINOR:** kompatible Erweiterung
- **PATCH:** Dokumentationsänderung ohne semantische Wirkung

Beispiel:

```text
0.1.0 Initialentwurf
0.2.0 Erweiterung Klassenraum
0.3.0 formale Constraints und Governance
0.4.0 detaillierte Semantik und Validierung
1.0.0 freigegebene AP1-Ontologie
```

---

# 38. Branchenspezifische Erweiterbarkeit

Die Kernontologie soll generisch bleiben. Branchenspezifische Erweiterungen werden separat modelliert.

```text
core/
  PS_DISTURBANCE

extensions/automotive/
  PS_DISTURB_ANDON

extensions/process_industry/
  PS_DISTURB_CIP
```

Erweiterungen dürfen die Kernontologie nicht semantisch widersprechen.

---

# 39. Offene Designentscheidungen vor v1.0

1. Soll `PS_PRODUCTIVE` weiter untergliedert werden?
2. Wie werden geplante Pausen behandelt?
3. Wie werden persönliche Unterbrechungen behandelt?
4. Bleibt `PS_MICROSTOP` eigene Klasse?
5. Wie wird Mikrostopp quantitativ von Störung abgegrenzt?
6. Welche G3-Klassen benötigen zwingend MES-Evidenz?
7. Welche G3-Klassen benötigen zwingend ERP-Kontext?
8. Welche Klassen gehören in die Kernontologie?
9. Welche Klassen werden branchenspezifische Erweiterungen?
10. Wie viele Testfälle sind für G3-Freigabe notwendig?
11. Wie werden historische Beobachtungen bei Klassenaggregation migriert?
12. Wie werden `deprecated` Klassen in Altanalysen behandelt?
13. Welche LossClasses werden später tatsächlich kennzahlenseitig genutzt?
14. Welche CauseClasses sind zu fein?
15. Welche Relationen werden nur dokumentarisch und welche maschinenlogisch verwendet?

---

# 40. Definition of Done für Ontologie v1.0

- [ ] alle Klassen besitzen stabile IDs
- [ ] alle Kernklassen besitzen normative Definitionen
- [ ] Parents und Fallbacks sind vollständig
- [ ] keine Hierarchiezyklen
- [ ] `PS_UNKNOWN` ist global zulässig
- [ ] LossClass separat modelliert
- [ ] CauseClass separat modelliert
- [ ] MeasureClass separat modelliert
- [ ] EvidenceType definiert
- [ ] ContextType definiert
- [ ] Provenienzmodell definiert
- [ ] Missingness-Modell definiert
- [ ] Relationen mit Domain/Range definiert
- [ ] Kardinalitätsregeln dokumentiert
- [ ] Constraint-Katalog vollständig
- [ ] kritische Abgrenzungsregeln dokumentiert
- [ ] Granularitätsprüfung abgeschlossen
- [ ] nicht trennbare Klassen aggregiert oder markiert
- [ ] Testfälle dokumentiert
- [ ] strukturelle Validierung bestanden
- [ ] fachlicher Review abgeschlossen
- [ ] technische Schema-Validierung bestanden
- [ ] Versionierungsregeln definiert
- [ ] Governanceprozess definiert
- [ ] Übergabe an AP2/AP3 dokumentiert

---

# 41. Übergabe an AP2

AP2 erhält stabile IDs, Beobachtungsfelder, Kontexttypen, Evidenzreferenzen, Missingness-Status, Ontologieversion und zulässige strukturierte Statusmerkmale.

AP2 darf keine Feinklasse erzwingen.

---

# 42. Übergabe an AP3

AP3 erhält:

```text
Klassenraum
+ Hierarchie
+ Fallbacks
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

# 43. Vorwirkung auf AP5

AP5 benötigt einen stabilen latenten Zustandsraum. AP1 muss dafür stabile Klassen-IDs, konsistente Hierarchien, dokumentierte Fallbacks, eindeutige Ontologieversionen und eine klare Trennung von Zustand, Evidenz und Ursache gewährleisten.

---

# 44. Ergebnisbild

Die Zielontologie ist keine maximal detaillierte Taxonomie, sondern eine **methodisch belastbare, beobachtungsnahe, versionierbare und unsicherheitsfähige Fachontologie**.

Der zentrale Qualitätsmaßstab lautet:

> **Kann jede modellierte Unterscheidung mit den vorgesehenen Evidenzkanälen fachlich begründet, beobachtet und bei unzureichender Evidenz sauber auf eine gröbere Ebene zurückgeführt werden?**

---

# 45. Quellenbasis und Status

Diese Ausarbeitung konkretisiert die in AP1 vorgesehenen Inhalte: ontologisches Fachmodell, Aktivitäts-, Verlust-, Ursachen- und Maßnahmenklassen, Relationen und Constraints, Beobachtungsschema und Granularitätsanalyse.

Die konkrete Klassenstruktur, IDs, Unterklassen, Relationstypen, Missingness-Status, Governance-Regeln und maschinenlesbaren Vorschläge sind **operative Arbeitsentwürfe**. Sie müssen innerhalb von AP1 anhand realer bzw. kontrollierter Beobachtungsfälle geprüft, angepasst und versioniert freigegeben werden.
