# AP1 – Ausführliche Ontologie des Produktions- und Beobachtungsmodells

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP1 – Formale Modellierung des Produktions- und Beobachtungsmodells  
**Dokumenttyp:** Ausführliche Ontologie / Fachmodell  
**Status:** Arbeitsentwurf v0.2  
**Zweck:** Fachliche, formale und maschinenlesbar strukturierbare Grundlage für AP2, AP3 und später AP5

---

# 1. Zielsetzung der Ontologie

Die Ontologie definiert den fachlichen Zustandsraum des Vorhabens. Sie beschreibt, welche Produktionszustände, Verlustarten, Ursachen, Maßnahmen, Evidenztypen und Kontextinformationen im weiteren Projekt unterschieden werden sollen und wie diese Begriffe formal miteinander in Beziehung stehen.

Im Mittelpunkt steht dabei nicht die möglichst feine Beschreibung der Produktion, sondern eine **unsicherheitsbewusste und beobachtungsnahe Modellierung**.

Die Ontologie soll insbesondere sicherstellen, dass:

- Beobachtung und tatsächlicher Zustand strikt getrennt bleiben,
- mehrere Kandidatenklassen gleichzeitig zulässig sind,
- nicht identifizierbare Fälle explizit abgebildet werden,
- Klassen hierarchisch organisiert sind,
- feine Klassen auf gröbere Klassen zurückfallen können,
- Beziehungen zwischen Verlust, Ursache und Maßnahme formal beschrieben werden,
- Evidenzkanäle und Provenienz getrennt bleiben,
- AP3 einen formal definierten Kandidatenraum für die probabilistische Annotation erhält,
- AP5 später einen klar definierten Zustandsraum für latente Produktionszustände erhält.

---

# 2. Fachliche Grundidee

Die Ontologie basiert auf folgender Trennung:

```text
reale Produktionssituation
        ↓
latenter tatsächlicher Zustand
        ↓
beobachtbare Evidenz
        ↓
mögliche Kandidatenklassen
        ↓
probabilistische Annotation
```

Eine Beobachtung ist damit nie automatisch die Wahrheit.

Beispiel:

```text
Beobachtung:
Maschine steht.
Mitarbeiter steht daneben.

Mögliche Zustände:
- Warten
- Störung
- ungeplante Instandhaltung
- unbekannt
```

Erst zusätzliche Evidenz kann den Kandidatenraum weiter einschränken.

---

# 3. Ontologische Ebenen

Die Ontologie wird in sechs fachliche Ebenen gegliedert:

1. **ProductionState** – Produktions- und Aktivitätszustände
2. **LossClass** – Verlustarten
3. **CauseClass** – mögliche Ursachen
4. **MeasureClass** – mögliche Maßnahmen
5. **EvidenceType** – Evidenzquellen
6. **ContextType** – Kontextinformationen

Ergänzend werden folgende Metaobjekte definiert:

- `Constraint`
- `GranularityLevel`
- `Provenance`
- `Observation`
- `SamplingContext`

---

# 4. Granularitätsmodell

## 4.1 Granularitätsstufen

Die Ontologie verwendet vier Granularitätsstufen.

### G0 – Nicht identifizierbar
Keine belastbare fachliche Zuordnung möglich.

Beispiel: `PS_UNKNOWN`

### G1 – Hauptzustandsklasse
Sehr grobe Zustandsfamilie.

Beispiele:
- `PS_PRODUCTIVE`
- `PS_NECESSARY_SUPPORT`
- `PS_LOSS`

### G2 – fachliche Hauptklasse
Mittlere Granularität.

Beispiele:
- `PS_WAITING`
- `PS_SETUP`
- `PS_REWORK`
- `PS_DISTURBANCE`

### G3 – Feinklasse
Detaillierte Klasse.

Beispiele:
- `PS_WAIT_MATERIAL`
- `PS_WAIT_INFORMATION`
- `PS_DISTURB_MACHINE`

---

# 5. Fallback-Logik

Die Ontologie muss immer eine gröbere Alternative bereitstellen.

```text
PS_WAIT_MATERIAL
      ↓
PS_WAITING
      ↓
PS_LOSS
      ↓
PS_UNKNOWN
```

Damit kann die spätere Modellkette abhängig von der Evidenz unterschiedlich fein arbeiten.

---

# 6. Hauptklasse ProductionState

`ProductionState` beschreibt den fachlichen Zustand einer beobachteten oder latenten Produktionssituation.

---

