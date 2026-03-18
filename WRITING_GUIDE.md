# 博客写作指南 (Writing Guide)

本指南将帮助您了解如何为本博客系统添加新文章。

## 1. 文章数据位置
所有的博客文章数据都存储在 `src/data/posts.js` 文件中。这是一个 JavaScript 模块，导出一个包含所有文章对象的数组 `posts`。

## 2. 添加新文章
要添加新文章，请在 `posts` 数组中添加一个新的对象。对象结构如下：

```javascript
  {
    id: 'unique-post-id',           // 唯一标识符（建议使用英文，类似于 URL slug）
    title: '文章标题',               // 文章显示的标题
    date: '2023-10-27 10:00:00',    // 发布日期
    tags: ['标签1', '标签2'],        // 标签数组
    categories: ['分类1'],           // 分类数组
    description: '这是一段简短的摘要...', // 文章摘要，显示在列表页
    content: `
      <p>这里是文章的正文内容...</p>
      <h2>这是一个二级标题</h2>
      <p>正文内容支持 <strong>HTML</strong> 格式。</p>
      <pre><code>console.log('支持代码块');</code></pre>
      <img src="/img/posts/your-image.jpg" alt="图片描述" />
    `
  }
```

## 3. 详细字段说明

### ID (`id`)
*   **类型**: String
*   **作用**: 用于内部索引和潜在的 URL 路由（目前主要用于 Vue 的 `key`）。
*   **规范**: 推荐使用英文、数字和连字符，例如 `my-first-post`。

### 标题 (`title`)
*   **类型**: String
*   **作用**: 文章的主标题。

### 日期 (`date`)
*   **类型**: String
*   **格式**: 推荐使用 `YYYY-MM-DD HH:mm:ss` 格式，归档页面会解析此日期进行排序。

### 标签与分类 (`tags`, `categories`)
*   **类型**: Array of Strings
*   **作用**: 
    *   `tags`: 用于标签云和相关文章筛选。
    *   `categories`: 目前主要用于展示。

### 摘要 (`description`)
*   **类型**: String
*   **作用**: 在博客首页列表展示的简短介绍。建议控制在 100 字以内。

### 正文 (`content`)
*   **类型**: String (HTML Template Literal)
*   **书写方式**: 使用反引号 \` 包裹，这样可以支持多行文本。
*   **格式要求**:
    *   **段落**: 使用 `<p>` 标签包裹。
    *   **标题**: 使用 `<h2>` 和 `<h3>` 标签。**注意：** 自动目录 (TOC) 功能只会抓取 `<h2>` 和 `<h3>` 标签。
    *   **代码**: 使用 `<pre><code>...</code></pre>` 包裹代码块。
    *   **图片**: 使用 `<img src="..." />` 标签。

## 4. 图片资源管理
*   **存放位置**: 将图片文件放入项目的 `public/img/posts/` 目录下（如果没有该目录请新建）。
*   **引用方式**: 在 `content` 中使用绝对路径引用，例如 `/img/posts/my-pic.jpg`。
    *   *注意*: 不需要写 `public`，构建后 `public` 目录的内容会被映射到根目录。

## 5. 目录 (TOC) 功能
博客详情页会自动根据文章内容中的 `<h2>` 和 `<h3>` 标签生成右侧的目录导航。
*   无需手动添加 ID，系统会自动生成。
*   点击目录项会自动平滑滚动到对应位置。

## 6. 示例

```javascript
// src/data/posts.js

export const posts = [
  {
    id: 'hello-world',
    title: 'Hello World',
    date: '2025-01-01',
    tags: ['Life'],
    categories: ['Diary'],
    description: 'My first blog post.',
    content: `
      <h2>Introduction</h2>
      <p>Welcome to my blog.</p>
      <h3>Chapter 1</h3>
      <p>Content goes here...</p>
    `
  },
  // ... 其他文章
];
```
