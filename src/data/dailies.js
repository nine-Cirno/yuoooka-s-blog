// 该文件用于汇总所有日常记录
import { parseMarkdown } from '../utils/markdownParser.js';

// Load all markdown files from daily/md directory
const markdownModules = import.meta.glob('./daily/md/*.md', { query: '?raw', eager: true });

const markdownDailies = Object.keys(markdownModules).map((key) => {
    const rawContent = markdownModules[key].default;
    const filename = key.split('/').pop().replace(/\.md$/, '');
    return parseMarkdown(rawContent, filename);
}).filter(post => post !== null);

export const dailies = [
  ...markdownDailies
];