# 7. ProductionState – G0

## PS_UNKNOWN

**Label:** Unbekannt / nicht ausreichend identifizierbar  
**Typ:** ProductionState  
**Granularität:** G0  
**Parent:** keiner

### Definition
Der tatsächliche Zustand kann mit der verfügbaren Evidenz nicht ausreichend bestimmt werden.

### Typische Gründe
- schlechte Beobachtbarkeit,
- zu kurze Beobachtung,
- fehlende Evidenz,
- widersprüchliche Evidenz,
- Klasse in der Ontologie nicht ausreichend repräsentiert,
- mehrere gleich plausible Kandidaten.

### Verwendung
`PS_UNKNOWN` ist immer zulässig.

---

# 8. ProductionState – G1

## 8.1 PS_PRODUCTIVE

**Label:** Produktiver Zustand  
**Granularität:** G1

### Definition
Zustand, in dem unmittelbar eine für den Produktionszweck vorgesehene wertschöpfende oder direkte produktive Tätigkeit ausgeführt wird.

### Positive Beispiele
- Bearbeitung eines Werkstücks
- Montage eines Bauteils
- Schweißen
- Bohren
- Fräsen

### Negative Beispiele
- Warten
- Prüfen
- Rüsten
- Nacharbeit
- ungeplante Reparatur

### Fallback
`PS_UNKNOWN`

## 8.2 PS_NECESSARY_SUPPORT

**Label:** Notwendige unterstützende Tätigkeit  
**Granularität:** G1

### Definition
Tätigkeit, die zur Durchführung der Produktion erforderlich ist, selbst aber nicht als direkte wertschöpfende Aktivität betrachtet wird.

### Typische Unterklassen
- Rüsten
- Prüfen
- notwendiger Transport
- geplante Unterstützung
- geplante Instandhaltung

### Fallback
`PS_UNKNOWN`

## 8.3 PS_LOSS

**Label:** Verlustzustand  
**Granularität:** G1

### Definition
Zustand, in dem der erwartete Produktionsfluss, die Leistung oder die Qualität beeinträchtigt ist.

### Typische Unterklassen
- Warten
- Störung
- Nacharbeit
- ungeplante Instandhaltung
- Leistungsabweichung
- unnötige Bewegung

### Fallback
`PS_UNKNOWN`

---

# 9. ProductionState – G2: notwendige Unterstützung

## 9.1 PS_SETUP

**Label:** Rüsten / Umstellen  
**Parent:** `PS_NECESSARY_SUPPORT`

### Definition
Geplante Umstellung oder Vorbereitung von Maschine, Anlage, Arbeitsplatz oder Prozess.

### Positive Beispiele
- Werkzeugwechsel
- Formatwechsel
- Einrichten einer Maschine
- Produktwechsel vorbereiten

### Negative Beispiele
- Reparatur nach Störung
- Materialsuche
- Warten

### mögliche Evidenz
- Beobachtung
- Memo
- MES-Status
- Auftrag / ERP-Kontext

### Fallback
`PS_NECESSARY_SUPPORT`

## 9.2 PS_INSPECTION

**Label:** Prüfen / Kontrollieren  
**Parent:** `PS_NECESSARY_SUPPORT`

### Definition
Geplante Prüfung eines Produkts, Prozesses oder Betriebsmittels.

### Beispiele
- Maßprüfung
- Sichtprüfung
- Qualitätsprüfung
- Prozessfreigabe

### Negative Beispiele
- Nacharbeit
- Fehlersuche
- Reparatur

### Fallback
`PS_NECESSARY_SUPPORT`

## 9.3 PS_NECESSARY_TRANSPORT

**Label:** notwendiger Transport  
**Parent:** `PS_NECESSARY_SUPPORT`

### Definition
Transport oder Bewegung, der für den vorgesehenen Produktionsablauf erforderlich ist.

### Beispiele
- Materialtransport zwischen zwei Prozessschritten
- Transport zum definierten Puffer
- notwendige Werkzeugbereitstellung

### Abgrenzung
Nicht jeder Transport ist automatisch notwendig.

### Fallback
`PS_NECESSARY_SUPPORT`

## 9.4 PS_PLANNED_MAINTENANCE

**Label:** geplante Instandhaltung  
**Parent:** `PS_NECESSARY_SUPPORT`

### Definition
Geplante Wartungs- oder Instandhaltungsaktivität zur Sicherstellung der Anlagenverfügbarkeit.

