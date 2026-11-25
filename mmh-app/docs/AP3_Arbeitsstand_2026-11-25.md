# AP3 – Arbeitsstand am 25.11.2026

Ausgangspunkt ist der geprüfte GitHub-Stand `41d44b2` vom 16.11.2026. Der
Entwicklungsschritt führt die seit dem 11.11. aufgebaute AP3-Strecke fort:
Schnittstellen und Regelbaseline, individuelle Evidenzrevisionen, kontrollierter
KI-Antwortvertrag und erste Referenzauswertung sind bereits vorhanden.

Das AP3-Konzept v4 sieht im November Kandidatenbildung, Regeln,
Sprach-/Textverarbeitung und eine erste kontrollierte KI-Komponente vor.
Der aktuelle Schritt vertieft deshalb Regelrobustheit und experimentelle
Vergleichbarkeit. Kalibrierung und endgültige Granularitätsentscheidungen
bleiben spätere Arbeitsschritte. Die Dokumentation hält den implementierten
Stand und seine technische Validierung fest.

## Umgesetzt

- Zusätzliche kontrollierte Memoformulierungen für Warten auf Maschine,
  Personal und Vorprozess sowie ausdrücklich geplantes Rüsten und Prüfen.
- „Material ist vorhanden“ als negative Evidenz gegen Materialmangel. Die
  strukturierte Beobachtung und widersprechender Memotext bleiben im Audit
  getrennt sichtbar; ein kleiner Nettoscore verdeckt den Konflikt nicht.
- Widersprüche in beiden Richtungen zwischen `machine_status` und Memo:
  Maschine beobachtet als laufend, Memo sagt Stillstand; ebenso umgekehrt.
  `audit.channel_conflicts` enthält Merkmal, beide Werte und exakte Fundstelle
  im ursprünglichen Text. Widerspruch kann auch ohne positive Klassenevidenz
  zu `ABSTAIN_CONFLICTING_EVIDENCE` führen. Niedrige Beobachtungsqualität
  behält ihren konservativen Vorrang.
- Erweiterte Unterdrückung konditionaler Aussagen wie „Falls Personal fehlt“.
  Fragen, negierte, historische und hypothetische Aussagen erhalten durch
  diese engen Muster keine unbedingte Evidenz.
- Gepaarter Vergleich von E1 allein, E2 allein und E1+E2. Die Kanäle werden
  innerhalb derselben Pipeline gezielt deaktiviert. Input-Snapshot und
  Input-Hash bleiben unverändert; Konfiguration und Annotations-ID unterscheiden
  die Versuche. Qualität und Kontextprüfung bleiben in allen Varianten aktiv.
- Zusätzliche Metriken für positive Evidenztreffer und mittlere Kandidatenzahl.
  Ein vollständiger Kandidatenraum ohne positives Signal kann zwar die
  Referenzklasse enthalten, ist aber noch kein gestützter Treffer.

## Ausführen

Aus `mmh-app/` nach `npm ci`:

```bash
npm run test:ap3
npm run typecheck
npm run lint
npm run --silent ap3:compare -- tests/fixtures/ap3/observations.jsonl tests/fixtures/ap3/references.jsonl
```

`ap3:compare` akzeptiert Beobachtungen und Referenzen als JSONL. Ungültige oder
doppelte Eingaben, fehlende Referenzen sowie Splitverletzungen verhindern
die Berichtsausgabe und führen zu Exitcode 1. Die bestehenden Regeln gegen
geteilte Memoquellen über Entwicklungs-/Testgrenzen gelten weiterhin.
Die Reihenfolge der Datensätze in den Eingabedateien verändert den Bericht nicht.

Jede Variante enthält einen vollständigen Evaluationsbericht und je Observation
Status, gestützte Klassen, Kandidatenanzahl und verwendete Konfiguration.
Eine gepaarte Übersicht zeigt Änderungen der Entscheidung, Änderungen der
gestützten Klassen und Konflikte in der Kombination.

ObserverHint wird in allen drei Vergleichsvarianten deaktiviert. Externe
KI-Antworten sind nicht Teil dieses E1/E2-Vergleichs; der bestehende separate
Replay-Lauf bleibt verfügbar. Die Ergebnisse sind keine unabhängigen
Messwiederholungen und werden nicht zu einer Wahrscheinlichkeitsverteilung
zusammengerechnet.

## Technische Demonstration

Die vorhandenen zehn synthetischen Fälle enthalten vier Klassenreferenzen und
sechs erwartete Abstain-Fälle. Auf genau diesen vier Klassenfällen ergibt sich:

| Variante           | Referenz mit positivem Score gestützt | Rohscore-Top-1 trifft Referenz |
| ------------------ | ------------------------------------- | ------------------------------ |
| Beobachtung allein | 1/4                                   | 1/4                            |
| Memo allein        | 3/4                                   | 3/4                            |
| Kombination        | 4/4                                   | 1/4                            |

Die Kombination findet zusätzliche Unterstützung, ihre unkalibrierte Rangfolge
bevorzugt aber häufig eine Oberklasse gegenüber der spezifischen Referenz.
Deshalb bleibt `resolved` weiterhin `null`. Die Zahlen sind technische
Regressionsbefunde auf entwicklungsbekannten Beispielen, kein Nachweis einer
Überlegenheit auf unabhängigen Realdaten. Die Auswertung trennt synthetische
und menschlich geprüfte Daten weiterhin; ein empirischer Referenzkorpus fehlt.

## Versionen und Grenzen

- Pipeline `0.3.0`, Ruleset `0.2.0`, Ergebnisschema `ap3-result/0.3.0`.
- Evaluationsschema `ap3-evaluation/0.2.0` und Vergleichsschema
  `ap3-channel-comparison/0.1.0`.
- Inputschema und experimenteller AP1-Ausschnitt mit 19 Klassen unverändert.
- Keine zusätzliche Datenbankmigration in diesem Entwicklungsschritt.
- 61 automatisierte Tests, einschließlich neuer Memo-, Konflikt-,
  Reproduzierbarkeits- und CLI-Fälle. TypeScript und Lint ohne Fehler;
  zwei bereits vorhandene Lint-Warnungen bleiben bestehen.

Die Textregeln sind bewusst begrenzte deutsche Muster mit einem einfachen
Satzteilfilter. Sie leisten keine allgemeine Verarbeitung von Negation,
Zeitbezug, indirekter Rede oder langen Schachtelsätzen. Die zusätzlichen
Muster müssen mit echten, fachlich geprüften Memos weiter untersucht werden.

Offen bleiben der operative Modelladapter, vollständigere Ontologieabdeckung,
Referenzannotation mit fachlicher Zweitprüfung, empirische Kalibrierung,
validierte G3/G2/G1-Fallbacks und die abschließende probabilistische AP5-Übergabe.
Der aktuelle Stand liefert dafür eine reproduzierbare Vorstufe.
