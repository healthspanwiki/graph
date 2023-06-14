import { writeFileSync } from 'fs';
import { Page } from '../types/Page';

/**
 * Creates markdown files for each page
 * @param pages pages to create markdown files for
 */
export default async function createMarkdownFiles(pages: Page[]) {
    pages.forEach((page) => {
        const markdownContent = generateMarkdownContent(page);
        // change the below line to replace spaces with underscores
        writeFileSync(`./markdown/${page.title.replace(/\s+/g, '_')}.md`, markdownContent);    
    });
}

/**
 * Creates the markdown content for each page
 * @param page page to generate markdown content for
 * @returns the string content of the markdown file
 */
function generateMarkdownContent(page: Page): string {
    let markdown = '# ' + page.title + '\n\n';

    markdown += `[${page.title} - HealthspanWiki](https://healthspan.wiki/wiki/${encodeURIComponent(page.title)})\n\n`;


    // find red, green, or yellow in page.categories and set to variables
    let red = false;
    let green = false;
    let yellow = false;
    page.categories.forEach((category) => {
        if (category === "Red") {
            red = true;
        } else if (category === "Green") {
            green = true;
        } else if (category === "Yellow") {
            yellow = true;
        }
    });
    // pick the color to use for the markdown file
    let color = "red";
    if (green) {
        color = "green";
    } else if (yellow) {
        color = "yellow";
    }

    if (color === "red") {
        markdown += process.env.RED_MARKDOWN
    } else if (color === "green") {
        markdown += process.env.GREEN_MARKDOWN
    } else if (color === "yellow") {
        markdown += process.env.YELLOW_MARKDOWN
    }

    if (page.categories) {
        markdown += `## Page Categories\n`;
        page.categories.forEach((category) => {
            markdown += `- ${category}\n`;
        });
        // add a new line that gives information about categories
        markdown += `*For more information on categories, please see [[${process.env.MARKDOWN_HOMEPAGE}]]*\n\n`;
    }

    if (page.links) {
        markdown += `## Links\n`;
        if (page.links.length === 0) {
            markdown += `Nothing yet!\n`;
        } else {
            page.links.forEach((link) => {
                markdown += `[[${link}]] | `;
            });
            markdown = markdown.slice(0, -3);
        }
        
    }

    return markdown;
}
