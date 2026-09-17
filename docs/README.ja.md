<div align="center">

<img src="../site/mark.svg" width="64" alt="SandKit">

# SandKit

**画像と文字をインタラクティブな砂のアニメーションに。**

[![Checks](https://github.com/LinklyAI/SandKit/actions/workflows/check.yml/badge.svg)](https://github.com/LinklyAI/SandKit/actions/workflows/check.yml)
[![MIT](https://img.shields.io/badge/license-MIT-blue)](../LICENSE)
[![WebGL2](https://img.shields.io/badge/WebGL2-zero_runtime_dependencies-4a71ee)](../docs/API.md)
[![Stars](https://img.shields.io/github/stars/LinklyAI/SandKit?color=4a71ee)](https://github.com/LinklyAI/SandKit)
[![X](https://img.shields.io/badge/X-%40linkly_ai-000000?logo=x&logoColor=white)](https://x.com/linkly_ai)

[English](../README.md) | [简体中文](../README.zh-CN.md) | [日本語](../docs/README.ja.md) | [한국어](../docs/README.ko.md) | [Español](../docs/README.es.md) | [Deutsch](../docs/README.de.md) | [Русский](../docs/README.ru.md)

[デモを見る](https://linkly.ai/sandkit) · [Codex で始める](../GETTING_STARTED.md) · [Linkly AI](https://linkly.ai/)

⭐ Star で新しいサンプルとスキルの更新をチェック。

</div>

<!-- DEMO:START -->
<!-- Insert the supplied GIF here, linked to the official demo. Store it at docs/assets/demo.gif. -->
<p align="center"><a href="https://linkly.ai/sandkit">デモを見る →</a></p>
<!-- DEMO:END -->

## Codex で始める

以下を Codex に貼り付けてください。

> https://github.com/LinklyAI/SandKit/blob/main/GETTING_STARTED.md を読み、手順に従って 2 つの SandKit スキルを設定し、付属サンプルを使って現在のディレクトリにインタラクティブな砂のデモを作成して起動してください。

初回は付属素材で試せます。独自の画像を生成するには、画像生成に対応した Codex セッションが必要です。ホスト環境の権限確認が表示される場合があります。

## ローカルで実行

Node.js 22 以降が必要です。コア、デモ、エディターに依存パッケージのインストールは不要です。

```sh
git clone https://github.com/LinklyAI/SandKit.git
cd SandKit
node scripts/serve.mjs
```

- Demo: `http://127.0.0.1:4173/site/`
- Editor: `http://127.0.0.1:4173/site/editor/`

## 同梱内容

- フレームワークに依存しない WebGL2 レンダラーと任意の React アダプター。
- 30 個の数値パラメーター、プリセット、色、文字、再生、線画・深度の確認、JSON の入出力と共有リンクを備えたエディター。
- **[sandkit-art](../skills/sandkit-art/SKILL.md)**: 線画と推定深度マップの作成・確認。
- **[sandkit-build](../skills/sandkit-build/SKILL.md)**: アニメーションのコード作成、組み込み、最適化。
- 脳、Macintosh、本の山、タイプライターの線画と深度マップ。

サイトは英語と中国語のデモと文字入力に対応しています。独自の画像は Codex のスキルで作成します。深度は視差表現用の推定値で、正確な 3D 計測ではありません。

## 開発とドキュメント

```sh
node scripts/check.mjs
node --test tests/*.test.js
node scripts/build.mjs
```

静的サイトは dist/sandkit/ に出力されます。公式サイトへのデプロイとパッケージ公開は別の作業であり、まだ公開済みとは限りません。

[API (English)](API.md) · [README (English)](../README.md) · [Contributing (English)](../CONTRIBUTING.md) · [Security (English)](../SECURITY.md)

## ライセンス

MIT。付属の生成素材は保有する権利の範囲で同じ条件を適用します。商標権は含まれません。

[MIT](../LICENSE) · [Asset provenance (English)](../skills/sandkit-art/assets/PROVENANCE.md)

## Built with Linkly AI

Linkly AI は AI エージェントのための知識基盤です。ノート、文書、音声、動画をエージェントから検索・参照できます。

[Linkly AI](https://linkly.ai/#get-started) · [X @linkly_ai](https://x.com/linkly_ai)
