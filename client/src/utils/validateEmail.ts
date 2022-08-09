
export function validateEmail(email: string | undefined) : boolean {
    if(!email)
    return false;
    
    return emailRegEx.test(email)
}

const emailRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)