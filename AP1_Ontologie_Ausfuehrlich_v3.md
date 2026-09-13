# AP1 – Ontologie des Produktions- und Beobachtungsmodells

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP1 – Formale Modellierung des Produktions- und Beobachtungsmodells  
**Dokumenttyp:** Fachontologie / formale Spezifikation  
**Status:** Arbeitsentwurf v0.3  
**Zielversion:** v1.0  
**Primäre Nachfolger:** AP2, AP3, AP5  

---

# 1. Zweck

Die Ontologie definiert den fachlichen Zustandsraum für Beobachtung, Annotation und spätere probabilistische Modellierung. Sie soll nicht nur Klassen benennen, sondern auch Hierarchien, Relationen, Constraints, Fallbacks, Evidenzanforderungen, Kontextbezüge, Provenienz und Versionierung formal beschreiben.

Zentrale Ziele:

- Beobachtung und tatsächlichen Zustand strikt trennen.
- Produktionszustand, Verlust, Ursache und Maßnahme semantisch getrennt halten.
- mehrere Kandidatenklassen gleichzeitig zulassen.
- `UNKNOWN` bzw. Nicht-Identifizierbarkeit als reguläres Ergebnis modellieren.
- für Feinklassen Rückfallpfade auf gröbere Klassen bereitstellen.
- Evidenz aus Beobachtung, Memo, MES und ERP getrennt und provenancefähig modellieren.
- AP3 einen kontrollierten Kandidatenraum für probabilistische Annotation geben.
- AP5 einen stabilen Zustandsraum für latente Zustände bereitstellen.
- Änderungen versionierbar und auditierbar machen.

---

# 2. Abgrenzung

Die Ontologie **definiert** den fachlichen Möglichkeitsraum. Sie:

- berechnet keine Klassenwahrscheinlichkeiten,
- führt keine bayesianische Fusion durch,
- beweist keine Kausalität,
- bewertet keine Maßnahmenwirkung,
- priorisiert keine Maßnahmen,
- berechnet keine Kennzahlen.

Diese Aufgaben liegen in AP3, AP5, AP6, AP8 und AP9.

---

# 3. Zentrale Modelllogik

```text
reale Produktionssituation
        ↓
latenter tatsächlicher Zustand
        ↓
beobachtbare Evidenz
        ↓
zulässige Kandidatenklassen
        ↓
probabilistische Annotation / Abstain
```

Daraus folgen die Grundregeln:

```text
Observation ≠ ProductionState
Evidence ≠ Ground Truth
Cause ≠ ProductionState
Measure ≠ Cause
LossClass ≠ MeasureClass
```

---

# 4. Kompetenzfragen

Die Ontologie muss mindestens beantworten können:

1. Welche Produktionszustände sind zulässig?
2. Welche Ober- und Unterklassen besitzt ein Zustand?
3. Welche Fallbackklasse gilt bei zu geringer Evidenz?
4. Welche Verlustklassen passen zu einem Zustand?
5. Welche Ursachen sind fachlich möglich?
6. Welche Maßnahmen können eine Ursache grundsätzlich adressieren?
7. Welche Evidenz ist für eine Feinidentifikation hilfreich oder erforderlich?
8. Welcher Kontext wird für bestimmte Klassen benötigt?
9. Welche Klassen sind gegenseitig unvereinbar?
10. Welche Klassen dürfen parallel Kandidaten bleiben?
11. Welche Klassen sind nicht ausreichend trennbar und müssen aggregiert werden?
12. Welche Ontologieversion wurde in einer Analyse verwendet?

---

# 5. Namens- und ID-Konvention

| Präfix | Bedeutung |
|---|---|
| `PS_` | ProductionState |
| `LOSS_` | LossClass |
| `CAUSE_` | CauseClass |
| `MEASURE_` | MeasureClass |
| `EV_` | EvidenceType |
| `CTX_` | ContextType |
| `CON_` | Constraint |

IDs sind stabil, eindeutig, sprachunabhängig und dürfen nach Freigabe nicht wiederverwendet werden.

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

# 7. Pflichtattribute jeder Klasse

