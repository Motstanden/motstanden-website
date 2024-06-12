export async function patchRequest(url: string, data: object): Promise<Response> {
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if(!res.ok) {
        throw new Error(`HTTP error ${res.status} ${res.statusText}`);
    } 
    return res
}