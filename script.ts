import getPageTitles from "./helpers/getPageTitles";
import { Page } from "./types/Page";
import login from "./helpers/login";
import * as dotenv from 'dotenv';
import editPage from "./helpers/editPage";
import makeFetchCookie from 'fetch-cookie'
import getPageContents from "./helpers/getPageContents";
import createMarkdownFiles from "./helpers/createMarkdownFiles";
import { OAuth2Client } from 'google-auth-library';
import moment from 'moment';
import { google } from 'googleapis';
import { deleteAllFilesInFolder, uploadFilesToFolder } from "./helpers/drive";
import deleteMarkdownFiles from "./helpers/deleteMarkdownFiles";
import * as winston from 'winston';

dotenv.config();
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'healthspan' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `logs/${moment().format('YYYYMMDD_HHmmss')}.log` })
    ],
});

async function main() {
    const botUsername = process.env.BOT_USERNAME 
    const botPassword = process.env.BOT_PASSWORD
    const clientId = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET
    const refreshToken = process.env.REFRESH_TOKEN
    const folderId = process.env.FOLDER_ID
    if (!botUsername || !botPassword || !clientId || !clientSecret || !refreshToken || !folderId) {
        logger.error("Missing environment variable(s)");
        throw new Error("Missing environment variable(s)");
    }

    try {
        const titles = await getPageTitles(logger);
        const pages: Page[] = await getPageContents(titles, logger)
        logger.info(`Retrieved contents for ${pages.length} pages`);

        const pageTitleSet = new Set()
        for (const page of pages) {
            pageTitleSet.add(page.title)
        }

        const deadLinks: string[] = []
        for (const page of pages) {
            for (const link of page.links) {
                if (!pageTitleSet.has(link)) {
                    deadLinks.push(link)
                }
            }
        }

        const originalFetch = require('node-fetch');
        const fetch = makeFetchCookie(originalFetch, new makeFetchCookie.toughCookie.CookieJar())
        const token = await login(fetch, botUsername, botPassword)
        logger.info("Successfully logged in to wiki");

        for (const page of pages) {
            if (!page.categories.includes("Red") && !page.categories.includes("Green") && !page.categories.includes("Yellow")) {
                const content = page.content + "\n[[Category:Red]]";
                await editPage(fetch, page.title, content, token, logger);
            }
        }
        logger.info("Category assignment completed");

        for (const deadLink of deadLinks) {
            const content = "\n[[Category:Red]]";
            await editPage(fetch, deadLink, content, token, logger);
        }
        logger.info("Created new pages for dead links");

        // create fake pages for all dead links and add to pages array
        for (const deadLink of deadLinks) {
            const fakePage: Page = {
                pageid: 0,
                title: deadLink,
                content: " ",
                links: [],
                categories: ["Red"]
            }
            pages.push(fakePage)
        }

        await createMarkdownFiles(pages)
        logger.info("Created markdown files for all pages");

        const oAuth2Client = new OAuth2Client(clientId, clientSecret);
        oAuth2Client.setCredentials({ refresh_token: refreshToken });
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        const markdownDirectory = './markdown'
        await deleteAllFilesInFolder(drive, folderId);
        logger.info("Deleted all files in the target folder");

        await uploadFilesToFolder(drive, folderId, markdownDirectory);
        logger.info("Uploaded new files to the target folder");

        deleteMarkdownFiles(markdownDirectory)
        logger.info("Deleted local markdown files");
    } catch (error) {
        logger.error(`Error occurred: ${error}`);
        throw error;
    }
}

main()
    .then(() => logger.info("Script completed successfully"))
    .catch(err => logger.error(`Uncaught exception: ${err}`));