| Attribut | Pflicht | Beschreibung |
|---|---:|---|
| `id` | ja | stabile technische ID |
| `type` | ja | Entitätstyp |
| `label_de` | ja | deutsche Bezeichnung |
| `definition` | ja | normative Definition |
| `parent` | falls vorhanden | direkte Oberklasse |
| `granularity` | ja | G0–G3 |
| `status` | ja | Lebenszyklusstatus |
| `fallback_to` | bei G2/G3 | gröbere Klasse |
| `positive_examples` | empfohlen | Positivbeispiele |
| `negative_examples` | empfohlen | Abgrenzungsbeispiele |
| `possible_causes` | optional | zulässige Ursachen |
| `possible_losses` | optional | zulässige Verlusttypen |
| `useful_evidence` | optional | hilfreiche Evidenz |
| `required_context` | optional | benötigter Kontext |
| `introduced_in_version` | ja | Einführungsversion |

---

# 8. Granularitätsmodell

- **G0:** unbekannt / nicht identifizierbar
- **G1:** grobe Hauptzustandsklasse
- **G2:** fachliche Hauptklasse
- **G3:** Feinklasse

Grundregel:

> Je feiner eine Klasse, desto höher die Anforderungen an Trennschärfe und Evidenz.

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

# 10. Kernklassen – normative Definitionen

## PS_UNKNOWN
**Definition:** Zustand nicht ausreichend identifizierbar.  
**Status:** accepted.  
**Regel:** immer zulässig.

## PS_PRODUCTIVE
**Definition:** Unmittelbar produktive Tätigkeit gemäß definiertem Sollprozess.  
**Positive Beispiele:** Bearbeiten, Montieren, Fügen.  
**Negative Beispiele:** Warten, Nacharbeit, Reparatur.

## PS_NECESSARY_SUPPORT
**Definition:** notwendige, aber nicht unmittelbar produktive Tätigkeit.  
**Unterklassen:** Rüsten, Prüfen, notwendiger Transport, geplante Instandhaltung.

## PS_LOSS
**Definition:** Zustand mit verminderter Nutzung von Zeit, Leistung, Qualität oder Ressourcen gegenüber einem fachlich definierten Referenzzustand.

---

# 11. Warten – Feinklassen

## PS_WAIT_MATERIAL
Aktivität kann nicht fortgeführt werden, weil Material, Bauteil oder Hilfsstoff fehlt.

**Mögliche Ursachen:** Materialverfügbarkeit, Nachschub, Reihenfolgeplanung.  
**Hilfreiche Evidenz:** Beobachtung, Memo, ERP, Materialstatus.  
**Fallback:** `PS_WAITING`.

## PS_WAIT_INFORMATION
Information, Freigabe, Zeichnung oder Entscheidung fehlt.

## PS_WAIT_MACHINE
Maschine oder Anlage ist nicht verfügbar bzw. nicht betriebsbereit.

## PS_WAIT_PERSONNEL
Benötigte Person oder Rolle ist nicht verfügbar.

## PS_WAIT_PREVIOUS_PROCESS
Vorgelagerter Prozessschritt ist nicht abgeschlossen.

## PS_WAIT_QUALITY_RELEASE
Prozess wartet auf Qualitäts- oder Prüffreigabe.

---

# 12. Störung – Feinklassen

## PS_DISTURB_MACHINE
Technischer Fehler an Maschine, Anlage oder Werkzeug.

## PS_DISTURB_PROCESS
Prozessbezogene Störung ohne primären technischen Maschinenausfall.

## PS_DISTURB_SAFETY
Unterbrechung aufgrund eines Sicherheitsereignisses.

## PS_DISTURB_ENERGY
Unterbrechung aufgrund fehlender bzw. instabiler Energieversorgung.

## PS_DISTURB_IT_SYSTEM
Unterbrechung aufgrund eines IT-, System- oder Kommunikationsproblems.

---

# 13. Nacharbeit

- `PS_REWORK_INTERNAL` – Fehlerursprung im betrachteten Prozess.
- `PS_REWORK_EXTERNAL` – Fehlerursprung vorgelagert oder extern.
- `PS_REWORK_UNKNOWN_ORIGIN` – Ursprung nicht identifizierbar.

