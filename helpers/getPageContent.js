export default function getPageContent(title){
    fetch('https://healthspan.wiki/w/api.php?action=parse&format=json&page=' + title)
        .then(response => response.json())
        .then(data => {
            // The page content is in data.parse.text['*']
            console.log(data.parse.text['*']);
        })
        .catch(error => console.error(error));

}