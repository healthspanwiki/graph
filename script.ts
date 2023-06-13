import getPageTitles from "./helpers/getPageTitles";
import getPageContent from "./helpers/getPageContents";
import { Page } from "./types/Page";
import login from "./helpers/login";
import * as dotenv from 'dotenv';
import editPage from "./helpers/editPage";
import makeFetchCookie from 'fetch-cookie'
import getPageContents from "./helpers/getPageContents";
dotenv.config();

async function main() {
    const titles = await getPageTitles();
    const pages: Page[] = await getPageContents(titles)

    const pageTitleSet = new Set()
    for (const page of pages) {
        pageTitleSet.add(page.title)
    }

    const deadLinksSet = new Set<string>()

    for (const page of pages) {
        for (const link of page.links) {
            if (!pageTitleSet.has(link)) {
                deadLinksSet.add(link)
            }
        }
    }


    const deadLinks: string[] = Array.from(deadLinksSet)

    const originalFetch = require('node-fetch');
    const fetch = makeFetchCookie(originalFetch, new makeFetchCookie.toughCookie.CookieJar())
    const token = await login(fetch, process.env.BOT_USERNAME || '', process.env.BOT_PASSWORD || '')

    console.log(token)

    // Step 1: Append 'Red' category to pages without a category
    for (const page of pages) {
        if (!page.categories.includes("Red") && !page.categories.includes("Green") && !page.categories.includes("Yellow")) {
            const content = page.content + "\n[[Category:Red]]";
            await editPage(fetch, page.title, content, token);
        }
    }

    // Step 2: Create new pages for deadlinks
    for (const deadLink of deadLinks) {
        const content = "empty\n[[Category:Red]]";
        await editPage(fetch, deadLink, content, token);
    }
}

main();