---

# 14. Ungeplante Instandhaltung

- `PS_MAINT_DIAGNOSIS` – Fehlersuche / Diagnose.
- `PS_MAINT_REPAIR` – aktive Reparatur.
- `PS_MAINT_TEST_RESTART` – Funktionsprüfung / Wiederanlauf.

---

# 15. Leistungsabweichung

- `PS_REDUCED_SPEED` – reduzierte Geschwindigkeit.
- `PS_MICROSTOP` – kurze ungeplante Unterbrechung.
- `PS_UNSTABLE_CYCLE` – schwankende bzw. instabile Zykluszeit.

Die quantitative Abgrenzung wird nicht in AP1 festgelegt, sondern nur semantisch vorbereitet.

---

# 16. Bewegungs-, Transport- und Suchverluste

## PS_UNNECESSARY_MOTION
Nicht notwendige Bewegung einer Person.

## PS_UNNECESSARY_TRANSPORT
Nicht notwendiger Material-, Produkt- oder Werkzeugtransport.

## PS_SEARCHING
Aktive Suche nach Ressource oder Information.

Unterklassen:

- `PS_SEARCH_MATERIAL`
- `PS_SEARCH_TOOL`
- `PS_SEARCH_INFORMATION`
- `PS_SEARCH_PERSON`

---

# 17. LossClass – Verlustontologie

- `LOSS_AVAILABILITY` – fehlende Verfügbarkeit
- `LOSS_PERFORMANCE` – reduzierte Leistung
- `LOSS_QUALITY` – Fehler, Ausschuss, Nacharbeit
- `LOSS_FLOW_WAIT` – Fluss-/Warteverlust
- `LOSS_CHANGEOVER` – Rüst-/Wechselverlust
- `LOSS_MOTION` – unnötige Bewegung
- `LOSS_TRANSPORT` – unnötiger Transport
- `LOSS_SEARCH` – Suchverlust
- `LOSS_INFORMATION` – Informationsverlust
- `LOSS_UNKNOWN` – Verlusttyp unbekannt

---

# 18. CauseClass – Ursachenontologie

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

# 19. MeasureClass – Maßnahmenontologie

- `MEASURE_MAINTENANCE`
- `MEASURE_PROCESS_STANDARDIZATION`
- `MEASURE_MATERIAL_LOGISTICS`
- `MEASURE_PLANNING_CONTROL`
- `MEASURE_QUALITY_ASSURANCE`
- `MEASURE_TRAINING`
- `MEASURE_WORK_ORGANIZATION`
- `MEASURE_LAYOUT_FLOW`
- `MEASURE_AUTOMATION`
- `MEASURE_DATA_MONITORING`
- `MEASURE_INFORMATION_COLLECTION`

`MEASURE_INFORMATION_COLLECTION` bildet bewusst zusätzliche Evidenzerhebung als legitime Handlungsoption ab.

---

# 20. EvidenceType

- `EV_OBSERVATION` – direkte Beobachtung
- `EV_MEMO` – Sprach-/Textmemo
- `EV_MES` – Maschinen-/MES-Evidenz
- `EV_ERP` – Auftrags-/Produkt-/Planungskontext
- `EV_DERIVED` – abgeleitete Evidenz

---

# 21. Evidenzqualität

Jede Evidenzinstanz sollte folgende Qualitätsdimensionen unterstützen:

| Dimension | Bedeutung |
|---|---|
| `availability` | Evidenz vorhanden? |
| `completeness` | vollständig / teilweise |
| `temporal_alignment` | zeitlich passend? |
| `source_reliability` | Quellzuverlässigkeit |
| `semantic_clarity` | semantische Eindeutigkeit |
| `linkage_quality` | Qualität der Verknüpfung |
| `observation_quality` | Qualität der Beobachtung |

---

# 22. ContextType

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

# 23. Provenienzmodell

Beispiel:

```yaml
provenance:
  source_type: EV_MES
  source_system: MES_A
  source_record_id: EVENT_12345
  captured_at: 2026-08-21T10:04:00+02:00
  transformation:
    - timestamp_normalization
  ontology_version: 0.3.0
```

---

