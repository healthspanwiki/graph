import { Logger } from 'winston';

/**
 * Edit the page to add 
 * @param fetch fetcher needed for cookie management
 * @param title title of the page to edit
 * @param content content of the page to edit
 * @param token token for editing the page
 * @param logger winston logger instance
 */
export default async function editPage(fetch: any, title: string, content: string, token: string, logger: Logger) {
    const url = `https://healthspan.wiki/w/api.php`;
    const params = new URLSearchParams();

    params.append("action", "edit");
    params.append("title", title);
    params.append("text", content);
    params.append("token", token);
    params.append("format", "json");

    const response = await fetch(url, { method: "POST", body: params });
    const data = await response.json();

    logger.info(JSON.stringify(data));

    if (data && data.edit && data.edit.result === "Success") {
        logger.info(`Page ${title} edited successfully.`);
    } else {
        logger.error(`Failed to edit page ${title}.`);
    }
}