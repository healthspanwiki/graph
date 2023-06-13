export default async function editPage(fetch: any, title: string, content: string, token: string) {
    const url = `https://healthspan.wiki/w/api.php`;
    const params = new URLSearchParams();

    params.append("action", "edit");
    params.append("title", title);
    params.append("text", content);
    params.append("token", token);
    params.append("format", "json");

    const response = await fetch(url, { method: "POST", body: params });
    const data = await response.json();

    console.log(data)
    
    if (data && data.edit && data.edit.result === "Success") {
        console.log(`Page ${title} edited successfully.`);
    } else {
        console.log(`Failed to edit page ${title}.`);
    }
}