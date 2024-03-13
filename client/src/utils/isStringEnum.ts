export function isEnumValue(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enumType: any,
    value: string,
): boolean {
    return Object.values(enumType).includes(value)
}