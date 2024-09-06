import { Dayjs } from "dayjs"

function compareByNumber(a: number, b: number, sortDirection: "asc" | "desc"): number {
    return sortDirection === "asc" ? a - b : b - a;
}

function compareByBoolean(a: boolean, b: boolean, sortDirection: "asc" | "desc"): number {
    return sortDirection === "asc" ? (a ? -1 : 1) : (a ? 1 : -1);
}

function compareByTimestamp(a: Dayjs | undefined, b: Dayjs | undefined, sortDirection: "asc" | "desc"): number {
    const aValue = a?.unix() ?? Number.MAX_SAFE_INTEGER;
    const bValue = b?.unix() ?? Number.MAX_SAFE_INTEGER;
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
}

function compareByAlphanumerical(a: string, b: string, sortDirection: "asc" | "desc"): number {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

    // Put empty strings last when sorting in ascending order
    if (a === "" && b === "") return 0;
    if (a === "") return sortDirection === "asc" ? 1 : -1;
    if (b === "") return sortDirection === "asc" ? -1 : 1;

    return sortDirection === "asc" ? collator.compare(a, b) : collator.compare(b, a);
}

export const Compare = {
    number: compareByNumber,
    alphanumerical: compareByAlphanumerical,
    boolean: compareByBoolean,
    timestamp: compareByTimestamp,
}