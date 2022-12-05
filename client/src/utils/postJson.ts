function simplePostJson(postUrl: string, jsonValue: object) {
    return fetch(postUrl, {
        method: "POST",
        body: JSON.stringify(jsonValue),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export async function postJson(postUrl: string, jsonValue: object, opts?: postJsonOpts) {

    if (opts?.confirmText && !window.confirm(opts.confirmText)) {
        return undefined
    }

    const response = await simplePostJson(postUrl, jsonValue)

    if (!response.ok) {
        console.error(response)
        if (opts?.alertOnFailure && !response.ok) {
            const txt = opts.failureText ?? "Noe gikk galt\nSi ifra til webansvarlig"
            window.alert(txt)
        }
    }

    return response
}

export type postJsonOpts = {
    confirmText?: string,
    alertOnFailure?: boolean,
    failureText?: string
}