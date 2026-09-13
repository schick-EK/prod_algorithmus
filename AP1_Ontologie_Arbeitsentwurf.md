# Ontologie für AP1 – Produktions- und Beobachtungsmodell

**Projekt:** Entwicklung eines unsicherheitsgeführten Mess- und Entscheidungsverfahrens für belastbare Effektivitätskennzahlen und robuste Verbesserungsmaßnahmen in Produktionssystemen  
**Arbeitspaket:** AP1 – Formale Modellierung des Produktions- und Beobachtungsmodells  
**Dokumentstatus:** Ontologie-Arbeitsentwurf v0.1  
**Zweck:** Fachliche und maschinenlesbar strukturierbare Grundlage für AP2, AP3 und später AP5

---

# 1. Zweck der Ontologie

Die Ontologie beschreibt den fachlichen Zustandsraum, auf den spätere Beobachtungen, Annotationen und probabilistischen Modelle Bezug nehmen.

Sie soll insbesondere ermöglichen, dass:

- Produktions- und Aktivitätszustände formal unterschieden werden,
- Verlustzustände strukturiert beschrieben werden,
- mögliche Ursachen und Maßnahmen getrennt modelliert werden,
- Klassen hierarchisch organisiert werden,
- Relationen zwischen Klassen formalisiert werden,
- mehrere Kandidatenklassen für eine Beobachtung zulässig bleiben,
- nicht ausreichend identifizierbare Fälle explizit abgebildet werden,
- feine Klassen auf gröbere Klassen zurückfallen können,
- die Ontologie versioniert und von AP3 maschinenlesbar genutzt werden kann.

Wesentlich ist dabei die Trennung zwischen:

```text
Beobachtung
≠
tatsächlicher Produktionszustand
```

Die Ontologie definiert fachlich mögliche Zustände und Zusammenhänge. Sie entscheidet nicht automatisch, welcher Zustand tatsächlich vorliegt.

---

# 2. Modellierungsprinzipien

## 2.1 Hierarchische Granularität

Die Ontologie verwendet mehrere Granularitätsstufen:

- **G0** – nicht identifizierbar / unbekannt
- **G1** – grobe Zustandsfamilien
- **G2** – mittlere fachliche Klassen
- **G3** – feine Klassen

Eine feinere Klasse darf nur verwendet werden, wenn die verfügbare Evidenz eine entsprechende Unterscheidung trägt.

## 2.2 Fallback-Prinzip

Jede feine Klasse erhält eine gröbere Rückfallklasse.

Beispiel:

```text
PS_WAIT_MATERIAL
   ↓ fallbackTo
PS_WAITING
   ↓ fallbackTo
PS_LOSS
   ↓ fallbackTo
PS_UNKNOWN
```

Dadurch kann die Modellkette Unsicherheit ausdrücken, ohne eine künstlich feine Klassifikation zu erzwingen.

## 2.3 UNKNOWN ist eine reguläre Klasse

`PS_UNKNOWN` ist kein Fehlerzustand, sondern eine gültige fachliche Ausgabe.

Sie wird verwendet, wenn:

- die Evidenz zu schwach ist,
- Evidenzen widersprüchlich sind,
- die Beobachtung zu kurz oder unvollständig ist,
- die Ontologie den Fall noch nicht ausreichend beschreibt.

## 2.4 Ursache ist nicht gleich Zustand

Beispiel:

```text
PS_WAIT_MATERIAL
```

ist ein beobachtbarer bzw. latenter Produktionszustand.

```text
CAUSE_LOGISTICS
```

ist eine mögliche Ursache.

Die Ontologie hält diese Ebenen strikt getrennt.

## 2.5 Maßnahme ist nicht gleich Ursache

Eine Maßnahme beschreibt eine mögliche Reaktion auf eine Ursache oder Verlustsituation.

Beispiel:

```text
CAUSE_LOGISTICS
   ↓ mayBeAddressedBy
MEASURE_MATERIAL_LOGISTICS
```

Dies bedeutet lediglich, dass die Maßnahme fachlich grundsätzlich passen kann. Eine konkrete Wirkung wird in AP1 nicht behauptet.

---

# 3. Metamodell

Die Ontologie verwendet folgende Entitätstypen:

| Entitätstyp | Beschreibung |
|---|---|
| `ProductionState` | Produktions- oder Aktivitätszustand |
| `LossClass` | Verlustklasse |
| `CauseClass` | Ursachenklasse |
| `MeasureClass` | Maßnahmenklasse |
| `EvidenceType` | Evidenztyp |
| `ContextType` | Kontexttyp |
| `Constraint` | fachliche Regel |
| `GranularityLevel` | Granularitätsstufe |

---

# 4. Klassenstruktur – ProductionState

