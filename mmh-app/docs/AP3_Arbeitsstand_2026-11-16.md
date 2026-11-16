# AP3 – fortgeführter Arbeitsstand am 16.11.2026

Dieser Entwicklungsschritt baut auf Commit `c7ece72` und dem dokumentierten
Stand vom 11.11. auf. Der Umfang wurde auf Wunsch als plausibler nächster
Fünftagesstand zugeschnitten. Die fünf Blöcke beschreiben den implementierten
Umfang; sie sind keine Zeiterfassung.

## Erneute Prüfung und Schwerpunkt

AP3 v4 sieht im November Kandidatenbildung, Regeln, Textverarbeitung und eine
erste kontrollierte KI-Komponente vor. Der erste Prototyp konnte diese Teile
isoliert demonstrieren, hatte aber noch drei praktische Lücken:

1. Die vorhandenen App-Daten enthielten kaum individuelle AP3-Merkmale.
2. Modellantworten ließen sich nur über die Bibliothek, noch nicht als
   reproduzierbarer Dateilauf einlesen.
3. Die synthetischen Regressionserwartungen waren noch kein eigenständig
   nutzbarer Referenz- und Evaluationsvertrag.

Bei der Prüfung wurden außerdem zwei Korrekturen erforderlich: Negative
Materialevidenz durfte den Kandidatenraum nicht auf die Wartefamilie einengen;
abgelehnte Eingaben und KI-Antworten brauchten unterscheidbare Audit-Identitäten.

## Die fünf Entwicklungsblöcke

| Block                        | Implementierter Fortschritt                                                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 – Kandidaten und Audit     | Reine Gegenevidenz und ein `PS_UNKNOWN`-Hinweis erhalten den vollständigen experimentellen Kandidatenraum. Negative Ziele samt Fallbacks bleiben sichtbar. Input-Hash und geprüfte/abgelehnte KI-Antwort werden protokolliert. |
| 2 – Individuelle Evidenz     | Beobachtungsliste und Editor für Maschinen-/Personen-/Materialmerkmale, Missingness, Qualität, Prozessschritt und Textmemo. Neue Tabelle mit fortlaufenden Revisionen und Schutz vor veralteten Schreibständen.                |
| 3 – Kontrolliertes KI-Replay | Geschlossener Anfragevertrag mit Hash über Prompt, Memo, Kandidaten und Definitionen. JSONL-Antworten werden über Observation-ID zugeordnet und vollständig geprüft.                                                           |
| 4 – Erste Evaluation         | Versionierter Referenzvertrag für Klassenmengen, Oberklassen, erwartetes Abstain und Out-of-Scope. Getrennte Ergebnisse nach Datenherkunft und Entwicklung/Test; Prüfungen gegen geteilte Quellen über Splitgrenzen.           |
| 5 – Übergabe und Integration | Export der neuesten individuellen Revision, deterministisches JSON-Paket mit Manifest und Ontologiesnapshot, SQLite-Integrationstests und Browserprüfung.                                                                      |

## Individuelle Nacherfassung und Revisionen

Die Erfassung ist unter **Auswertung → Individuelle Evidenz erfassen** erreichbar.
Die Liste zeigt bis zu 50 Beobachtungen pro Seite. Im Editor werden Merkmale
zunächst aus vorhandener individueller Evidenz geladen; bei Altdaten bleiben
sie leer. Die ursprüngliche Ablaufart wird nicht in Merkmale übersetzt.

Gemeinsame Stationsnotizen werden getrennt angezeigt und nicht als individuelles
Memo vorausgefüllt. Ein neues Textmemo wird ausdrücklich einer einzelnen
Beobachtung zugeordnet. Fehlende Werte erhalten einen expliziten Grund; bei
`unknown`/`unclear` gilt `not_known`, bei `not_visible` gilt `not_observed`.

`observation_evidence` enthält:

- eine eindeutige Evidenz-ID;
- die Referenz auf die ursprüngliche Beobachtung;
- eine fortlaufende Revision;
- den validierten AP3-Input als JSON;
- den tatsächlichen Speicherzeitpunkt.

