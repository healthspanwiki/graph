import { PageTitle } from "../types/PageTitle";

interface Respect {
    apcontinue: string
}

export default async function getPageTitles(continueObj?: Respect) {
    let url = 'https://healthspan.wiki/w/api.php?action=query&format=json&list=allpages&aplimit=500&maxage=0&smaxage=0';
    if (continueObj && continueObj.apcontinue) {
        url += '&apcontinue=' + encodeURIComponent(continueObj.apcontinue);
    }

    const titles: PageTitle[] = []

    await fetch(url)
        .then(response => response.json())
        .then(data => {
            titles.concat(data.query.allpages)
            console.log(data.query.allpages);  // Process the pages
            if (data.continue) {
                // If there's more data, fetch it
                getPageTitles(data.continue);
            }
        })
        .catch(error => console.error(error));

    return titles
}
