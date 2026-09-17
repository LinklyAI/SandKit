[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](docs/README.ja.md) | [한국어](docs/README.ko.md) | [Español](docs/README.es.md) | [Deutsch](docs/README.de.md) | [Русский](docs/README.ru.md)

# SandKit

把图片和文字变成可交互的沙画。由 [Linkly AI](https://linkly.ai/) 开源，采用 [MIT](LICENSE) 协议。

一张线稿决定沙粒的位置，一张可选的深度图赋予画面视差。沙粒散开、飞行，再聚成下一幅图案或文字。

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

运行和 API 说明见 [英文 README](README.md)。公开演示计划部署在官网域名下；当前仓库不代表已完成线上部署或包发布。

展示页与编辑器支持中英文，构建输出可抓取的静态 HTML、独立语言元数据与 sitemap，沿用 Linkly AI 官网的暖白背景与 SandKit 蓝色主题。

## Built with Linkly AI

[Linkly AI](https://linkly.ai/zh) 是 AI Agent 的知识大脑，让 Agent 检索和阅读你的笔记、文档、音频与视频。

[获取 Linkly AI](https://linkly.ai/zh#get-started) · [X @linkly_ai](https://x.com/linkly_ai)
