export function strToNumber(str: string | undefined): number | undefined {
    if (!str)
        return undefined

    if (!isOnlyNumbers(str))
        return undefined

    return parseInt(str)
}

export function isOnlyNumbers(str: string): boolean {
    return /^[0-9]+$/.test(str);
}

export function isNullOrWhitespace(str: string | undefined | null): boolean {
    if (!str) {
        return true
    }

    return /^\s*$/.test(str);
}