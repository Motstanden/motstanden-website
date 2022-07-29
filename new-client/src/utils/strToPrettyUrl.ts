export function strToPrettyUrl(str: string): string {
    return str.toLocaleLowerCase()
        .replaceAll(" ","-")
        .replaceAll("æ", "ae")
        .replaceAll("ø", "oe")
        .replaceAll("å", "aa")
}