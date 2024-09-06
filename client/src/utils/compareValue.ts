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

export const Compare = {
    number: compareByNumber,
    boolean: compareByBoolean,
    timestamp: compareByTimestamp,
}