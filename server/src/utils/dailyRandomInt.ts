export default function dailyRandomInt(max: number){
    const currentDate = getCurrentDate();
    const salt = "åæøloxz),m_.!#?¤bxvuesaJM"
    const salt2 = "Ωvs&<>/*-TC^'$€%I`~"
    const hashedDate = hashCode(salt2 + currentDate + salt)
    return Math.abs(hashedDate) % max
}

function getCurrentDate(): string {
    return new Date()
        .toLocaleString("no-no", { timeZone: "cet"})
        .split(",")[0]
}

// Generates a fast non-secure simple hash
// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}