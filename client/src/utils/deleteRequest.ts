export async function deleteRequest(url: string) { 
    const res = await fetch(url, { method: "DELETE" })
    if(!res.ok) {
        throw new Error(`HTTP error ${res.status} ${res.statusText}`)
    }
    return res
}