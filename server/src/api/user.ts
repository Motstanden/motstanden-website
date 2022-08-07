import { UserGroup } from "common/enums"
import express from "express"
import { Request, Response } from "express"
import { needsGroup } from "../middleware/needsGroup"
import { getAllUsers } from "../services/user"

const router = express.Router()

router.get("/member-list", needsGroup(UserGroup.Administrator), (req: Request, res: Response) => {
    const users = getAllUsers()
    res.send(users)
})

export default router