### Beispiele
- planmäßiger Filterwechsel
- turnusmäßige Wartung
- geplante Inspektion

### Fallback
`PS_NECESSARY_SUPPORT`

## 9.5 PS_PLANNED_SUPPORT

**Label:** sonstige geplante Unterstützung  
**Parent:** `PS_NECESSARY_SUPPORT`

### Definition
Notwendige geplante Unterstützung, die keiner spezifischeren Klasse zugeordnet werden kann.

---

# 10. ProductionState – G2: Verlustzustände

## 10.1 PS_WAITING

**Label:** Warten  
**Parent:** `PS_LOSS`

### Definition
Ein geplanter Prozessschritt kann nicht fortgeführt werden, weil eine notwendige Voraussetzung fehlt.

### Beispiele
- Warten auf Material
- Warten auf Information
- Warten auf Maschine
- Warten auf Personal

### Fallback
`PS_LOSS`

## 10.2 PS_DISTURBANCE

**Label:** Störung / ungeplante Unterbrechung  
**Parent:** `PS_LOSS`

### Definition
Ungeplante Unterbrechung des vorgesehenen Produktionsablaufs.

### Beispiele
- Maschinenfehler
- Prozessabbruch
- Sicherheitsstopp
- ungeplante Blockierung

### Fallback
`PS_LOSS`

## 10.3 PS_REWORK

**Label:** Nacharbeit  
**Parent:** `PS_LOSS`

### Definition
Zusätzliche Bearbeitung zur Korrektur eines bereits entstandenen Fehlers oder Qualitätsproblems.

### Beispiele
- erneutes Bohren
- Nachschleifen
- Korrekturmontage

### Fallback
`PS_LOSS`

## 10.4 PS_UNPLANNED_MAINTENANCE

**Label:** ungeplante Instandhaltung / Reparatur  
**Parent:** `PS_LOSS`

### Definition
Ungeplante technische Aktivität zur Wiederherstellung der Funktionsfähigkeit.

### Beispiele
- Reparatur
- Austausch defekter Bauteile
- Fehlersuche nach Ausfall

### Fallback
`PS_LOSS`

## 10.5 PS_PERFORMANCE_DEVIATION

**Label:** Leistungsabweichung  
**Parent:** `PS_LOSS`

### Definition
Zustand, in dem die Produktion grundsätzlich läuft, aber unter dem erwarteten Leistungsniveau.

### Beispiele
- reduzierte Geschwindigkeit
- Mikrostopps
- instabiler Takt
- verlangsamte Bedienung

### Fallback
`PS_LOSS`

## 10.6 PS_UNNECESSARY_MOTION

**Label:** vermeidbare Bewegung  
**Parent:** `PS_LOSS`

### Definition
Nicht notwendige Bewegung von Personen.

### Beispiele
- unnötige Laufwege
- Werkzeug suchen
- wiederholtes Hin- und Herlaufen

### Fallback
`PS_LOSS`

## 10.7 PS_UNNECESSARY_TRANSPORT

**Label:** vermeidbarer Transport  
**Parent:** `PS_LOSS`

### Definition
Nicht notwendiger oder vermeidbarer Material- oder Objekttransport.

### Beispiele
- Doppeltransport
- Zwischenlagerung ohne Prozessnotwendigkeit
- unnötige Umlagerung

### Fallback
`PS_LOSS`

## 10.8 PS_SEARCHING

**Label:** Suchen  
**Parent:** `PS_LOSS`

### Definition
Zeitverlust durch Suche nach Material, Werkzeug, Dokumentation oder Information.

### mögliche Feinklassen
- Materialsuche
- Werkzeugsuche
- Informationssuche

### Fallback
`PS_LOSS`

---

# 11. ProductionState – G3: Warten

## 11.1 PS_WAIT_MATERIAL

**Label:** Warten auf Material  
**Parent:** `PS_WAITING`

### Definition
Eine Aktivität kann nicht fortgeführt werden, weil Material oder Bauteile fehlen.

### Positive Beispiele
- Materialbehälter leer
- Bauteile fehlen
- vorgelagerter Prozess liefert nicht

### Negative Beispiele
- Material ist vorhanden, aber Maschine gestört

### mögliche Evidenz
- direkte Beobachtung
- Memo
- ERP
- Logistikstatus

### mögliche Ursachen
- `CAUSE_MATERIAL`
- `CAUSE_LOGISTICS`
- `CAUSE_PLANNING_INFORMATION`

### Fallback
`PS_WAITING`

