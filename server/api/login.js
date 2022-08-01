import express from "express";
import passport from "passport";

import nodemailer from "nodemailer"
import key from "../info-mail-key.json" assert {type: "json" };
const EmailAddress = "info@motstanden.no" 

const ACCESSTOKEN = "AccessToken"

let router = express.Router()

router.post("/login", 
    passport.authenticate("local", {session: false}),
    (req, res) => {
        res.cookie(ACCESSTOKEN, 
            req.user.accessToken, { 
                httpOnly: true, 
                secure: true, 
                sameSite: true, 
                maxAge: 1000 * 60 * 60 * 24 * 14 // 14 days 
        })
        res.json({
            message: "Du er logget inn som " + req.user.username
        })
})

router.post("/logout", (req, res) => {
    res.clearCookie(ACCESSTOKEN)
    res.end()
})

router.get("/userMetaData",
    passport.authenticate("jwt", { session: false, failWithError: true }),
    (req, res) => res.send(req.user),                                               // Login success callback
    (err, req, res, next) => res.status(204).send("Brukeren er ikke logget inn.")   // Login failure callback
)

router.post("/auth/magic_login", 
    async (req, res)=> {
    await sendMagicLink(req.body.destination)
    res.send({code: 1234})
})

async function sendMagicLink(email) {
    console.log(`Starting to send mail to: ${email}`)
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: EmailAddress,
            serviceClient: key.client_id,
            privateKey: key.private_key,
        },
    });
    try {
        console.log("Verifying...")
        await transporter.verify();
        console.log("sending")
        await transporter.sendMail({
            from: EmailAddress,
            to: email,
            subject: "Hello there",
            text: "Did you ever hear the Tragedy of Darth Plagueis the Wise?"
        })
        console.log("sent")
    } catch (err){
        console.log("Error: ", err)
    }
}

export default router