## 4.1 G0 – PS_UNKNOWN

**Label:** Unbekannt / nicht ausreichend identifizierbar  
**Granularität:** G0  
**Typ:** ProductionState

**Definition:**  
Der tatsächliche Produktions- oder Aktivitätszustand kann mit der verfügbaren Evidenz nicht ausreichend bestimmt werden.

**Typische Gründe:**

- Beobachtung zu kurz,
- schlechte Sichtbarkeit,
- widersprüchliche Informationen,
- fehlende Zusatzinformationen,
- Klasse in der Ontologie nicht ausreichend differenziert.

**Fallback:** keiner

---

# 5. G1 – Hauptzustandsklassen

## 5.1 PS_PRODUCTIVE

**Label:** Produktiver Zustand  
**Granularität:** G1  
**Typ:** ProductionState

**Definition:**  
Zustand, in dem unmittelbar eine für den Produktionszweck vorgesehene wertschöpfende bzw. direkte Produktionsaktivität stattfindet.

**Beispiele:**

- Bearbeitung eines Werkstücks,
- Montage eines Bauteils,
- aktiver Fertigungsschritt.

**Abgrenzung:**

Nicht enthalten sind:

- Warten,
- Nacharbeit,
- Rüsten,
- ungeplante Reparatur,
- reine Transport- oder Prüfaktivitäten.

**Fallback:** `PS_UNKNOWN`

## 5.2 PS_NECESSARY_SUPPORT

**Label:** Notwendige unterstützende Tätigkeit  
**Granularität:** G1  
**Typ:** ProductionState

**Definition:**  
Tätigkeit, die für die Produktion erforderlich ist, selbst aber nicht als direkte produktive Bearbeitung klassifiziert wird.

**Beispiele:**

- Rüsten,
- Prüfen,
- notwendiger Transport,
- geplante unterstützende Tätigkeit.

**Fallback:** `PS_UNKNOWN`

## 5.3 PS_LOSS

**Label:** Verlustzustand  
**Granularität:** G1  
**Typ:** ProductionState

**Definition:**  
Zustand, in dem eine geplante oder erwartbare produktive bzw. notwendige Tätigkeit nicht wie vorgesehen stattfindet und dadurch Zeit, Leistung, Qualität oder Ressourcen verloren gehen.

**Beispiele:**

- Warten,
- ungeplante Störung,
- Nacharbeit,
- Leistungsabweichung.

**Fallback:** `PS_UNKNOWN`

---

# 6. G2 – Unterstützende Tätigkeiten

## 6.1 PS_SETUP

**Label:** Rüsten / Umstellen  
**Parent:** `PS_NECESSARY_SUPPORT`  
**Granularität:** G2

**Definition:**  
Geplante Vorbereitung oder Umstellung von Maschine, Anlage, Arbeitsplatz oder Prozess für einen anderen Auftrag, ein anderes Produkt oder einen anderen Betriebszustand.

**Positive Beispiele:**

- Werkzeugwechsel vor neuem Auftrag,
- Formatumstellung,
- Einrichten einer Maschine.

**Negative Beispiele:**

- Reparatur nach Störung,
- Warten auf Material.

**Fallback:** `PS_NECESSARY_SUPPORT`

## 6.2 PS_INSPECTION

**Label:** Prüfen / Kontrollieren  
**Parent:** `PS_NECESSARY_SUPPORT`  
**Granularität:** G2

**Definition:**  
Geplante Prüfung oder Kontrolle von Produkt, Prozess oder Betriebsmittel.

**Positive Beispiele:**

- Qualitätsprüfung,
- Maßkontrolle,
- Sichtprüfung.

**Negative Beispiele:**

- Nacharbeit,
- Fehlerbehebung.

**Fallback:** `PS_NECESSARY_SUPPORT`

## 6.3 PS_NECESSARY_TRANSPORT

**Label:** Notwendiger Transport  
**Parent:** `PS_NECESSARY_SUPPORT`  
**Granularität:** G2

**Definition:**  
Transport oder Bewegung von Material, Werkzeug oder Produkt, die Bestandteil des vorgesehenen Produktionsablaufs ist.

**Positive Beispiele:**

- Materialtransport zwischen definierten Prozessschritten,
- notwendige Bereitstellung.

**Negative Beispiele:**

- unnötige Suchwege,
- vermeidbare Doppeltransporte.

**Fallback:** `PS_NECESSARY_SUPPORT`

## 6.4 PS_PLANNED_SUPPORT

**Label:** Geplante Unterstützung  
**Parent:** `PS_NECESSARY_SUPPORT`  
**Granularität:** G2

**Definition:**  
Geplante unterstützende Tätigkeit, die keiner spezifischeren Klasse zugeordnet werden kann.