## 11.2 PS_WAIT_INFORMATION

**Label:** Warten auf Information  
**Parent:** `PS_WAITING`

### Definition
Fortsetzung nicht möglich, weil Information, Freigabe oder Entscheidung fehlt.

### Beispiele
- fehlende Zeichnung
- fehlende Freigabe
- Rückfrage zur Arbeitsanweisung

### mögliche Ursachen
- `CAUSE_PLANNING_INFORMATION`
- `CAUSE_ORGANIZATION_PERSONNEL`

### Fallback
`PS_WAITING`

## 11.3 PS_WAIT_MACHINE

**Label:** Warten auf Maschine / Anlage  
**Parent:** `PS_WAITING`

### Definition
Eine Aktivität wartet auf die Verfügbarkeit oder Betriebsbereitschaft einer Maschine.

### mögliche Ursachen
- `CAUSE_EQUIPMENT`
- `CAUSE_PLANNING_INFORMATION`

### Fallback
`PS_WAITING`

## 11.4 PS_WAIT_PERSONNEL

**Label:** Warten auf Personal  
**Parent:** `PS_WAITING`

### Definition
Eine Aktivität kann nicht fortgeführt werden, weil eine notwendige Person oder Rolle nicht verfügbar ist.

### Beispiele
- Warten auf Instandhalter
- Warten auf Prüfer
- Warten auf Freigabe

### mögliche Ursachen
- `CAUSE_ORGANIZATION_PERSONNEL`

### Fallback
`PS_WAITING`

## 11.5 PS_WAIT_PREVIOUS_PROCESS

**Label:** Warten auf vorgelagerten Prozess  
**Parent:** `PS_WAITING`

### Definition
Ein Prozessschritt kann nicht fortgeführt werden, weil ein vorgelagerter Prozess noch nicht abgeschlossen ist.

### mögliche Ursachen
- `CAUSE_PLANNING_INFORMATION`
- `CAUSE_METHOD_PROCESS`
- `CAUSE_LOGISTICS`

### Fallback
`PS_WAITING`

---

# 12. ProductionState – G3: Störungen

## 12.1 PS_DISTURB_MACHINE

**Label:** Maschinenstörung  
**Parent:** `PS_DISTURBANCE`

### Definition
Technisch verursachte ungeplante Unterbrechung einer Maschine oder Anlage.

### Evidenz
- MES-Fehlercode
- Maschinenstatus
- Memo
- Beobachtung

### Ursache
- `CAUSE_EQUIPMENT`

### Fallback
`PS_DISTURBANCE`

## 12.2 PS_DISTURB_PROCESS

**Label:** Prozessstörung  
**Parent:** `PS_DISTURBANCE`

### Definition
Ungeplante Unterbrechung aufgrund eines Prozessproblems ohne primären technischen Maschinenausfall.

### mögliche Ursachen
- `CAUSE_METHOD_PROCESS`
- `CAUSE_MATERIAL`

## 12.3 PS_DISTURB_SAFETY

**Label:** sicherheitsbedingte Unterbrechung  
**Parent:** `PS_DISTURBANCE`

### Definition
Unterbrechung aufgrund einer sicherheitsbezogenen Situation.

### Fallback
`PS_DISTURBANCE`

---

# 13. ProductionState – G3: Nacharbeit

## 13.1 PS_REWORK_INTERNAL
Nacharbeit aufgrund eines innerhalb des betrachteten Prozesses entstandenen Fehlers.

## 13.2 PS_REWORK_EXTERNAL
Nacharbeit aufgrund eines vorgelagerten oder externen Fehlers.

## 13.3 PS_REWORK_UNKNOWN_ORIGIN
Nacharbeit, deren Fehlerursprung nicht bestimmt werden kann.

---

# 14. ProductionState – G3: Suchen

## 14.1 PS_SEARCH_MATERIAL
Suche nach Material oder Bauteilen.

## 14.2 PS_SEARCH_TOOL
Suche nach Werkzeugen oder Hilfsmitteln.

## 14.3 PS_SEARCH_INFORMATION
Suche nach Informationen, Dokumentation oder Anweisungen.

---

# 15. Verlustklassen

## LOSS_AVAILABILITY
Verlust aufgrund fehlender Verfügbarkeit einer notwendigen Ressource.

## LOSS_PERFORMANCE
Verlust durch verringerte Produktionsleistung.

## LOSS_QUALITY
Verlust durch Fehler und Nacharbeit.

