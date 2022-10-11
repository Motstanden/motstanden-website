
export function validateEmail(email: string | undefined | null): boolean {
    if (!email)
        return false;

    return emailRegEx.test(email)
}

export function isNtnuMail(email: string) {
    return email.trim().toLowerCase().endsWith("ntnu.no")
}
const emailRegEx = new RegExp(/^[\w-\.æøå]+@([\w-]+\.)+[\w-]{2,4}$/)