Die Speicherung fügt eine Revision hinzu. Frühere Revisionen, ursprüngliche
Ablaufart, Beobachtungszeitpunkt und Stationsnotizen werden dabei erhalten.
Beobachtung, Studie, Bereich, Station und ursprünglicher Zeitpunkt müssen zum
Input passen. Die vom Formular übergebene Ausgangsrevision wird innerhalb
der Schreibtransaktion mit dem aktuellen Stand verglichen. Bei Abweichung
erscheint eine Meldung zum Neuladen; die inzwischen gespeicherte Revision bleibt
erhalten.

Nacherfasste Daten tragen `individual-evidence/0.1.0` und
`manual-evidence/0.1.0` als Herkunft. Speicherzeit und Beobachtungszeit sind
getrennt. Die Bedienung ersetzt noch keine vollständige AP2-Erfassung mit
Samplingstatus, Audio, Transkript und Verzugsmodell.

## KI-Anfrage und Replay

```bash
npm run --silent ap3:ai-request -- observations.jsonl
npm run --silent ap3:annotate -- observations.jsonl --ai-responses responses.jsonl
```

Jede Antwort referenziert `observation_id`, `input_sha256`, `request_sha256`,
`prompt_version`, `model_id` und ihre Score-/Zitatliste. Promptversion ist jetzt
`memo-evidence/0.2.0`; Antworten zum früheren Vertrag müssen neu erzeugt werden.
Der Anfrage-Hash bindet auch Kandidaten und Klassendefinitionen. Die Reihenfolge
der Antworten im Dateilauf ist beliebig.

Im Replay-Modus wird genau eine Antwort je Beobachtung verlangt. Fehlende,
doppelte oder fremde Antworten sowie unpassende Hashes erzeugen Fehler.
Ungültige Antworten erzeugen `INVALID_INPUT`; ihre Daten bleiben im Audit mit
`ai_response_valid: false` erhalten. Der Lauf endet mit Exitcode 1. Beim reinen
Annotationslauf können valide Datensätze weiterhin ausgegeben werden; ein
erfolgreicher Experimentlauf setzt Exitcode 0 voraus.

Im Evaluationsmodus verhindern fehlerhafte Datensätze die Ausgabe eines
Ergebnisberichts. Ein Teilfehlschlag wird dort nicht still aus dem Nenner entfernt.

Die Anwendung führt weiterhin keinen externen Modellaufruf aus. Modellkennung
und Antwortdatei sind Herkunftsangaben der liefernden Komponente, kein Nachweis
eines tatsächlich erfolgten Anbieteraufrufs. Die Tests kennzeichnen ihre
synthetischen Replay-Antworten entsprechend.

## Referenzen und Evaluationsbericht

Referenzschema: `ap3-reference/0.1.0`. Pro Observation wird genau ein Eintrag
mit `source`, `group_id`, `split` und einer der folgenden Referenzformen erwartet:

```json
{
  "kind": "class_set",
  "class_ids": ["PS_WAIT_MATERIAL", "PS_WAIT_INFORMATION"],
  "accept_descendants": false
}
```

Einzelklassen sind Klassenmengen mit einem Element. Bei einer Oberklasse kann
`accept_descendants: true` gesetzt werden. Alternativ:

```json
{
  "kind": "expected_abstain",
  "allowed_statuses": ["ABSTAIN_CONFLICTING_EVIDENCE"]
}
```

Die dritte Form ist `{ "kind": "out_of_scope" }`. Da der aktuelle Prototyp
Out-of-Scope noch nicht zuverlässig erkennt, bleibt die entsprechende Metrik
ausdrücklich `null`.

```bash
npm run --silent ap3:evaluate -- tests/fixtures/ap3/observations.jsonl tests/fixtures/ap3/references.jsonl
```

Der Bericht enthält Kandidaten-Trefferrate, Treffer der positiven Rohscore-
Top-1-/Top-3-Rangfolge, Übereinstimmung mit erwarteten Abstain-Status und Coverage.
Eine Klassenmengen-Referenz gilt als getroffen, wenn mindestens eine erlaubte
Klasse enthalten ist. Das ist eine Trefferrate je Fall, keine Aussage, dass jede
Klasse der Menge vollständig erfasst wurde. Leere Teilmengen erhalten `null`
statt einer scheinbar gemessenen Nullquote.