## LOSS_FLOW_WAIT
Verlust durch Unterbrechung des Produktionsflusses.

## LOSS_CHANGEOVER
Verlust im Zusammenhang mit Rüst- und Wechselvorgängen.

## LOSS_MOTION
Verlust durch unnötige Bewegung.

## LOSS_TRANSPORT
Verlust durch unnötigen Transport.

## LOSS_SEARCH
Verlust durch Suchaktivitäten.

## LOSS_UNKNOWN
Verlust vorhanden, Typ nicht eindeutig bestimmbar.

---

# 16. Ursachenklassen

## CAUSE_EQUIPMENT
Maschine, Anlage, Werkzeug oder technische Komponente.

**Unterklassen:** Maschinenfehler, Werkzeugverschleiß, Sensorfehler, Steuerungsfehler.

## CAUSE_MATERIAL
Material oder Bauteil als Ursache.

**Unterklassen:** Material fehlt, Material fehlerhaft, Material ungeeignet.

## CAUSE_METHOD_PROCESS
Arbeitsmethode oder Prozessgestaltung.

**Unterklassen:** ungeeigneter Standard, instabiler Prozess, unnötiger Prozessschritt, fehlerhafte Reihenfolge.

## CAUSE_PLANNING_INFORMATION
Planung oder Informationsfluss.

**Unterklassen:** fehlende Freigabe, falsche Planung, fehlende Information, unklare Priorität.

## CAUSE_QUALITY_INPUT
Fehlerhaftes Eingangsmaterial oder fehlerhafte Vorleistung.

## CAUSE_LOGISTICS
Materialfluss oder Bereitstellung.

**Unterklassen:** verspätete Bereitstellung, falscher Bereitstellort, fehlender Nachschub.

## CAUSE_ORGANIZATION_PERSONNEL
Organisation oder Personal.

**Unterklassen:** fehlende Qualifikation, fehlende Person, unklare Zuständigkeit, ungünstige Personaleinsatzplanung.

## CAUSE_LAYOUT
Layout oder Arbeitsplatzgestaltung.

## CAUSE_EXTERNAL
Externe Einflüsse.

## CAUSE_UNKNOWN
Ursache nicht identifizierbar.

---

# 17. Maßnahmenklassen

## MEASURE_MAINTENANCE
Wartung, Instandhaltung und technische Stabilisierung.

## MEASURE_PROCESS_STANDARDIZATION
Standardisierung und Prozessgestaltung.

## MEASURE_MATERIAL_LOGISTICS
Verbesserung von Materialbereitstellung und Logistik.

## MEASURE_PLANNING_CONTROL
Verbesserung von Planung, Reihenfolge und Informationsfluss.

## MEASURE_QUALITY_ASSURANCE
Qualitätsprävention und Qualitätsprüfung.

## MEASURE_TRAINING
Schulung und Qualifikation.

## MEASURE_WORK_ORGANIZATION
Arbeitsorganisation, Rollen und Personaleinsatz.

## MEASURE_LAYOUT_FLOW
Layout- und Materialflussverbesserung.

## MEASURE_AUTOMATION
Automatisierung und technische Unterstützung.

## MEASURE_DATA_MONITORING
Mess- und Monitoringlösungen.

## MEASURE_INFORMATION_COLLECTION
Gezielte zusätzliche Evidenzerhebung. Diese Klasse ist besonders wichtig für spätere Value-of-Information-Entscheidungen.

---

# 18. Evidenztypen

## EV_OBSERVATION
Direkte Beobachtung im Rahmen der Multimomentaufnahme.

**Mögliche Attribute:** Sichtbarkeit, Beobachtungsdauer, Beobachter, Sicherheit, strukturierte Merkmale.

## EV_MEMO
Sprach- oder Textmemo.

## EV_MES
MES-/Maschinenevidenz wie Maschinenstatus, Fehlercode, Start-/Stoppereignis, Takt oder Geschwindigkeit.

## EV_ERP
ERP-Kontext wie Auftrag, Produkt, Menge, Status, Termin oder Arbeitsplan.

## EV_DERIVED
Aus vorhandenen Daten abgeleitete Evidenz, z. B. Zeitdifferenz, erkannte Sequenz oder aggregierter Maschinenzustand.

---

# 19. Kontexttypen

