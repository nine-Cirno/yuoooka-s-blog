// 该文件用于汇总所有文章
// 新增文章后，请在此处 import 并添加到 posts 数组中

import Atri_Re_2 from './articles/Atri_Re_2.js';
import { parseMarkdown } from '../utils/markdownParser.js';

// Load all markdown files
// Use Vite's import.meta.glob with { query: '?raw', eager: true } to get content synchronously
const markdownModules = import.meta.glob('./articles/md/*.md', { query: '?raw', eager: true });

const markdownPosts = Object.keys(markdownModules).map((key) => {
    const rawContent = markdownModules[key].default;
    // Extract filename from path (e.g., "./articles/md/my-post.md" -> "my-post")
    const filename = key.split('/').pop().replace(/\.md$/, '');
    return parseMarkdown(rawContent, filename);
}).filter(post => post !== null); // Filter out any posts that failed to parse

export const posts = [
  Atri_Re_2,
  ...markdownPosts
];
