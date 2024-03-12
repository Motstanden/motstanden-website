export async function fetchAsync<Type>(url: string): Promise<Type> {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
    }
    else {
        return await res.json() as Type;
    }
}

export function fetchFn<Type>(url: string) {
    return () => fetchAsync<Type>(url);
}