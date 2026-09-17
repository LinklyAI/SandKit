<div align="center">

<img src="site/mark.svg" width="64" alt="SandKit">

# SandKit

**用两个 Agent Skills，把图片和文字变成可交互的沙画。**

[![Checks](https://github.com/LinklyAI/SandKit/actions/workflows/check.yml/badge.svg)](https://github.com/LinklyAI/SandKit/actions/workflows/check.yml)
[![MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![WebGL2](https://img.shields.io/badge/WebGL2-zero_runtime_dependencies-4a71ee)](docs/API.md)
[![Stars](https://img.shields.io/github/stars/LinklyAI/SandKit?color=4a71ee)](https://github.com/LinklyAI/SandKit)
[![X](https://img.shields.io/badge/X-%40linkly_ai-000000?logo=x&logoColor=white)](https://x.com/linkly_ai)

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](docs/README.ja.md) | [한국어](docs/README.ko.md) | [Español](docs/README.es.md) | [Deutsch](docs/README.de.md) | [Русский](docs/README.ru.md)

[查看沙画演示](https://linkly.ai/sandkit/zh) · [在 Codex 中使用](GETTING_STARTED.md) · [Linkly AI](https://linkly.ai/)

⭐ 给 SandKit 一颗 Star，关注新素材与 Skills 更新。

</div>

<!-- DEMO:START -->
<!-- Insert the supplied GIF here, linked to the official demo. Store it at docs/assets/demo.gif. -->
<p align="center"><a href="https://linkly.ai/sandkit/zh">查看沙画演示 →</a></p>
<!-- DEMO:END -->

## 为什么做 SandKit

在 Codex 中完成从图片处理到动画代码的整个流程。SandKit 来自 [Linkly AI](https://linkly.ai/zh) 的引导体验，提供两个 Skills、WebGL2 渲染器、可视化编辑器和示例素材。

- **[sandkit-art](skills/sandkit-art/SKILL.md)**：制作线稿与配对的估算深度图。
- **[sandkit-build](skills/sandkit-build/SKILL.md)**：创建、接入和优化动画代码。
- **浏览器中预览**：查看效果、体验文字；自定义图片在 Codex 中制作。

## 在 Codex 中一句话开始

> 阅读 https://github.com/LinklyAI/SandKit/blob/main/GETTING_STARTED.md，按指引安装两个 SandKit Skills，使用内置素材在当前目录创建并启动可交互的沙画 demo。

首次使用内置素材即可看到效果。之后可以说：“制作一台复古相机的线稿与深度图，并替换到当前动画里。”自定义生图需要当前 Codex 会话有图像生成能力。

## 本地运行

需要 Node.js 22+，核心与演示无需安装依赖：

```sh
git clone https://github.com/LinklyAI/SandKit.git
cd SandKit
node scripts/serve.mjs
```

- 展示页：`http://127.0.0.1:4173/site/zh/`
- Editor：`http://127.0.0.1:4173/site/zh/editor/`

## 内容

- 框架无关 WebGL2 核心和可选 React 适配。
- 展示页：效果预览、文字体验、回到 Linkly AI 官网的入口。
- Editor：30 个数值参数、主题色盘、分组重置、预设、播放控制、构图比例、素材通道与叠图、配置导入导出和分享链接。
- `sandkit-art`：在 Codex 中制作线稿、估算深度与配对验收。
- `sandkit-build`：辅助创建、接入和优化动画代码。
- 大脑、Macintosh、书摞、打字机四组示例素材。

网页不承担图片生成。示例深度图用于视觉视差，不代表精确的三维测量结果。

运行和 API 说明见 [英文 README](README.md)。[官网演示](https://linkly.ai/sandkit/zh)将在 Web 发布后可用，包发布另行进行。

展示页与编辑器支持中英文，构建输出可抓取的静态 HTML、独立语言元数据与 sitemap，沿用 Linkly AI 官网的暖白背景与 SandKit 蓝色主题。

## Built with Linkly AI

[Linkly AI](https://linkly.ai/zh) 是 AI Agent 的知识大脑，让 Agent 检索和阅读你的笔记、文档、音频与视频。

[获取 Linkly AI](https://linkly.ai/zh#get-started) · [X @linkly_ai](https://x.com/linkly_ai)
