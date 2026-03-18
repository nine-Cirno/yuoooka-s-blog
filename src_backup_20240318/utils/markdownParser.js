// This utility handles parsing markdown files with frontmatter.
import fm from 'front-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

/**
 * Parses raw markdown content into a structured object.
 * @param {string} rawContent - The raw content of the markdown file.
 * @param {string} filename - The filename (optional, for ID fallback).
 * @returns {object} The parsed post object.
 */
export function parseMarkdown(rawContent, filename = '') {
  // Parse frontmatter
  const { attributes, body } = fm(rawContent);
  
  // Render markdown body to HTML
  const htmlContent = md.render(body);

  // Extract metadata with defaults
  const id = attributes.id || filename.replace(/\.md$/, '').replace(/^\.\/.*\//, ''); // Remove path and extension
  const title = attributes.title || id;
  
  // Format date if present, otherwise use current date
  let date = attributes.date;
  if (date instanceof Date) {
      date = date.toISOString().replace('T', ' ').substring(0, 19);
  } else if (!date) {
      date = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  // Ensure arrays exist
  const tags = Array.isArray(attributes.tags) ? attributes.tags : [];
  const skills = Array.isArray(attributes.skills) ? attributes.skills : [];
  const categories = Array.isArray(attributes.categories) ? attributes.categories : [];
  
  // Image handling
  const img = attributes.img || '/img/default-cover.png';
  
  // Description handling
  const description = attributes.description || '';
  
  // Series handling
  const series = attributes.series || '';

  return {
    ...attributes,
    id,
    title,
    date,
    tags,
    skills,
    categories,
    series,
    img,
    description,
    content: htmlContent
  };
}
