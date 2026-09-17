<div align="center">

<img src="../site/mark.svg" width="64" alt="SandKit">

# SandKit

**Bilder und Text als interaktive Sandanimationen.**

[![Checks](https://github.com/LinklyAI/SandKit/actions/workflows/check.yml/badge.svg)](https://github.com/LinklyAI/SandKit/actions/workflows/check.yml)
[![MIT](https://img.shields.io/badge/license-MIT-blue)](../LICENSE)
[![WebGL2](https://img.shields.io/badge/WebGL2-zero_runtime_dependencies-4a71ee)](../docs/API.md)
[![Stars](https://img.shields.io/github/stars/LinklyAI/SandKit?color=4a71ee)](https://github.com/LinklyAI/SandKit)
[![X](https://img.shields.io/badge/X-%40linkly_ai-000000?logo=x&logoColor=white)](https://x.com/linkly_ai)

[English](../README.md) | [简体中文](../README.zh-CN.md) | [日本語](../docs/README.ja.md) | [한국어](../docs/README.ko.md) | [Español](../docs/README.es.md) | [Deutsch](../docs/README.de.md) | [Русский](../docs/README.ru.md)

[Demo ansehen](https://linkly.ai/sandkit) · [In Codex starten](../GETTING_STARTED.md) · [Linkly AI](https://linkly.ai/)

⭐ Gib SandKit einen Stern für neue Beispiele und Skills.

</div>

<!-- DEMO:START -->
<!-- Insert the supplied GIF here, linked to the official demo. Store it at docs/assets/demo.gif. -->
<p align="center"><a href="https://linkly.ai/sandkit">Demo ansehen →</a></p>
<!-- DEMO:END -->

## In Codex starten

Diesen Prompt in Codex einfügen:

> Lies https://github.com/LinklyAI/SandKit/blob/main/GETTING_STARTED.md und richte nach der Anleitung die beiden SandKit-Skills ein. Erstelle und starte dann in diesem Verzeichnis eine interaktive Sand-Demo mit den mitgelieferten Beispielen.

Der erste Start verwendet die enthaltenen Beispiele. Eigene Bilder erfordern eine Codex-Sitzung mit Bildgenerierung. Berechtigungsabfragen der Umgebung können weiterhin erscheinen.

## Lokal starten

Node.js 22 oder neuer ist erforderlich. Kern, Demo und Editor benötigen keine Installation von Abhängigkeiten.

```sh
git clone https://github.com/LinklyAI/SandKit.git
cd SandKit
node scripts/serve.mjs
```

- Demo: `http://127.0.0.1:4173/site/`
- Editor: `http://127.0.0.1:4173/site/editor/`

## Enthalten

- Framework-unabhängiger WebGL2-Renderer und optionaler React-Adapter.
- Editor mit 30 numerischen Parametern, Voreinstellungen, Farben, Text, Wiedergabe, Linien- und Tiefenansicht, JSON-Import/-Export und teilbaren Links.
- **[sandkit-art](../skills/sandkit-art/SKILL.md)**: Erstellen und Prüfen von Linienzeichnungen und geschätzten Tiefenkarten.
- **[sandkit-build](../skills/sandkit-build/SKILL.md)**: Erstellen, Einbinden und Optimieren des Animationscodes.
- Linienzeichnungen mit Tiefenkarten: Gehirn, Macintosh, Bücherstapel und Schreibmaschine.

Die Website bietet Demos und Texteingabe auf Englisch und Chinesisch. Eigene Bilder entstehen mit den Skills in Codex. Die Tiefe dient dem Parallaxeneffekt und ist keine präzise 3D-Messung.

## Entwicklung und Dokumentation

```sh
node scripts/check.mjs
node --test tests/*.test.js
node scripts/build.mjs
```

Der statische Build wird in dist/sandkit/ erstellt. Bereitstellung auf der offiziellen Website und Paketveröffentlichung sind separate Schritte; eine bereits erfolgte Veröffentlichung wird nicht vorausgesetzt.

[API (English)](API.md) · [README (English)](../README.md) · [Contributing (English)](../CONTRIBUTING.md) · [Security (English)](../SECURITY.md)

## Lizenz

MIT. Die generierten Beispiele stehen im Rahmen der vorhandenen Rechte unter denselben Bedingungen. Markenrechte werden nicht eingeräumt.

[MIT](../LICENSE) · [Asset provenance (English)](../skills/sandkit-art/assets/PROVENANCE.md)

## Built with Linkly AI

Linkly AI ist die Wissensbasis für KI-Agenten. Dein Agent kann damit deine Notizen, Dokumente, Audioaufnahmen und Videos durchsuchen und lesen.

[Linkly AI](https://linkly.ai/#get-started) · [X @linkly_ai](https://x.com/linkly_ai)
