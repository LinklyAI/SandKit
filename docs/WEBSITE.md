# 官网接入

正式入口为 `https://linkly.ai/sandkit/`，中文为 `/sandkit/zh/`；editor 对应 `/sandkit/editor/` 与 `/sandkit/zh/editor/`。正式部署需单独执行；本仓库不配置 GitHub Pages，也不宣称官网路径已经上线。

## 构建与挂载

执行 `node scripts/build.mjs`，把生成的 `dist/sandkit/` 完整放进官网的静态资源目录（Next.js 项目可放到 `public/sandkit/`）。它包含展示页、editor、核心 ES 模块、Worker 和示例素材，所有链接均使用相对路径，可整体挂载。

配置官网路由使四个页面入口返回各自目录下的 `index.html`；不带斜杠的入口先重定向到带斜杠路径。不要将该前缀误送入语言重定向或鉴权中间件。其余静态资源按原路径返回正确 MIME 类型。

也可以由官网 Next.js 客户端组件直接消费核心与 React 封装，复用官网导航、语言路由。不要复制一份独立的渲染器。

## 产品边界

- 展示页：效果、内置示例、文字体验、GitHub 和回到官网入口。
- Editor：30 个数值参数、色盘、预设、通道检查、配置导入导出和分享。
- 图片生成与处理：在 Codex 中使用 Skills；Markdown 上手指引直接链接 GitHub `GETTING_STARTED.md`。

## 上线检查

验证四个语言页面、Worker、WebP、分享链接、语言切换和回官网链接。构建已生成各页的 canonical、双向 hreflang、Open Graph、Twitter 卡片、结构化数据及 `/sandkit/sitemap.xml`。上线时将此 sitemap 接入官网现有 sitemap 索引或 robots.txt，保留官网其他规则；不要用子项目覆盖官网 robots.txt。上线后再更新 README 在线入口与官网导航；不把尚未部署的地址标作 live demo。

仓库的 About 链接在正式上线前指向 `https://linkly.ai/`，上线后可更新为正式展示页。发布构建和实际部署分别执行，部署前必须确认目标。

## 品牌与多语言

样式依据官网 `app/themes/cool.css` 与 `HeroSection.tsx`：暖白 `#fffbf9`、中性黑灰、琥珀色 `#f59e0b`、无衬线轻字重标题。居中 Hero、纵向章节、大幅演示区与胶囊按钮对齐官网。沙画保留蓝色，默认文字演示为放大的 `LINKLY AI`。

官网使用 next-intl，并支持 en/zh/ja/es/fr/ru。本项目保持无运行时依赖，使用 `site/locale.js` 的翻译表与 `scripts/pages.mjs` 生成完整的中英文 HTML；不是仅靠浏览器替换文字。开发服务器复用同一生成函数，构建产物可直接静态托管。参数 JSON 的键不翻译，跨语言分享可互通。

新增语言时需同时补齐展示页、编辑器、参数说明、页面元数据和路由，再加入 hreflang 与 sitemap。未完成翻译的语言不对外开放。

各语言页使用自身 canonical；语言由 URL 决定，不根据浏览器语言强制跳转。SEO 依据 [Google 多语言页面指南](https://developers.google.com/search/docs/specialty/international/localized-versions)。索引与排名需要上线后验证，不由元数据保证。
