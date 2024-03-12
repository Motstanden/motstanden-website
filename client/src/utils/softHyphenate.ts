/**
 * Inserts a soft hyphen between every non-space character in a string.
 * This will allow the string to be broken at any character, and the hyphen will only be visible if the string is broken at that point.
 */
export function softHypenate(text: string): string {
    return text.replace(/(\S)/g, '$1\u00AD');
}