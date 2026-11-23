# VAT Navigator 2.1

[English](README.md) · [Deutsch](README.de.md) · [简体中文](README.zh-CN.md)

A browser-based screening tool for cross-border purchases and sales from a German GmbH's perspective. It turns selected facts into a traceable assessment, open conditions, invoice guidance and official-source links.

## Try it

Download this repository using **Code → Download ZIP**, extract it, then run `python3 -m http.server 8000 --directory dist`. Open <http://localhost:8000>. Start with a built-in example and change one material fact. ES modules require a local HTTP server; double-clicking the HTML file is not supported.

The application has **German and Chinese** interfaces. This English README does not imply an English interface. No package installation is needed. Developers need Node.js 20 or later to run `npm test`.

## Coverage

- Goods chains involving Germany, other EU member states and third-country destinations, with transport attribution and VAT-ID country captured separately.
- Triangular transactions, B2B/B2C cases, distance-selling/OSS screening and same-entity branches.
- Work deliveries, work services and installation cases, assessed separately for purchase and resale.
- A printable/downloadable record of facts, conditions and references. Missing facts prevent unconditional invoice wording.

## Status and limits

This is a professional screening prototype. Source review baseline: **5 November 2026**; publication checks: **23 November 2026**. Publication checks do not update the underlying law. Foreign registration, domestic VAT and reverse charge need local review. Special schemes, imports originating outside the EU and complex composite contracts are outside the general workflow. VAT IDs, evidence and establishments are user declarations, not verified by a tax authority or live service.

`npm test` passed 110 representative paths, 2,880 fact combinations and German/Chinese parity checks. These establish the tested software behavior, not correctness for every legal case.

## Data and development

Assessment runs in the browser. Language preference is stored locally; language switching transfers the current facts through session storage, with a URL-fragment fallback. Do not enter confidential identifiers. Hosting providers may receive ordinary web-request metadata.

`dist/` contains the Chinese source modules. Edit German translations in `i18n/de.json`, run `npm run build:locales`, then `npm test`. Generated German modules should not be edited independently.

Feedback is especially useful on transport attribution, missing material facts, invoice conditions and unclear German terminology. Include a fictional scenario and the expected result with its legal source.

## Contribute

[Report an issue or suggest an improvement](https://github.com/v6rfy78ggr-rgb/vat-navigator/issues/new/choose). English, German and Chinese feedback is welcome. Use synthetic data only; public Issues are visible to everyone. See [CONTRIBUTING.md](CONTRIBUTING.md) for the review process and [LICENSE](LICENSE) for the MIT license.
