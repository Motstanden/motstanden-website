export function isNullOrWhitespace(str: string | undefined): boolean {
    if(!str){
        return true
    }
    return /^\s*$/.test(str);
}