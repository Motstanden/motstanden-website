export async function deleteRequest(url: string, opts?: deleteRequestOpts) {
    
    if (opts?.confirmText && !window.confirm(opts.confirmText)) {
        return undefined
    }

    const response = await fetch(url, { method: "DELETE" })

    if (!response.ok) {
        console.error(response)
        if (opts?.alertOnFailure && !response.ok) {
            const txt = opts.failureText ?? "Noe gikk galt\nSi ifra til webansvarlig"
            window.alert(txt)
        }
    }
}

type deleteRequestOpts = {
    confirmText?: string,
    alertOnFailure?: boolean,
    failureText?: string
}