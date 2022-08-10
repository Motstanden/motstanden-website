import { UserGroup } from "common/enums"
import { NewUser } from "common/interfaces"
import express from "express"
import { Request, Response } from "express"
import { requiresGroup } from "../middleware/requiresGroup"
import * as userService from "../services/user"

const router = express.Router()

router.get("/member-list", (req: Request, res: Response) => {
    const users = userService.getAllUsers()
    res.send(users)
})

router.post("/create-user", requiresGroup(UserGroup.SuperAdministrator), (req: Request, res: Response) => {
    const user = req.body as NewUser
    console.log(user)

    // TODO: validate user
    userService.createUser(user)
    
    res.end()
})
export default router