// Note: 
// The code in this file is poorly designed and is due for a full rewrite.
// This code is the result of a quick and dirty implementation to get the project up and running in the early stages.

function simpleHttpSendJson(method: "POST" | "PUT" | "PATCH", postUrl: string, jsonValue: object) {
    return fetch(postUrl, {
        method: method,
        body: JSON.stringify(jsonValue),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

async function httpSendJson(method: "POST" | "PUT" | "PATCH", url: string, value: object, opts?: postJsonOpts) {

    if (opts?.confirmText && !window.confirm(opts.confirmText)) {
        return undefined
    }

    const response = await simpleHttpSendJson(method, url, value)

    if (!response.ok) {
        console.error(response)
        if (opts?.alertOnFailure && !response.ok) {
            const txt = opts.failureText ?? "Noe gikk galt\nSi ifra til webansvarlig"
            window.alert(txt)
        }
    }

    return response
}

export async function postJson(url: string, jsonValue: object, opts?: postJsonOpts) {
    return await httpSendJson("POST", url, jsonValue, opts)
}

export async function putJson(url: string, jsonValue: object, opts?: postJsonOpts) {
    return await httpSendJson("PUT", url, jsonValue, opts)
}

export async function patchJson(url: string, jsonValue: object, opts?: postJsonOpts) {
    return await httpSendJson("PATCH", url, jsonValue, opts)
}


export type postJsonOpts = {
    confirmText?: string,
    alertOnFailure?: boolean,
    failureText?: string
}