# 24. Missingness-Modell

| Status | Bedeutung |
|---|---|
| `present` | Evidenz vorhanden |
| `missing_expected` | erwartet, aber fehlt |
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

# 25. Relationen

| Relation | Quelle | Ziel | Bedeutung |
|---|---|---|---|
| `subClassOf` | Klasse | Klasse | Hierarchie |
| `fallbackTo` | Klasse | Klasse | Rückfall |
| `mayRepresentLoss` | ProductionState | LossClass | möglicher Verlust |
| `mayHaveCause` | State/Loss | CauseClass | mögliche Ursache |
| `mayBeAddressedBy` | CauseClass | MeasureClass | mögliche Maßnahme |
| `usefulEvidence` | Klasse | EvidenceType | hilfreiche Evidenz |
| `requiresEvidence` | Klasse | EvidenceType | erforderliche Evidenz |
| `requiresContext` | Klasse | ContextType | benötigter Kontext |
| `incompatibleWith` | Klasse | Klasse | Unvereinbarkeit |
| `temporallyPrecedes` | State | State | zeitliche Folge |
| `occursInContext` | State/Observation | Context | Kontextbezug |

---

# 26. Kardinalitätsregeln

## Observation
Eine Beobachtung:

- hat genau eine ID,
- hat mindestens einen Zeitbezug,
- kann 0..n Evidenzen besitzen,
- kann 0..n Kandidatenklassen besitzen,
- referenziert genau eine Ontologieversion.

## ProductionState
Ein Zustand:

- hat genau eine stabile ID,
- genau eine Granularitätsstufe,
- 0..1 direkte Oberklasse,
- bei G2/G3 mindestens einen Fallback.

## Evidence
Eine Evidenz:

- hat genau einen Evidenztyp,
- genau eine Provenienz,
- mindestens einen Zeitbezug oder dokumentierte zeitliche Unschärfe.

---

# 27. Constraint-Katalog

- **CON-001:** `PS_UNKNOWN` muss immer zulässig sein.
- **CON-002:** Keine G3-Klasse darf zwingend ausgewählt werden.
- **CON-003:** Jede G3-Klasse benötigt einen Fallback.
- **CON-004:** `subClassOf` muss zyklusfrei sein.
- **CON-005:** ProductionState, LossClass, CauseClass und MeasureClass bleiben getrennt.
- **CON-006:** Jede Evidenz benötigt Provenienz.
- **CON-007:** Missingness muss explizit modelliert werden.
- **CON-008:** Missingness darf nicht als negatives Signal interpretiert werden.
- **CON-009:** Konfligierende Evidenz bleibt erhalten.
- **CON-010:** Jede Observation benötigt Zeitbezug.
- **CON-011:** Klassen mit `requiresContext` dürfen nur unter diesem Kontext fein ausgewertet werden.
- **CON-012:** Bei gleich plausiblen G3-Kandidaten muss G2 zulässig bleiben.
- **CON-013:** `mayHaveCause` ist keine Kausalitätsaussage.
- **CON-014:** `mayBeAddressedBy` ist keine Wirkungsgarantie.

---

# 28. Abgrenzungsregeln kritischer Klassen

## Warten vs. Suchen
**Warten:** Ressource fehlt; keine aktive Suche.  
**Suchen:** aktive Suche nach Ressource oder Information.

## Störung vs. Instandhaltung
**Störung:** ungeplantes Ereignis/Ausfallzustand.  
**Instandhaltung:** Diagnose, Reparatur oder Wiederherstellung.

## notwendiger vs. unnötiger Transport
**Notwendig:** Teil des Sollprozesses.  
**Unnötig:** durch vermeidbare Prozess-/Layoutgestaltung verursacht.

## Rüsten vs. Reparatur
**Rüsten:** geplante Umstellung.  
**Reparatur:** ungeplante Wiederherstellung.

## Nacharbeit vs. normale Bearbeitung
**Nacharbeit:** zusätzliche Bearbeitung wegen vorherigem Fehler.  
**Normal:** regulärer Sollprozess.

---

# 29. Ursache–Zustand–Maßnahme-Matrix