- `CTX_SITE` – Standort
- `CTX_AREA` – Produktionsbereich
- `CTX_LINE` – Produktionslinie
- `CTX_WORKCENTER` – Arbeitsplatz
- `CTX_MACHINE` – Maschine oder Anlage
- `CTX_ORDER` – Auftrag
- `CTX_PRODUCT` – Produkt
- `CTX_VARIANT` – Produktvariante
- `CTX_PROCESS_STEP` – Prozessschritt
- `CTX_SHIFT` – Schicht
- `CTX_OPERATOR_ROLE` – Rolle der beobachteten Person
- `CTX_TIME` – zeitlicher Kontext
- `CTX_SAMPLING_STRATUM` – Stichprobenschicht
- `CTX_SAMPLING_CLUSTER` – Stichprobencluster

---

# 20. Relationen

## subClassOf
Hierarchische Unterordnung.

```text
PS_WAIT_MATERIAL subClassOf PS_WAITING
```

## fallbackTo
Rückfallbeziehung.

```text
PS_WAIT_MATERIAL fallbackTo PS_WAITING
```

## mayRepresentLoss

```text
PS_WAITING mayRepresentLoss LOSS_FLOW_WAIT
```

## mayHaveCause

```text
PS_WAIT_MATERIAL mayHaveCause CAUSE_LOGISTICS
```

## mayBeAddressedBy

```text
CAUSE_LOGISTICS mayBeAddressedBy MEASURE_MATERIAL_LOGISTICS
```

## requiresEvidence

```text
PS_DISTURB_MACHINE requiresEvidence EV_MES
```

## usefulEvidence
Schwächere Beziehung als `requiresEvidence`.

```text
PS_WAIT_MATERIAL usefulEvidence EV_ERP
```

## requiresContext

```text
PS_WAIT_INFORMATION requiresContext CTX_ORDER
```

## incompatibleWith

```text
PS_PRODUCTIVE incompatibleWith PS_WAITING
```

für denselben Beobachtungsgegenstand zum selben Zeitpunkt.

## precedes / follows
Optional für spätere Sequenzmodellierung.

```text
PS_DISTURB_MACHINE precedes PS_UNPLANNED_MAINTENANCE
```

---

# 21. Ursache-Zustand-Maßnahme-Matrix

| Zustand | Verlust | mögliche Ursachen | mögliche Maßnahmen |
|---|---|---|---|
| Warten auf Material | Fluss-/Warteverlust | Material, Logistik, Planung | Materiallogistik, Planung |
| Warten auf Information | Fluss-/Warteverlust | Planung, Organisation | Planung, Arbeitsorganisation |
| Warten auf Maschine | Verfügbarkeit | Maschine, Planung | Instandhaltung, Planung |
| Maschinenstörung | Verfügbarkeit | Equipment | Instandhaltung |
| Prozessstörung | Verfügbarkeit/Fluss | Prozess, Material | Standardisierung, Qualität |
| Nacharbeit | Qualität | Prozess, Qualität Input | Qualitätssicherung, Standardisierung |
| Suche Material | Suchverlust | Logistik, Layout | Materiallogistik, Layout |
| unnötige Bewegung | Bewegungsverlust | Layout, Methode | Layout, Standardisierung |
| Leistungsabweichung | Leistungsverlust | Equipment, Prozess, Personal | Instandhaltung, Standardisierung, Schulung |

Diese Matrix beschreibt fachlich mögliche Zusammenhänge, keine kausal bewiesenen Wirkungen.

---

# 22. Ontologischer Klassenbaum

```text
ProductionState
│
├── PS_UNKNOWN
│
├── PS_PRODUCTIVE
│
├── PS_NECESSARY_SUPPORT
│   ├── PS_SETUP
│   ├── PS_INSPECTION
│   ├── PS_NECESSARY_TRANSPORT
│   ├── PS_PLANNED_MAINTENANCE
│   └── PS_PLANNED_SUPPORT
│
└── PS_LOSS
    ├── PS_WAITING
    │   ├── PS_WAIT_MATERIAL
    │   ├── PS_WAIT_INFORMATION
    │   ├── PS_WAIT_MACHINE
    │   ├── PS_WAIT_PERSONNEL
    │   └── PS_WAIT_PREVIOUS_PROCESS
    │
    ├── PS_DISTURBANCE
    │   ├── PS_DISTURB_MACHINE
    │   ├── PS_DISTURB_PROCESS
    │   └── PS_DISTURB_SAFETY
    │
    ├── PS_REWORK
    │   ├── PS_REWORK_INTERNAL
    │   ├── PS_REWORK_EXTERNAL
    │   └── PS_REWORK_UNKNOWN_ORIGIN
    │
    ├── PS_UNPLANNED_MAINTENANCE
    ├── PS_PERFORMANCE_DEVIATION
    ├── PS_UNNECESSARY_MOTION
    ├── PS_UNNECESSARY_TRANSPORT
    └── PS_SEARCHING
        ├── PS_SEARCH_MATERIAL
        ├── PS_SEARCH_TOOL
        └── PS_SEARCH_INFORMATION
```