**Beispiele:**

- dokumentierte Unterstützungsarbeit,
- vorbereitende Tätigkeit.

**Fallback:** `PS_NECESSARY_SUPPORT`

---

# 7. G2 – Verlustzustände

## 7.1 PS_WAITING

**Label:** Warten  
**Parent:** `PS_LOSS`  
**Granularität:** G2

**Definition:**  
Zustand, in dem eine geplante Aktivität nicht fortgeführt werden kann und eine Ressource, Person oder Anlage auf eine notwendige Voraussetzung wartet.

**Positive Beispiele:**

- Bediener wartet auf Material,
- Maschine wartet auf Freigabe,
- Prozess wartet auf vorgelagerten Schritt.

**Negative Beispiele:**

- geplante Pause,
- aktives Rüsten,
- aktive Reparatur.

**Fallback:** `PS_LOSS`

## 7.2 PS_DISTURBANCE

**Label:** Störung / ungeplante Unterbrechung  
**Parent:** `PS_LOSS`  
**Granularität:** G2

**Definition:**  
Ungeplante Unterbrechung des vorgesehenen Produktionsablaufs aufgrund eines technischen, organisatorischen oder prozessbezogenen Ereignisses.

**Positive Beispiele:**

- Maschinenfehler,
- Prozessabbruch,
- Sicherheitsstopp.

**Fallback:** `PS_LOSS`

## 7.3 PS_REWORK

**Label:** Nacharbeit  
**Parent:** `PS_LOSS`  
**Granularität:** G2

**Definition:**  
Zusätzliche Bearbeitung eines bereits bearbeiteten Produkts oder Arbeitsergebnisses zur Korrektur eines Qualitäts- oder Prozessfehlers.

**Positive Beispiele:**

- erneutes Bohren,
- Korrekturmontage,
- Nachschleifen.

**Negative Beispiele:**

- normale Bearbeitung,
- geplante Prüfung.

**Fallback:** `PS_LOSS`

## 7.4 PS_UNPLANNED_MAINTENANCE

**Label:** Ungeplante Instandhaltung / Reparatur  
**Parent:** `PS_LOSS`  
**Granularität:** G2

**Definition:**  
Ungeplante technische Tätigkeit zur Wiederherstellung der Funktionsfähigkeit einer Maschine, Anlage oder eines Betriebsmittels.

**Positive Beispiele:**

- Reparatur nach Maschinenausfall,
- Austausch eines defekten Bauteils.

**Negative Beispiele:**

- geplante Wartung,
- Rüsten.

**Fallback:** `PS_LOSS`

## 7.5 PS_PERFORMANCE_DEVIATION

**Label:** Leistungsabweichung  
**Parent:** `PS_LOSS`  
**Granularität:** G2

**Definition:**  
Produktionszustand mit messbar oder plausibel reduzierter Leistung gegenüber dem erwarteten bzw. vorgesehenen Prozessniveau.

**Beispiele:**

- verringerte Taktleistung,
- wiederkehrende Mikrostopps,
- reduzierte Geschwindigkeit.

**Hinweis:**  
Die genaue Kennzahldefinition und quantitative Bewertung erfolgen erst in AP6.

**Fallback:** `PS_LOSS`

## 7.6 PS_UNNECESSARY_MOTION_OR_TRANSPORT

**Label:** Vermeidbare Bewegung / vermeidbarer Transport  
**Parent:** `PS_LOSS`  
**Granularität:** G2

**Definition:**  
Bewegung oder Transport, die für den vorgesehenen Prozess nicht notwendig ist und zusätzliche Zeit oder Ressourcen bindet.

**Beispiele:**

- unnötige Laufwege,
- wiederholtes Umsetzen,
- Suche nach Material oder Werkzeug.

**Fallback:** `PS_LOSS`

---

# 8. G3 – Feinklassen für Warten

Diese Klassen sind Kandidaten für die Granularitätsanalyse.

## 8.1 PS_WAIT_MATERIAL

**Label:** Warten auf Material  
**Parent:** `PS_WAITING`  
**Granularität:** G3  
**Status:** Kandidat

**Definition:**  
Eine Aktivität kann nicht fortgeführt werden, weil benötigtes Material, Bauteil oder Hilfsmittel nicht verfügbar ist.

**Positive Beispiele:**

- Materialbehälter leer,
- Bauteil fehlt,
- Materialbereitstellung noch nicht erfolgt.

**Negative Beispiele:**

- Warten auf Freigabe,
- Warten auf Maschine.

**Mögliche Evidenz:**

- direkte Beobachtung,
- Memo,
- ERP-/Materialkontext,
- Logistikstatus.

**Fallback:** `PS_WAITING`

## 8.2 PS_WAIT_INFORMATION