| Zustand | Verlust | mögliche Ursachen | mögliche Maßnahmen |
|---|---|---|---|
| Warten auf Material | LOSS_FLOW_WAIT | Material, Logistik, Planung | Materiallogistik, Planung |
| Warten auf Information | LOSS_INFORMATION | Information, Organisation | Planung, Arbeitsorganisation |
| Warten auf Maschine | LOSS_AVAILABILITY | Equipment, Planung | Instandhaltung, Planung |
| Maschinenstörung | LOSS_AVAILABILITY | Equipment | Instandhaltung |
| Prozessstörung | LOSS_FLOW_WAIT | Prozess, Material | Standardisierung, Qualität |
| Nacharbeit | LOSS_QUALITY | Prozess, Material, Inputqualität | Qualitätssicherung, Standardisierung |
| Materialsuche | LOSS_SEARCH | Logistik, Layout | Logistik, Layout |
| unnötige Bewegung | LOSS_MOTION | Layout, Methode | Layout, Standardisierung |
| Leistungsabweichung | LOSS_PERFORMANCE | Equipment, Prozess, Personal | Instandhaltung, Standardisierung, Training |

Diese Matrix beschreibt Zulässigkeiten, keine bewiesenen Wirkungen.

---

# 30. Granularitätsprüfung

Jede G3-Klasse wird vor Freigabe geprüft auf:

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

---

# 31. Maschinenlesbares Klassenbeispiel

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

introduced_in_version: 0.3.0
```

---

# 32. Beispiel einer Beobachtungsinstanz

```yaml
observation_id: OBS-2026-000184
observed_at: 2026-08-21T10:43:00+02:00
ontology_version: 0.3.0

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

# 33. Testfälle

## T-01 Eindeutiger Grobzustand
Maschine steht, Person wartet, Grund unbekannt.  
**Erwartung:** `PS_WAITING` und `PS_UNKNOWN`; keine erzwungene Feinklasse.

## T-02 Materialmangel
Beobachtung: Warten. Memo: „Material fehlt.“  
**Erwartung:** `PS_WAIT_MATERIAL` und `PS_WAITING`.

## T-03 Maschinenfehler und Reparatur
MES meldet Fehlercode, danach arbeitet Instandhalter an Maschine.  
**Erwartung:** zeitlich getrennt `PS_DISTURB_MACHINE` → `PS_MAINT_REPAIR`.

## T-04 Transport ohne Kontext
Person bewegt Material.  
**Erwartung:** `PS_NECESSARY_TRANSPORT` oder `PS_UNNECESSARY_TRANSPORT`; keine harte Entscheidung ohne Prozesskontext.

## T-05 Konflikt
Beobachtung sagt „Maschine steht“, MES sagt „läuft“.  
**Erwartung:** beide Evidenzen bleiben erhalten.

---

# 34. Validierung

## Strukturell
- IDs eindeutig
- keine Zyklen
- Parents gültig
- Fallbacks gültig
- keine verwaisten Klassen

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

---

# 35. Governance

Jede Ontologieänderung dokumentiert:

1. Änderungs-ID
2. betroffene Klasse
3. Änderungstyp
4. Begründung
5. Evidenz
6. Auswirkungen
7. Migrationsbedarf
8. Entscheidung
9. Freigabedatum
10. neue Ontologieversion

Empfohlene Rollen:

- Antragsteller
- fachlicher Reviewer
- technischer Reviewer
- Freigabeverantwortlicher

---

# 36. Versionierung

- **MAJOR:** inkompatible fachliche Änderung
- **MINOR:** kompatible Erweiterung
- **PATCH:** Dokumentationsänderung

Beispiel:

```text
0.1.0 Initialentwurf
0.2.0 Erweiterung Klassenraum
0.3.0 formale Constraints und Governance
1.0.0 freigegebene AP1-Ontologie
```

---

# 37. Branchenspezifische Erweiterbarkeit

Die Kernontologie soll generisch bleiben. Branchenmodule dürfen sie erweitern, aber nicht semantisch widersprechen.

Beispiel:

```text
core/
  PS_DISTURBANCE

extensions/automotive/
  PS_DISTURB_ANDON

extensions/process_industry/
  PS_DISTURB_CIP
```

