import { Dayjs } from "dayjs"

function compareByNumber(a: number, b: number, sortDirection: "asc" | "desc"): number {
    return sortDirection === "asc" ? a - b : b - a;
}

function compareByBoolean(a: boolean, b: boolean, sortDirection: "asc" | "desc"): number {
    return sortDirection === "asc" ? (a ? -1 : 1) : (a ? 1 : -1);
}

function compareByTimestamp(a: Dayjs | undefined, b: Dayjs | undefined, sortDirection: "asc" | "desc"): number {
    const aValue = a?.unix() ?? 0;
    const bValue = b?.unix() ?? 0;
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
}

function compareByAlphanum(a: string, b: string, sortDirection: "asc" | "desc"): number {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    return sortDirection === "asc" ? collator.compare(a, b) : collator.compare(b, a);
}

export const Compare = {
    number: compareByNumber,
    alphanum: compareByAlphanum,
    boolean: compareByBoolean,
    timestamp: compareByTimestamp,
}