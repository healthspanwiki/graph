import { Logger } from 'winston';

interface Respect {
    apcontinue: string
}

/**
 * Get the titles of all pages on the wiki.
 * @param logger winston logger instance
 * @param continueObj needed for recursion
 * @returns a list of page titles
 */
export default async function getPageTitles(logger: Logger, continueObj?: Respect) {
    let url = 'https://healthspan.wiki/w/api.php?action=query&format=json&list=allpages&aplimit=500&maxage=0&smaxage=0';
    if (continueObj && continueObj.apcontinue) {
        url += '&apcontinue=' + encodeURIComponent(continueObj.apcontinue);
    }

    const titles: string[] = []

    await fetch(url)
        .then(response => response.json())
        .then(data => {
            const newPages = data.query.allpages
            for (const newPage of newPages) {
                titles.push(newPage.title)
            }
            
            if (data.continue) {
                // If there's more data, fetch it
                getPageTitles(logger, data.continue);
            }

            logger?.info(`Page titles fetched, fetched ${newPages.length} titles.`);
        })
        .catch(error => logger?.error(`Error fetching page titles: ${error.message}`));

    return titles
}
