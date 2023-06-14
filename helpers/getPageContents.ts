import { Page } from "../types/Page";
import { Logger } from 'winston';

/**
 * Get the page contents given an array of page titles.
 * @param titles titles of the pages to get the contents of
 * @param logger winston logger instance
 * @returns array of complete page objects
 */
export default async function getPageContents(titles: string[], logger: Logger): Promise<Page[]> {
    const pages: Page[] = []

    for (let i = 0; i< titles.length; i+=10) {
        const tenTitles = titles.splice(i, Math.min(i+10, titles.length))
        const tenPages = await get10PageContents(tenTitles, logger)
        for (const page of tenPages) {
            pages.push(page)
        }
    }

    return pages
}

/**
 * Get the page content for up to 10 page titles. 
 * 
 * @param titles up to 10 titles to get the contents of
 * @param logger winston logger instance
 * @returns the contents of each of the 10 pages
 */
export async function get10PageContents(titles: string[], logger: Logger): Promise<Page[]> {
    const titlesString = titles.join('|')
    const url = 'https://healthspan.wiki/w/api.php?action=query&prop=links|categories|revisions&rvprop=content&pllimit=max&plnamespace=0&cllimit=max&format=json&titles=' + encodeURIComponent(titlesString);

    const contents: Page[] = []

    await fetch(url)
        .then(response => response.json())
        .then(data => {
            const pages = Object.values(data.query.pages)

            for (let i = 0; i<pages.length; i++) {
                const page: any = pages[i]
                let content = '';
                let links: string[] = [];
                let categories: string[] = [];

                content = page.revisions[0]["*"]

                if (page.links) {
                    links = page.links.map((link: any) => link.title);
                }

                if (page.categories) {
                    categories = page.categories.map((category: any) => category.title.slice(9));
                }

                const pageFinal = { pageid: page.pageid, 
                    title: page.title, 
                    content, 
                    links, 
                    categories
                }
                
                contents.push(pageFinal)
            }
            
            logger.info(`Page content fetched for ${titlesString}`);
            
        })
        .catch(error => {
            logger.error(`Error fetching page content for ${titlesString}: ${error.message}`);
        });
    
    return contents
}
