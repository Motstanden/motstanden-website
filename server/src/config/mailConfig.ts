import nodemailer from "nodemailer"
import key from "../../info-mail-key.json";

export const InfoMail = "info@motstanden.no" 

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: InfoMail,
        serviceClient: key.client_id,
        privateKey: key.private_key,
    },
});