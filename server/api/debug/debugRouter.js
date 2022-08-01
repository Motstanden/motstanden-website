import express from "express";
import ping from "./ping.js";
import privateUrl from "./privateUrl.js";

let router = express.Router()

router.use(ping)
router.use(privateUrl)

export default router