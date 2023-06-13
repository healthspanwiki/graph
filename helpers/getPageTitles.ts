
interface Respect {
    apcontinue: string
}

export default async function getPageTitles(continueObj?: Respect) {
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
                getPageTitles(data.continue);
            }
        })
        .catch(error => console.error(error));

    return titles
}