---

# 23. Granularitätsprüfung

Jede G3-Klasse wird systematisch bewertet anhand von:

1. Beobachtbarkeit
2. semantischer Trennschärfe
3. Verfügbarkeit zusätzlicher Evidenz
4. Sparsity-Robustheit
5. fachlicher Relevanz
6. Definitionsstabilität
7. Fallback-Fähigkeit
8. erwartbarer Häufigkeit
9. Datenverknüpfbarkeit
10. Nutzen für spätere Maßnahmenentscheidungen

---

# 24. Statusmodell für Klassen

| Status | Bedeutung |
|---|---|
| `draft` | erster Entwurf |
| `candidate` | Kandidat für Prüfung |
| `accepted` | freigegeben |
| `accepted_with_constraints` | unter Bedingungen freigegeben |
| `aggregated` | in gröbere Klasse integriert |
| `rejected` | verworfen |
| `deprecated` | nicht mehr verwenden |

---

# 25. Maschinenlesbare Klassendefinition

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
  werden kann, weil benötigtes Material oder ein benötigtes
  Bauteil nicht verfügbar ist.

positive_examples:
  - Materialbehälter leer.
  - Bauteil noch nicht bereitgestellt.

negative_examples:
  - Mitarbeiter wartet auf Freigabe.
  - Maschine technisch gestört.

possible_loss_classes:
  - LOSS_FLOW_WAIT
  - LOSS_AVAILABILITY

possible_causes:
  - CAUSE_MATERIAL
  - CAUSE_LOGISTICS
  - CAUSE_PLANNING_INFORMATION

useful_evidence:
  - EV_OBSERVATION
  - EV_MEMO
  - EV_ERP
  - EV_MES

required_context:
  - CTX_PROCESS_STEP

notes:
  - Feinklasse nur verwenden, wenn Materialbezug ausreichend belegt ist.
```

---

# 26. Constraints

- **CON-001:** `PS_UNKNOWN` muss immer zulässig sein.
- **CON-002:** Keine G3-Klasse darf zwingend ausgewählt werden.
- **CON-003:** Jede G3-Klasse benötigt einen Fallback.
- **CON-004:** Klassenhierarchie muss zyklusfrei sein.
- **CON-005:** ProductionState, CauseClass und MeasureClass müssen getrennt bleiben.
- **CON-006:** Jede Evidenz muss eine Provenienz besitzen.
- **CON-007:** Missingness muss explizit repräsentiert werden.
- **CON-008:** Fehlende Evidenz darf nicht automatisch negativ interpretiert werden.
- **CON-009:** Konfligierende Evidenz darf erhalten bleiben.
- **CON-010:** Zeitbezug muss dokumentiert sein.
- **CON-011:** Eine Feinklasse darf nur genutzt werden, wenn ihre Abgrenzungsbedingungen erfüllt sind.
- **CON-012:** Falls mehrere G3-Kandidaten gleich plausibel sind, muss G2 zulässig bleiben.

---

# 27. Beispielhafte Beobachtungsfälle

## Fall A – Maschine steht, Mitarbeiter wartet

Kandidaten:
- PS_WAITING
- PS_DISTURBANCE
- PS_UNPLANNED_MAINTENANCE
- PS_UNKNOWN

Nicht automatisch zulässig:
- PS_WAIT_MATERIAL

## Fall B – Memo enthält „Material fehlt“

Kandidaten:
- PS_WAIT_MATERIAL
- PS_WAITING

Evidenz:
- EV_OBSERVATION
- EV_MEMO

## Fall C – MES meldet Fehlercode

Kandidaten:
- PS_DISTURB_MACHINE
- PS_UNPLANNED_MAINTENANCE

Abgrenzung über zeitlichen Verlauf:

```text
Fehlerereignis → Störung
Reparaturtätigkeit → ungeplante Instandhaltung
```

## Fall D – Mitarbeiter transportiert Material

Kandidaten:
- PS_NECESSARY_TRANSPORT
- PS_UNNECESSARY_TRANSPORT

Benötigter Kontext:
- Prozessschritt
- Materialfluss
- Zielort

---

# 28. Offene Ontologiefragen

Vor Version 1.0 müssen insbesondere geprüft werden:

1. Soll `PS_PRODUCTIVE` weiter differenziert werden?
2. Wie wird geplante Pause klassifiziert?
3. Wie werden persönliche Unterbrechungen behandelt?
4. Ist Rüsten immer notwendige Unterstützung?
5. Wann wird Rüsten als Verlust bewertet?
6. Wird Mikrostopp eigene Klasse?
7. Wie wird Materialsuche vs. Materialwarten abgegrenzt?
8. Wie wird Prozessstörung vs. Maschinenstörung abgegrenzt?
9. Welche Klassen benötigen zwingend MES?
10. Welche Klassen benötigen ERP?
11. Welche G3-Klassen sind branchenübergreifend sinnvoll?
12. Welche Klassen sollten branchenspezifische Erweiterungen sein?

---

# 29. Ontologie-Erweiterbarkeit

Die Ontologie sollte so aufgebaut werden, dass branchenspezifische Erweiterungen möglich sind.

```text
PS_DISTURBANCE
   ├── generische Klassen
   └── branchenspezifische Erweiterung
