export function isEnumValue(
    enumType: any,
    value: string,
): boolean {
    return Object.values(enumType).includes(value)
}