---

# 38. Offene Designentscheidungen

Vor v1.0 sind mindestens zu klären:

1. Soll `PS_PRODUCTIVE` feiner untergliedert werden?
2. Wie werden Pausen behandelt?
3. Wie werden personenbezogene Unterbrechungen behandelt?
4. Bleibt Mikrostopp eigene Klasse?
5. Wie erfolgt die quantitative Schwelle zwischen Mikrostopp und Störung?
6. Welche G3-Klassen benötigen zwingend MES?
7. Welche benötigen ERP?
8. Welche Klassen gehören in die Kernontologie?
9. Welche Klassen sind branchenspezifische Erweiterungen?
10. Wie viele Testfälle werden für eine G3-Freigabe benötigt?
11. Wie werden historische Daten bei Klassenaggregation migriert?
12. Wie werden `deprecated` Klassen in Altanalysen behandelt?

---

# 39. Definition of Done für Ontologie v1.0

- [ ] stabile IDs für alle Klassen
- [ ] normative Definitionen vorhanden
- [ ] gültige Parent-Beziehungen
- [ ] keine Hierarchiezyklen
- [ ] Fallback für jede G3-Klasse
- [ ] `PS_UNKNOWN` immer zulässig
- [ ] getrennte Loss-, Cause- und Measure-Ontologie
- [ ] Evidenztypen definiert
- [ ] Kontexttypen definiert
- [ ] Provenienzmodell definiert
- [ ] Missingness-Modell definiert
- [ ] zentrale Relationen definiert
- [ ] Constraint-Katalog vollständig
- [ ] kritische Abgrenzungsregeln dokumentiert
- [ ] Granularitätsprüfung durchgeführt
- [ ] Testfälle dokumentiert
- [ ] strukturelle Validierung bestanden
- [ ] fachlicher Review durchgeführt
- [ ] maschinenlesbare Struktur vorbereitet
- [ ] Versionierungsregeln definiert
- [ ] Übergabe an AP2/AP3 dokumentiert

---

# 40. Übergabe an AP2

AP2 erhält:

- IDs
- Statusmerkmale
- Beobachtungsfelder
- Kontexttypen
- Evidenzreferenzen
- Missingness-Status
- Ontologieversion

AP2 darf keine Feinklasse erzwingen.

---

# 41. Übergabe an AP3

AP3 erhält:

```text
Klassenraum
+ Hierarchie
+ Fallbacks
+ Constraints
+ Evidenztypen
+ Kontextbedingungen
+ Positiv-/Negativbeispiele
```

AP3 erzeugt daraus:

```text
P(Klasse | Evidenz)
oder
Abstain
```

---

# 42. Vorwirkung auf AP5

AP5 benötigt:

- stabilen Zustandsraum
- stabile IDs
- dokumentierte Fallbacks
- Ontologieversion
- klare Trennung Zustand/Evidenz
- klare Trennung Zustand/Ursache

---

# 43. Ergebnisbild

Die Zielontologie ist nicht die maximal detaillierte Ontologie, sondern eine **methodisch belastbare, beobachtungsnahe, versionierbare und unsicherheitsfähige Fachontologie**.

Der wichtigste Qualitätsmaßstab lautet:

> **Kann jede modellierte Unterscheidung mit den vorgesehenen Evidenzkanälen fachlich begründet, beobachtet und bei unzureichender Evidenz sauber auf eine gröbere Ebene zurückgeführt werden?**

---

# 44. Quellenbasis und Status

Diese Ausarbeitung konkretisiert die in AP1 vorgesehenen Inhalte: ontologisches Fachmodell, Aktivitäts-, Verlust-, Ursachen- und Maßnahmenklassen, Relationen, Constraints, Beobachtungsschema und Granularitätsanalyse.

Die konkrete Klassenstruktur, IDs, Unterklassen, Relationstypen, Missingness-Status, Governance-Regeln und Maschinenlesbarkeitsvorschläge sind **operative Arbeitsentwürfe**. Sie müssen innerhalb von AP1 anhand realer bzw. kontrollierter Beobachtungsfälle geprüft, angepasst und versioniert freigegeben werden.