```

Branchenspezifische Klassen dürfen die generische Kernontologie nicht inkompatibel verändern.

---

# 30. Freigabeprozess

## Schritt 1 – Fachreview
Prüfung von Definition, Beispielen, Abgrenzung und Oberklasse.

## Schritt 2 – Beobachtungsreview
Prüfung: Kann die Klasse in einer realistischen Multimomentaufnahme erkannt werden?

## Schritt 3 – Evidenzreview
Prüfung: Beobachtung ausreichend? Memo nötig? MES nötig? ERP nötig?

## Schritt 4 – Granularitätsentscheidung
Status setzen:

```text
accepted
accepted_with_constraints
aggregated
rejected
```

## Schritt 5 – Version 1.0
Freigabe als stabile Grundlage für AP3.

---

# 31. Definition of Done

Die Ontologie ist abgeschlossen, wenn:

- [ ] alle Klassen eindeutige IDs besitzen
- [ ] alle Klassen definiert sind
- [ ] Hierarchien dokumentiert sind
- [ ] Hierarchie zyklusfrei ist
- [ ] jede G3-Klasse einen Fallback besitzt
- [ ] `PS_UNKNOWN` vorhanden ist
- [ ] LossClass separat modelliert ist
- [ ] CauseClass separat modelliert ist
- [ ] MeasureClass separat modelliert ist
- [ ] Evidenztypen definiert sind
- [ ] Kontexttypen definiert sind
- [ ] zentrale Relationen definiert sind
- [ ] Constraints dokumentiert sind
- [ ] kritische Klassen Positiv- und Negativbeispiele besitzen
- [ ] Granularitätsprüfung durchgeführt wurde
- [ ] nicht trennbare Klassen aggregiert oder markiert wurden
- [ ] maschinenlesbare Struktur vorbereitet ist
- [ ] Versionierung geregelt ist
- [ ] Übergabe an AP3 dokumentiert ist

---

# 32. Übergabe an AP3

Die Ontologie stellt AP3 bereit:

```text
Klassenraum
+ Hierarchie
+ Kandidatenräume
+ Constraints
+ Fallbacks
+ Evidenzanforderungen
+ Kontextbedingungen
```

AP3 erzeugt daraus:

```text
Klassenwahrscheinlichkeiten
oder
Abstain / Nicht-Entscheidung
```

Die Ontologie selbst entscheidet nicht probabilistisch.

---

# 33. Quellenbasis und Status

Diese Ontologie ist aus den Anforderungen von AP1 des Projektplans abgeleitet. Dort werden ausdrücklich ein ontologisches Fachmodell, Aktivitäts-, Verlust-, Ursachen- und Maßnahmenklassen, Relationen, Constraints, Granularitätsanalyse und ein Beobachtungsschema gefordert.

Die konkrete Klassenliste, die hierarchische Struktur, Detaildefinitionen und Beispielrelationen sind **operative Arbeitsentwürfe**. Sie sind nicht als bereits im ursprünglichen Projektauftrag festgelegte Ontologie zu verstehen.

Die Ontologie muss deshalb innerhalb von AP1 anhand realer bzw. kontrollierter Beobachtungsfälle geprüft, angepasst und versioniert freigegeben werden.
