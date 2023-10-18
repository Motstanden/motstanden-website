export function isNtnuMail(email: string) {
    return email.trim().toLowerCase().endsWith("ntnu.no")
}