**Label:** Warten auf Information  
**Parent:** `PS_WAITING`  
**Granularität:** G3  
**Status:** Kandidat

**Definition:**  
Eine Aktivität kann nicht fortgeführt werden, weil notwendige Information, Freigabe, Anweisung oder Entscheidung fehlt.

**Positive Beispiele:**

- Auftrag nicht freigegeben,
- Rückfrage zur Zeichnung,
- fehlende Prozessinformation.

**Mögliche Evidenz:**

- Memo,
- ERP-Kontext,
- Auftragsstatus.

**Fallback:** `PS_WAITING`

## 8.3 PS_WAIT_MACHINE

**Label:** Warten auf Maschine / Anlage  
**Parent:** `PS_WAITING`  
**Granularität:** G3  
**Status:** Kandidat

**Definition:**  
Eine Person, ein Auftrag oder ein Prozess wartet darauf, dass eine Maschine oder Anlage verfügbar oder betriebsbereit wird.

**Mögliche Evidenz:**

- direkte Beobachtung,
- MES-Zustand,
- Memo.

**Fallback:** `PS_WAITING`

## 8.4 PS_WAIT_PERSONNEL

**Label:** Warten auf Personal  
**Parent:** `PS_WAITING`  
**Granularität:** G3  
**Status:** Kandidat

**Definition:**  
Eine Aktivität kann nicht fortgeführt werden, weil eine benötigte Person oder Rolle nicht verfügbar ist.

**Beispiele:**

- Warten auf Instandhalter,
- Warten auf Prüfer,
- Warten auf Freigabeperson.

**Fallback:** `PS_WAITING`

---

# 9. G3 – Feinklassen für Störungen

## 9.1 PS_DISTURB_MACHINE

**Label:** Maschinenstörung  
**Parent:** `PS_DISTURBANCE`  
**Granularität:** G3  
**Status:** Kandidat

**Definition:**  
Ungeplante Unterbrechung, deren primärer technischer Bezug bei Maschine, Anlage oder Werkzeug liegt.

**Mögliche Evidenz:**

- MES-Fehlercode,
- Maschinenstatus,
- Memo,
- direkte Beobachtung.

**Fallback:** `PS_DISTURBANCE`

## 9.2 PS_DISTURB_PROCESS

**Label:** Prozessstörung  
**Parent:** `PS_DISTURBANCE`  
**Granularität:** G3  
**Status:** Kandidat

**Definition:**  
Ungeplante Unterbrechung, die nicht primär als technischer Maschinenfehler, sondern als Prozessabweichung oder Prozessproblem beschrieben wird.

**Fallback:** `PS_DISTURBANCE`

---

# 10. G3 – Feinklassen für Nacharbeit

## 10.1 PS_REWORK_INTERNAL

**Label:** Nacharbeit – interner Fehler  
**Parent:** `PS_REWORK`  
**Granularität:** G3  
**Status:** Kandidat

**Definition:**  
Nacharbeit aufgrund eines Fehlers, der innerhalb des betrachteten Produktionsprozesses entstanden ist.

**Fallback:** `PS_REWORK`

## 10.2 PS_REWORK_EXTERNAL

**Label:** Nacharbeit – externer / vorgelagerter Fehler  
**Parent:** `PS_REWORK`  
**Granularität:** G3  
**Status:** Kandidat

**Definition:**  
Nacharbeit aufgrund eines Fehlers, dessen Ursprung außerhalb des unmittelbar betrachteten Produktionsschritts liegt.

**Fallback:** `PS_REWORK`

---

# 11. Verlustklassen

## 11.1 LOSS_AVAILABILITY

**Label:** Verfügbarkeitsverlust

**Definition:**  
Verlust aufgrund fehlender Verfügbarkeit einer für die Produktion benötigten Ressource oder Anlage.

**Mögliche Zustände:**

- `PS_WAITING`
- `PS_DISTURBANCE`
- `PS_UNPLANNED_MAINTENANCE`

## 11.2 LOSS_PERFORMANCE

**Label:** Leistungsverlust

**Definition:**  
Verlust aufgrund reduzierter Produktionsleistung gegenüber einem vorgesehenen Niveau.

**Mögliche Zustände:**

- `PS_PERFORMANCE_DEVIATION`

## 11.3 LOSS_QUALITY

**Label:** Qualitätsverlust

**Definition:**  
Verlust aufgrund fehlerhafter Produkte, Prozessausgaben oder zusätzlicher Korrekturarbeit.

**Mögliche Zustände:**

- `PS_REWORK`

## 11.4 LOSS_FLOW_WAIT

**Label:** Fluss-/Warteverlust

**Definition:**  
Verlust durch Unterbrechung oder Verzögerung des vorgesehenen Material-, Informations- oder Prozessflusses.

