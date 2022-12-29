import nodemailer from "nodemailer";

// How json should be imported:
// import key from "../info-mail-key.json" assert { type: "json" };     // Experimental in node 18 :-(  Hopefully this feature is stable in node 20...

// Workaround for importing json: 
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const key = require("../../info-mail-key.json")

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