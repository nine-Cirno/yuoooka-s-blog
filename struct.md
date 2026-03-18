# 项目结构文档 (struct.md)

这份文档旨在为后续的修改提供项目结构的上下文参考。

## 1. 项目概览
这是一个基于 Vue.js (Vite) 的个人主页/博客项目，使用了 Vuetify 作为 UI 框架。项目包含基本的静态页面展示、图表组件、打字机效果以及一些实用工具。部署配置指向 Cloudflare Workers。

## 2. 根目录文件
- **package.json**: 项目依赖管理文件。核心依赖包括 `vue`, `vuetify`, `vite`, `chart.js` 等。
- **vite.config.js**: Vite 构建配置文件，配置了 Vue 插件。
- **wrangler.jsonc**: Cloudflare Workers 部署配置文件，指定了构建输出目录为 `./dist`。
- **index.html**: 项目的入口 HTML 文件。
- **LICENSE**: 开源协议文件。
- **README.md**: 项目说明文档。

## 3. 源码目录 (src/)
核心代码位于 `src/` 目录下。

### 核心文件
- **src/main.js**: Vue 应用的入口文件。负责创建 Vue 实例，初始化 Vuetify 插件，并挂载应用。
- **src/App.vue**: 根组件文件。包含了应用的主模版结构 (Template) 和样式 (Style)。
- **src/app.js**: `App.vue` 的逻辑脚本文件。被 `App.vue` 引用，包含组件注册、数据状态和生命周期逻辑。
- **src/config.js**: 全局配置文件。包含网站元数据 (Title, Description)、个人信息、主题颜色、链接等配置。

### 组件目录 (src/components/)
存放 Vue 组件，用于页面的不同部分。
- **src/components/hoemright.vue**: (可能存在拼写错误 `homeright`) 主页右侧的主要内容区域，包含欢迎语、搜索框等。
- **src/components/loader.vue**: 页面加载时的 Loading 动画组件。
- **src/components/polarchart.vue**: 极坐标图表组件，使用 `chart.js` 实现。
- **src/components/turntable.vue**: 一个具有 3D 效果的 SVG 转盘装饰组件。
- **src/components/typewriter.vue**: 打字机效果组件，使用 `typeit` 库实现文字动态展示。
- **src/components/tabs/**: 包含选项卡内容的子组件目录。
  - **tab1.vue**: 选项卡 1 内容。
  - **tab2.vue**: 选项卡 2 内容。
  - **tab3.vue**: 选项卡 3 内容。

### 工具目录 (src/utils/)
存放通用的 JavaScript 工具函数。
- **src/utils/common.js**: 通用工具函数，主要用于设置网页 Meta 标签 (Title, Keywords, Description) 等 DOM 操作。
- **src/utils/cookieUtils.js**: Cookie 操作工具函数 (setCookie, getCookie)。

## 4. 资源目录 (public/)
存放静态资源文件。
- **public/img/**: 图片资源。
- **public/css/**: 样式文件。
- **public/fonts/**: 字体文件。

## 5. 修改建议与注意事项
- **配置修改**: 大部分个性化内容（如标题、链接、颜色）应优先在 `src/config.js` 中修改。
- **组件逻辑**: 修改根组件逻辑时，请查看 `src/app.js` 而非仅关注 `src/App.vue`。
- **样式调整**: 全局样式可能位于 `src/App.vue` 或 `public/css` 中，组件特有样式在各 `.vue` 文件中。