**Mögliche Zustände:**

- `PS_WAITING`

## 11.5 LOSS_CHANGEOVER

**Label:** Rüst-/Wechselverlust

**Definition:**  
Zeit- oder Leistungsverlust im Zusammenhang mit Umstellungen oder Wechseln.

**Hinweis:**  
Ob eine konkrete Rüstaktivität als notwendige Unterstützung oder Verlust bewertet wird, hängt von der späteren Kennzahlendefinition und dem Referenzmodell ab.

## 11.6 LOSS_RESOURCE_USE

**Label:** Ressourcen-/Handhabungsverlust

**Definition:**  
Verlust aufgrund vermeidbarer Bewegung, Transporte oder unnötiger Ressourcennutzung.

**Mögliche Zustände:**

- `PS_UNNECESSARY_MOTION_OR_TRANSPORT`

## 11.7 LOSS_UNKNOWN

**Label:** Verlusttyp unbekannt

**Definition:**  
Ein Verlustzustand ist erkennbar, der spezifische Verlusttyp kann jedoch nicht ausreichend bestimmt werden.

---

# 12. Ursachenklassen

## 12.1 CAUSE_EQUIPMENT
Maschine, Anlage oder Werkzeug als mögliche Ursache.

## 12.2 CAUSE_MATERIAL
Material, Bauteil oder Materialverfügbarkeit als mögliche Ursache.

## 12.3 CAUSE_METHOD_PROCESS
Prozessgestaltung, Arbeitsmethode oder Standard als mögliche Ursache.

## 12.4 CAUSE_PLANNING_INFORMATION
Planung, Auftrag, Information oder Freigabe als mögliche Ursache.

## 12.5 CAUSE_QUALITY_INPUT
Qualitätsproblem eines Eingangsprodukts oder vorgelagerten Prozessschritts.

## 12.6 CAUSE_LOGISTICS
Materialfluss, Bereitstellung oder interne Logistik als mögliche Ursache.

## 12.7 CAUSE_ORGANIZATION_PERSONNEL
Organisation, Personalverfügbarkeit, Rollen oder Zuständigkeiten als mögliche Ursache.

## 12.8 CAUSE_ENVIRONMENT_EXTERNAL
Externe oder umgebungsbezogene Einflüsse.

## 12.9 CAUSE_UNKNOWN
Ursache nicht ausreichend bestimmbar.

---

# 13. Maßnahmenklassen

## 13.1 MEASURE_MAINTENANCE
Maßnahmen im Bereich Instandhaltung, Wartung oder technische Verfügbarkeit.

## 13.2 MEASURE_PROCESS_STANDARDIZATION
Standardisierung oder Anpassung von Arbeits- und Prozessabläufen.

## 13.3 MEASURE_MATERIAL_LOGISTICS
Verbesserung von Materialbereitstellung, Materialfluss und interner Logistik.

## 13.4 MEASURE_PLANNING_CONTROL
Verbesserungen von Planung, Steuerung, Freigabe und Auftragskoordination.

## 13.5 MEASURE_QUALITY_ASSURANCE
Maßnahmen zur Fehlerprävention, Qualitätsprüfung oder Qualitätsverbesserung.

## 13.6 MEASURE_TRAINING_WORK_ORGANIZATION
Qualifizierung, Rollenklärung, Arbeitsorganisation oder Personaleinsatz.

## 13.7 MEASURE_LAYOUT_FLOW
Änderung von Layout, Wegeführung oder Materialfluss.

## 13.8 MEASURE_TECHNICAL_AUTOMATION
Technische Automatisierung oder technische Prozessunterstützung.

## 13.9 MEASURE_DATA_MONITORING
Zusätzliche Mess-, Monitoring- oder Datenlösungen.

## 13.10 MEASURE_INFORMATION_COLLECTION
Gezielte zusätzliche Evidenzerhebung, wenn eine robuste Entscheidung aufgrund fehlender Informationen nicht möglich ist.

---

# 14. Evidenztypen

## EV_OBSERVATION
Direkte strukturierte Beobachtung.

## EV_MEMO
Sprach- oder Textmemo.

## EV_MES
Maschinenzustände, Zeiten oder Ereignisse aus MES bzw. Maschinendaten.

## EV_ERP
Auftrags-, Produkt-, Mengen- oder sonstiger ERP-Kontext.

## EV_DERIVED
Aus vorhandenen Daten abgeleitete Information.

---

# 15. Kontexttypen

Als initiale Kontextdimensionen werden vorgeschlagen:

