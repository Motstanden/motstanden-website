import nodemailer, { SendMailOptions } from "nodemailer"

// How json should be imported:
// import key from "../../info-mail-key.json" with { type: "json" };     // Experimental in node 20 :-(  Hopefully this feature is stable in node 22...

// Workaround for importing json: 
import { createRequire } from "module"
import { retry } from "../utils/retry.js"
const require = createRequire(import.meta.url);
const key = require("../../info-mail-key.json")


function createTransporter() {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: "info@motstanden.no",
            serviceClient: key.client_id,
            privateKey: key.private_key,
        },
    }, { 
        from: {
            name: "Motstanden",
            address: "info@motstanden.no",
        }
    })
}

const transporter = createTransporter()

/**
 * Sends an email. 
 * If an email fails, it will retry 5 times with an exponential backoff.
 * The function may take multiple minutes to complete, and should therefore generally not be awaited.
 * If all retries fail, the error will be logged to the console.
 * @param options 
 * @returns 
 */
async function send(options: SendMailOptions) {
    
    if(process.env.ENABLE_EMAIL_SERVICE !== "true") {
        console.warn("Email service is disabled. Email not sent.")
        return
    } 

    // This function can take multiple minutes to complete if the email service is down.
    const {result, error} = await retry({
        fn: async () => await transporter.sendMail(options),
        errorMessage: `Failed to send email to ${options.to} with subject: ${options.subject}`,
        maxRetries: 5,
    })

    if(error) {
        // This code might be executed multiple minutes after the function was initially called.
        // Throwing an error here would not be useful, as developers should never be awaiting for this time consuming function.
        // Let's log the error instead.
        console.error(error.message)
    }
}

export const Mail = {
    send,
    transporter: transporter,
}