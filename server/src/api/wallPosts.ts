import { strToNumber } from "common/utils";
import express from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { wallPostService } from "../services/wallPosts.js";

const router = express.Router()

router.get("/wall-posts/all?:userId",
    AuthenticateUser(),
    (req, res) => {
        const userId = strToNumber(req.query.userId?.toString() ?? "")
        const posts = wallPostService.getAll(userId)
        res.send(posts)
    }
)

export default router