- `CTX_SITE`
- `CTX_AREA`
- `CTX_WORKCENTER`
- `CTX_MACHINE`
- `CTX_ORDER`
- `CTX_PRODUCT`
- `CTX_SHIFT`
- `CTX_TIME`
- `CTX_PROCESS_STEP`
- `CTX_SAMPLING_STRATUM`
- `CTX_SAMPLING_CLUSTER`

Die konkrete technische Ausgestaltung ist in AP1 nur soweit erforderlich festzulegen, dass AP2 und AP3 konsistent darauf referenzieren können.

---

# 16. Relationen

## 16.1 subClassOf

Hierarchische Beziehung zwischen Klassen.

```text
PS_WAIT_MATERIAL
subClassOf
PS_WAITING
```

## 16.2 fallbackTo

Definiert die gröbere Klasse, die bei unzureichender Evidenz verwendet werden soll.

```text
PS_WAIT_MATERIAL
fallbackTo
PS_WAITING
```

## 16.3 mayRepresentLoss

```text
PS_WAITING
mayRepresentLoss
LOSS_FLOW_WAIT
```

## 16.4 mayHaveCause

```text
PS_WAIT_MATERIAL
mayHaveCause
CAUSE_MATERIAL
```

und

```text
PS_WAIT_MATERIAL
mayHaveCause
CAUSE_LOGISTICS
```

## 16.5 mayBeAddressedBy

```text
CAUSE_LOGISTICS
mayBeAddressedBy
MEASURE_MATERIAL_LOGISTICS
```

## 16.6 requiresEvidence

Beschreibt Evidenzanforderungen einer Feinklasse.

```text
PS_DISTURB_MACHINE
requiresEvidence
EV_MES
```

Die Relation muss nicht als absolute Pflicht interpretiert werden. Sie kann auch ausdrücken, dass bestimmte Evidenztypen für eine belastbare Feinidentifikation besonders relevant sind.

## 16.7 requiresContext

```text
PS_WAIT_INFORMATION
requiresContext
CTX_ORDER
```

wenn eine feinere Unterscheidung ohne Auftrags-/Informationskontext nicht belastbar möglich ist.

## 16.8 incompatibleWith

Definiert logisch unzulässige Kombinationen auf derselben Klassifikationsebene.

```text
PS_PRODUCTIVE
incompatibleWith
PS_WAITING
```

sofern beide denselben Zustand zur selben Beobachtung und demselben Zeitpunkt beschreiben sollen.

---

# 17. Beispielhafte Ursache-Zustand-Maßnahme-Matrix

| Zustand | mögliche Verlustklasse | mögliche Ursache | mögliche Maßnahmenklasse |
|---|---|---|---|
| Warten auf Material | Fluss-/Warteverlust | Material | Materiallogistik |
| Warten auf Material | Fluss-/Warteverlust | Logistik | Materiallogistik / Layout |
| Warten auf Information | Fluss-/Warteverlust | Planung/Information | Planung & Steuerung |
| Maschinenstörung | Verfügbarkeitsverlust | Maschine/Anlage | Instandhaltung |
| Nacharbeit | Qualitätsverlust | Methode/Prozess | Prozessstandardisierung |
| Nacharbeit | Qualitätsverlust | Qualität Input | Qualitätssicherung |
| vermeidbarer Transport | Ressourcenverlust | Layout/Prozess | Layout / Materialfluss |

Diese Matrix bildet fachliche Zulässigkeiten ab, nicht empirisch bewiesene Wirkzusammenhänge.

---

# 18. Constraint-Regeln

- **CON-001 – UNKNOWN zulässig:** Für jede Beobachtung muss `PS_UNKNOWN` als möglicher Fallback verfügbar sein.
- **CON-002 – keine erzwungene Blattklasse:** Eine G3-Klasse darf nicht zwingend ausgewählt werden.
- **CON-003 – Fallback-Pfad:** Jede G3-Klasse muss mindestens einen eindeutigen Pfad zu G2 und G1 besitzen.
- **CON-004 – Trennung der Ebenen:** `ProductionState`, `CauseClass` und `MeasureClass` dürfen nicht synonym verwendet werden.
- **CON-005 – Provenienz:** Jede Evidenz muss einen Evidenztyp und eine Herkunft besitzen.
- **CON-006 – Missingness:** Nicht vorhandene Evidenz wird mit `missing` bzw. einem äquivalenten expliziten Status repräsentiert.
- **CON-007 – kein negatives Signal aus Missingness:** Fehlende MES-Evidenz darf beispielsweise nicht automatisch als `machine_running = false` interpretiert werden.
- **CON-008 – zeitlicher Bezug:** Evidenzen müssen einem Beobachtungszeitpunkt oder einem definierten Zeitfenster zuordenbar sein.
- **CON-009 – Konflikte bleiben erhalten:** Widersprüchliche Evidenzen werden nicht auf Ontologieebene aufgelöst.
- **CON-010 – Hierarchie zyklusfrei:** `subClassOf` darf keine Zyklen erzeugen.

