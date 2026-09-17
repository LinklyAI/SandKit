<div align="center">

<img src="../site/mark.svg" width="64" alt="SandKit">

# SandKit

**Превращайте изображения и текст в интерактивные песочные анимации.**

[![Checks](https://github.com/LinklyAI/SandKit/actions/workflows/check.yml/badge.svg)](https://github.com/LinklyAI/SandKit/actions/workflows/check.yml)
[![MIT](https://img.shields.io/badge/license-MIT-blue)](../LICENSE)
[![WebGL2](https://img.shields.io/badge/WebGL2-zero_runtime_dependencies-4a71ee)](../docs/API.md)
[![Stars](https://img.shields.io/github/stars/LinklyAI/SandKit?color=4a71ee)](https://github.com/LinklyAI/SandKit)
[![X](https://img.shields.io/badge/X-%40linkly_ai-000000?logo=x&logoColor=white)](https://x.com/linkly_ai)

[English](../README.md) | [简体中文](../README.zh-CN.md) | [日本語](../docs/README.ja.md) | [한국어](../docs/README.ko.md) | [Español](../docs/README.es.md) | [Deutsch](../docs/README.de.md) | [Русский](../docs/README.ru.md)

[Открыть демо](https://linkly.ai/sandkit) · [Начать в Codex](../GETTING_STARTED.md) · [Linkly AI](https://linkly.ai/)

⭐ Поставьте звезду SandKit, чтобы следить за новыми примерами и навыками.

</div>

<!-- DEMO:START -->
<!-- Insert the supplied GIF here, linked to the official demo. Store it at docs/assets/demo.gif. -->
<p align="center"><a href="https://linkly.ai/sandkit">Открыть демо →</a></p>
<!-- DEMO:END -->

## Начало работы в Codex

Вставьте эту инструкцию в Codex:

> Прочитай https://github.com/LinklyAI/SandKit/blob/main/GETTING_STARTED.md и по инструкции настрой два навыка SandKit, затем создай и запусти в текущей папке интерактивную песочную демонстрацию со встроенными примерами.

Для первого запуска используются готовые примеры. Для создания своих изображений нужна сессия Codex с генерацией изображений. Среда может запрашивать разрешения.

## Локальный запуск

Требуется Node.js 22 или новее. Ядро, демонстрация и редактор работают без установки зависимостей.

```sh
git clone https://github.com/LinklyAI/SandKit.git
cd SandKit
node scripts/serve.mjs
```

- Demo: `http://127.0.0.1:4173/site/`
- Editor: `http://127.0.0.1:4173/site/editor/`

## Возможности

- Независимый от фреймворка рендерер WebGL2 и необязательный адаптер React.
- Редактор: 30 числовых параметров, пресеты, цвета, текст, управление воспроизведением, просмотр линий и глубины, импорт/экспорт JSON и ссылки для обмена настройками.
- **[sandkit-art](../skills/sandkit-art/SKILL.md)**: Создание и проверка рисунков и оценочных карт глубины.
- **[sandkit-build](../skills/sandkit-build/SKILL.md)**: Создание, интеграция и оптимизация кода анимации.
- Рисунки и карты глубины: мозг, Macintosh, стопка книг и пишущая машинка.

Сайт содержит демонстрации и ввод текста на английском и китайском. Свои изображения создаются навыками в Codex. Глубина оценивается для эффекта параллакса и не является точным 3D-измерением.

## Разработка и документация

```sh
node scripts/check.mjs
node --test tests/*.test.js
node scripts/build.mjs
```

Статическая сборка создаётся в dist/sandkit/. Развёртывание на официальном сайте и публикация пакета выполняются отдельно; наличие уже опубликованной версии не предполагается.

[API (English)](API.md) · [README (English)](../README.md) · [Contributing (English)](../CONTRIBUTING.md) · [Security (English)](../SECURITY.md)

## Лицензия

MIT. Сгенерированные примеры предоставляются на тех же условиях в пределах имеющихся прав. Права на товарные знаки не передаются.

[MIT](../LICENSE) · [Asset provenance (English)](../skills/sandkit-art/assets/PROVENANCE.md)

## Built with Linkly AI

Linkly AI — база знаний для ИИ-агентов. Ваш агент может искать и читать заметки, документы, аудио и видео.

[Linkly AI](https://linkly.ai/#get-started) · [X @linkly_ai](https://x.com/linkly_ai)
