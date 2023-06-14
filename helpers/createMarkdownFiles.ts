import { writeFileSync } from 'fs';
import { Page } from '../types/Page';

/**
 * Creates markdown files for each page
 * @param pages pages to create markdown files for
 */
export default async function createMarkdownFiles(pages: Page[]) {
    pages.forEach((page) => {
        const markdownContent = generateMarkdownContent(page);
        writeFileSync(`./markdown/${page.title.replace(/\s+/g, '_')}.md`, markdownContent);
    });
}

/**
 * Creates the markdown content for each page
 * @param page page to generate markdown content for
 * @returns the string content of the markdown file
 */
function generateMarkdownContent(page: Page): string {
    let markdown = `# ${page.title}\n`;

    markdown += `Link: [${page.title}](https://healthspan.wiki/wiki/${encodeURIComponent(page.title)})\n\n`;

    if (page.categories) {
        markdown += `## Page Categories\n`;
        page.categories.forEach((category) => {
            markdown += `- ${category}\n`;
        });
        // add a new line that gives information about categories
        markdown += `*For more information on categories, please see [[Welcome]]*\n\n`;
    }

    if (page.links) {
        markdown += `\n## This page links to\n`;
        if (page.links.length === 0) {
            markdown += `Nothing yet!\n`;
        }
        page.links.forEach((link) => {
            markdown += `- [${link}](https://healthspan.wiki/wiki/${encodeURIComponent(link)})\n`;
        });
    }

    return markdown;
}