---

# 19. Granularitätsprüfung für Ontologieklassen

Jede G3-Klasse wird vor Freigabe bewertet.

## 19.1 Kriterien

| Kriterium | Frage |
|---|---|
| Beobachtbarkeit | Ist der Zustand direkt oder indirekt erkennbar? |
| Trennschärfe | Ist er von Geschwisterklassen unterscheidbar? |
| Evidenzverfügbarkeit | Gibt es geeignete Evidenzkanäle? |
| Sparsity-Robustheit | Ist mit genügend Fällen zu rechnen? |
| Fachlicher Nutzen | Hat die Feinheit später einen Mehrwert? |
| Definitionsstabilität | Ist die Definition reproduzierbar? |
| Fallback-Fähigkeit | Gibt es eine sinnvolle Oberklasse? |

## 19.2 Statuswerte

Jede Klasse erhält einen Status:

- `draft`
- `candidate`
- `accepted`
- `accepted_with_constraints`
- `aggregated`
- `rejected`
- `deprecated`

---

# 20. Beispiel einer maschinenlesbaren Klassendefinition

```yaml
id: PS_WAIT_MATERIAL
type: ProductionState
label_de: Warten auf Material
granularity: G3
parent: PS_WAITING
status: candidate

definition: >
  Zustand, in dem eine vorgesehene Aktivität aufgrund
  nicht verfügbaren Materials oder fehlender Bauteile
  nicht fortgesetzt werden kann.

positive_examples:
  - Materialbehälter leer und Bediener wartet.
  - Benötigtes Bauteil wurde noch nicht bereitgestellt.

negative_examples:
  - Bediener wartet auf eine Freigabeinformation.
  - Maschine ist technisch gestört.

fallback_to: PS_WAITING

possible_loss_classes:
  - LOSS_FLOW_WAIT
  - LOSS_AVAILABILITY

possible_causes:
  - CAUSE_MATERIAL
  - CAUSE_LOGISTICS

useful_evidence:
  - EV_OBSERVATION
  - EV_MEMO
  - EV_ERP
  - EV_MES
```

---

# 21. Ontologiebaum – kompakte Darstellung

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
│   └── PS_PLANNED_SUPPORT
│
└── PS_LOSS
    ├── PS_WAITING
    │   ├── PS_WAIT_MATERIAL
    │   ├── PS_WAIT_INFORMATION
    │   ├── PS_WAIT_MACHINE
    │   └── PS_WAIT_PERSONNEL
    │
    ├── PS_DISTURBANCE
    │   ├── PS_DISTURB_MACHINE
    │   └── PS_DISTURB_PROCESS
    │
    ├── PS_REWORK
    │   ├── PS_REWORK_INTERNAL
    │   └── PS_REWORK_EXTERNAL
    │
    ├── PS_UNPLANNED_MAINTENANCE
    ├── PS_PERFORMANCE_DEVIATION
    └── PS_UNNECESSARY_MOTION_OR_TRANSPORT
