


async function getLoginToken(fetch: any): Promise<string> {
    const loginTokenResponse = await fetch('https://healthspan.wiki/w/api.php', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
        action: 'query',
        meta: 'tokens',
        type: 'login',
        format: 'json'
        })
    });

    const loginTokenData = await loginTokenResponse.json();
    // @ts-ignore
    const loginToken = loginTokenData.query.tokens.logintoken;

    return loginToken
}
  
export default async function login(fetch: any, username: string, password: string) {
    const loginToken = (await getLoginToken(fetch))

    console.log(loginToken)

    console.log(username, password)

    const loginResponse = await fetch('https://healthspan.wiki/w/api.php', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'login',
            lgname: username,
            lgpassword: password,
            lgtoken: loginToken,
            format: 'json'
        })
    });

    const loginData = await loginResponse.json();
    console.log(loginData)
    // @ts-ignore
    if (loginData.login.result === "Success") {
        return await getCsrfToken(fetch);
    }
    else {
        throw new Error("Login failed");
    }
}

async function getCsrfToken(fetch: any) {
    const csrfTokenResponse = await fetch('https://healthspan.wiki/w/api.php', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
        action: 'query',
        meta: 'tokens',
        format: 'json'
        })
    });

    const csrfTokenData = await csrfTokenResponse.json();
    console.log(csrfTokenData)
    // @ts-ignore
    const csrfToken = csrfTokenData.query.tokens.csrftoken;

    return csrfToken;
}  