Die zehn mitgelieferten Fälle sind synthetisch und wurden für Entwicklung und
Regression verwendet. Darin sind vier Klassenreferenzen und sechs erwartete
Abstain-Fälle enthalten. Der aktuelle technische Demonstrationslauf liefert
für die Klassenfälle 4/4 Kandidatentreffer, 1/4 Rohscore-Top-1-Treffer und 4/4
Top-3-Treffer. Die geringe Top-1-Trefferrate zeigt die Grenze einer erzwungenen
Entscheidung aus Rohscores. Daraus wird keine empirische Leistungsbehauptung
abgeleitet. Geprüfte Realdaten: weiterhin null Fälle.

Synthetische und menschlich geprüfte Realdaten werden separat ausgewertet.
Eine synthetische Observation darf nicht als empirischer Referenzfall gemeldet
werden. Gruppen dürfen nicht über Entwicklung und Test verteilt werden;
zusätzlich werden gemeinsam referenzierte Memoquellen über Splitgrenzen
abgewiesen. Die verantwortliche Gruppierung weiterer zeitlich oder fachlich
abhängiger Fälle bleibt Teil der Datensatzkuratierung.

Da alle aktuellen Ergebnisse konservativ abstainen, beträgt Coverage 0.
`error_on_accepted`, Brier Score, Log Loss und ECE bleiben `null`. Es werden
keine Wahrscheinlichkeiten aus Rohscores abgeleitet. Die Evaluationsfunktionen
verwenden die Referenzen nicht als Eingabe der Annotation.

## Export und Kompatibilität

Die beiden bestehenden JSONL-Exporte bleiben verfügbar. Sie bevorzugen nun die
neueste individuelle Evidenzrevision und verwenden sonst den bisherigen
Legacy-Adapter. Ein zusätzlicher Download mit `mode=bundle` enthält:

- `manifest` mit Schema-/Pipeline-/Ontologieversion, Anzahl und Inhalts-Hashes;
- `inputs` mit den verwendeten Eingaben;
- `annotations` mit Baseline-Ergebnissen;
- `ontology` mit dem tatsächlich verwendeten Snapshot.

Die Hashes beziehen sich auf die kanonisierten JSON-Inhalte. Identische Daten
und Versionen ergeben identische Inhalte; ein Exportzeitpunkt verändert keine
Annotationsidentität. Das Paket ist eine Pilotübergabe und enthält weiterhin
keine Audio- oder Samplingdateien.

Inputschema und Ontologiesnapshot bleiben kompatibel zum ersten Stand.
Pipeline und Ergebnisschema heißen nun `0.2.0` bzw. `ap3-result/0.2.0`.
Vor dem ersten Start dieses Stands ist nach Sicherung einer vorhandenen lokalen
Datenbank `npm run db:push` für die zusätzliche Revisionstabelle erforderlich.
Der Patch verändert keine bestehenden Erfassungszeilen.

## Validierung dieses Stands

- 45 automatisierte Tests für bisherige Regeln und die neuen Batch-, Referenz-,
  Export- und SQLite-Revisionsabläufe erfolgreich.
- TypeScript-Prüfung und Produktionsbuild erfolgreich.
- ESLint ohne Fehler; die zwei bereits im Ausgangsstand vorhandenen Warnungen
  zu ungenutzten Symbolen bleiben bestehen.
- Prüfung im Chromium-Browser gegen den Produktionsserver: individuelle
  Merkmale und Memo gespeichert, zwei Revisionen erzeugt, veralteten zweiten
  Tab abgewiesen, fehlenden Pflichtkontext diagnostiziert, aktuelle Revision
  exportiert, gemeinsame Notiz bei einer anderen Beobachtung erhalten,
  fremde Studiendaten ausgeschlossen und Paketdownload geprüft.
- Die Browserprüfung verwendete ausschließlich die bereits lokal angelegten
  synthetischen Testbeobachtungen. Keine JavaScript-Seitenfehler beobachtet.

## Weiterhin offene Arbeit

Die Ontologie umfasst weiterhin 19 experimentelle ProductionState-Klassen.
Der externe KI-Adapter, der Aufbau eines fachlich geprüften Referenzkorpus,
die vollständige AP2-Erfassung, empirische Evidenzkombination und Kalibrierung,
tragfähige Granularitäts-/Abstain-Schwellen und der endgültige AP5-Vertrag
stehen noch aus. Die Erweiterung schafft dafür eine nutzbare Daten- und
Versuchsstrecke; AP3 ist damit weiterhin ein früher Forschungsprototyp.