```

---

# 22. Prüfung anhand typischer Beobachtungsfälle

## Fall 1

**Beobachtung:** Mitarbeiter wartet neben stillstehender Maschine. Keine weitere Information.

**Zulässige Kandidaten:**

- `PS_WAITING`
- `PS_DISTURBANCE`
- `PS_UNPLANNED_MAINTENANCE`
- `PS_UNKNOWN`

**Nicht zulässig:** automatische Zuordnung zu `PS_WAIT_MATERIAL`.

## Fall 2

**Beobachtung:** Mitarbeiter wartet. Memo: „Material für Auftrag noch nicht da.“

**Plausible Kandidaten:**

- `PS_WAIT_MATERIAL`
- `PS_WAITING`

## Fall 3

**Beobachtung:** Maschine steht. MES meldet Fehlercode. Mitarbeiter arbeitet am Maschineninnenraum.

**Plausible Kandidaten:**

- `PS_DISTURB_MACHINE`
- `PS_UNPLANNED_MAINTENANCE`

Eine weitere Trennung kann vom zeitlichen Ablauf abhängen: Störung als Ereignis, Reparatur als darauf folgende Tätigkeit.

## Fall 4

**Beobachtung:** Mitarbeiter transportiert Material.

**Mögliche Klassen:**

- `PS_NECESSARY_TRANSPORT`
- `PS_UNNECESSARY_MOTION_OR_TRANSPORT`

Die Entscheidung ist ohne Kontext möglicherweise nicht möglich.

---

# 23. Offene Ontologiefragen

Vor Freigabe von Version 1.0 sollten folgende Punkte fachlich geklärt werden:

1. Soll `PS_PRODUCTIVE` weiter untergliedert werden?
2. Wie wird geplante Instandhaltung klassifiziert?
3. Wie werden Pausen und persönliche Unterbrechungen behandelt?
4. Ist Rüsten grundsätzlich notwendige Unterstützung oder teilweise Verlust?
5. Wie wird Materialsuche gegenüber Materialwarten abgegrenzt?
6. Soll „Mikrostopp“ als eigene Klasse geführt werden?
7. Wie wird langsames Arbeiten gegenüber technisch reduzierter Geschwindigkeit abgegrenzt?
8. Welche G3-Klassen sind mit Beobachtung und Memo tatsächlich trennbar?
9. Welche Klassen benötigen zwingend MES- oder ERP-Kontext?
10. Welche Klassen sollen branchenübergreifend gelten und welche nur als Erweiterung?

---

# 24. Vorgeschlagener Freigabeprozess

## Schritt 1 – Fachreview

Prüfung jeder Klasse auf:

- fachliche Eindeutigkeit,
- klare Definition,
- Abgrenzung,
- Relevanz.

## Schritt 2 – Beobachtungsreview

Prüfung:

> Kann die Klasse unter realistischen Multimomentbedingungen überhaupt erkannt werden?

## Schritt 3 – Evidenzreview

Prüfung:

- direkte Beobachtung ausreichend?
- Memo notwendig?
- MES notwendig?
- ERP notwendig?

## Schritt 4 – Granularitätsentscheidung

Status setzen:

```text
accepted
accepted_with_constraints
aggregated
rejected
```

## Schritt 5 – Freigabe Ontologie v1.0

Danach darf AP3 auf den Klassenraum referenzieren.

---

# 25. Definition of Done für die Ontologie

Die Ontologie ist für AP1 freigabefähig, wenn:

- [ ] alle Klassen eindeutige IDs besitzen
- [ ] alle Klassen definiert sind
- [ ] Ober-/Unterklassenbeziehungen dokumentiert sind
- [ ] Hierarchie zyklusfrei ist
- [ ] jede G3-Klasse einen Fallback besitzt
- [ ] UNKNOWN als regulärer Zustand vorhanden ist
- [ ] Ursachen und Maßnahmen getrennt modelliert sind
- [ ] Relationen definiert sind
- [ ] zentrale Constraints dokumentiert sind
- [ ] Positiv- und Negativbeispiele für kritische Klassen vorliegen
- [ ] Granularitätsprüfung durchgeführt wurde
- [ ] nicht trennbare Klassen aggregiert oder markiert sind
- [ ] maschinenlesbare Repräsentation vorbereitet ist
- [ ] Versionierung definiert ist
- [ ] Übergabe an AP3 dokumentiert ist

---

# 26. Übergabe an AP3

AP3 soll aus der Ontologie insbesondere beziehen können:

```text
Observation
   ↓
zulässige ProductionState-Kandidaten
   ↓
Constraints
   ↓
Fallbacks
   ↓
Kontextbedingungen
   ↓
probabilistische Annotation / Abstain
```

Die Ontologie gibt dabei nicht die endgültige Klasse vor. Sie definiert den **zulässigen fachlichen Suchraum** für die probabilistische Annotation.

---

# 27. Zusammenfassung

Die Ontologie von AP1 bildet Produktionszustände, Verluste, mögliche Ursachen und Maßnahmen in getrennten, hierarchisch strukturierten Klassenräumen ab.

Das zentrale Gestaltungsprinzip besteht darin, nur so fein zu modellieren, wie es die spätere Evidenz erlaubt. Feine Klassen besitzen deshalb Fallbacks, UNKNOWN bleibt ein regulärer Zustand und widersprüchliche oder fehlende Evidenz wird nicht durch harte Regeln verborgen.

Damit schafft die Ontologie die semantische Grundlage für:

- die Erfassung in AP2,
- die probabilistische Annotation in AP3,
- das latente Zustandsmodell in AP5,
- und die konsistente Weiterverarbeitung in den folgenden Arbeitspaketen.

---

# 28. Quellenbasis und Status

Diese Ontologie ist eine operative Ausarbeitung der in AP1 vorgesehenen Aufgaben:

- ontologisches Fachmodell,
- Aktivitäts-, Verlust-, Ursachen- und Maßnahmenklassen,
- Relationen und Constraints,
- Granularitätsanalyse,
- Vorgaben für die Annotation.

Der bereitgestellte Projektplan legt keine finale Klassenliste fest. Die hier beschriebenen Klassen und Relationen sind daher ein **Arbeitsentwurf für AP1** und müssen anhand realer bzw. kontrollierter Beobachtungsfälle fachlich geprüft und versioniert freigegeben werden.
