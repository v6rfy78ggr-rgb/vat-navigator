# VAT Navigator 2.1

[English](README.md) · [Deutsch](README.de.md) · [简体中文](README.zh-CN.md)

[Projektübersicht](https://v6rfy78ggr-rgb.github.io/v6rfy78ggr-rgb/de.html) · [Kurzer Einstieg](TRY_IT.md) · [Versionen](https://github.com/v6rfy78ggr-rgb/vat-navigator/releases) · [Demo öffnen](https://v6rfy78ggr-rgb.github.io/vat-navigator/)

Ein browserbasiertes Werkzeug zur Vorprüfung grenzüberschreitender Einkäufe und Verkäufe aus Sicht einer deutschen GmbH. Aus ausgewählten Sachverhaltsangaben entstehen eine nachvollziehbare Einordnung, offene Voraussetzungen, Hinweise zur Rechnungsstellung und Links zu amtlichen Quellen.

## Ausprobieren

Das Repository über **Code → Download ZIP** herunterladen und entpacken. Anschließend `python3 -m http.server 8000 --directory dist` ausführen und <http://localhost:8000> öffnen. Mit einem integrierten Beispiel beginnen und eine wesentliche Tatsache ändern. Wegen der ES-Module ist ein lokaler HTTP-Server erforderlich; ein Doppelklick auf die HTML-Datei genügt nicht.

Die Anwendung ist auf **Deutsch und Chinesisch** verfügbar. Eine englische Benutzeroberfläche ist noch nicht enthalten. Es ist keine Paketinstallation erforderlich. Für `npm test` wird Node.js ab Version 20 benötigt.

## Funktionsumfang

- Warenketten mit Deutschland, weiteren EU-Mitgliedstaaten und Drittlandszielen; Transportzuordnung und Staat der verwendeten USt-IdNr. werden getrennt erfasst.
- Dreiecksgeschäfte, B2B/B2C, Fernverkaufs-/OSS-Vorprüfung und Betriebsstätten desselben Rechtsträgers.
- Werklieferungen, Werkleistungen und Montagefälle, jeweils getrennt für Einkauf und Weiterverkauf.
- Druckbarer bzw. herunterladbarer Ergebnisnachweis mit Tatsachen, Voraussetzungen und Quellen. Fehlende Angaben verhindern vorbehaltlose Rechnungsformulierungen.

## Stand und Grenzen

Fachlicher Prüfprototyp. Quellenstand: **5. November 2026**; Veröffentlichungstests: **23. November 2026**. Diese Tests aktualisieren den Rechtsstand nicht. Ausländische Registrierungspflichten, lokale Umsatzsteuer und Reverse Charge müssen vor Ort geprüft werden. Sonderregelungen, Einfuhren mit Ursprung außerhalb der EU und komplexe Leistungsbündel sind nicht allgemein abgedeckt. USt-IdNr., Nachweise und Ansässigkeit beruhen auf Nutzereingaben.

`npm test` bestand 110 repräsentative Fälle, 2.880 Sachverhaltskombinationen und den deutsch-chinesischen Ergebnisvergleich. Das bestätigt das getestete Programmverhalten, keine verbindliche steuerliche Beurteilung.

## Daten und Weiterentwicklung

Die Prüfung läuft im Browser. Die Spracheinstellung wird lokal gespeichert; beim Sprachwechsel werden Angaben im Sitzungsspeicher bzw. ersatzweise im URL-Fragment übertragen. Keine vertraulichen Identifikatoren eingeben. Hosting-Anbieter können übliche Metadaten von Seitenaufrufen erhalten.

Chinesische Quellmodule liegen in `dist/`. Deutsche Übersetzungen in `i18n/de.json` bearbeiten, danach `npm run build:locales` und `npm test` ausführen. Generierte deutsche Module nicht separat bearbeiten.

Besonders willkommen: fiktive Gegenbeispiele zur Transportzuordnung, fehlende Voraussetzungen, Rechnungshinweise und unklare Fachbegriffe. Erwartetes Ergebnis und Rechtsquelle bitte angeben.

## Mitwirken

[Fehler melden oder Verbesserung vorschlagen](https://github.com/v6rfy78ggr-rgb/vat-navigator/issues/new/choose). Rückmeldungen auf Deutsch, Englisch und Chinesisch sind willkommen. Ausschließlich fiktive Daten verwenden; Issues sind öffentlich. Zum Prüfprozess siehe [CONTRIBUTING.md](CONTRIBUTING.md), zur MIT-Lizenz [LICENSE](LICENSE).
