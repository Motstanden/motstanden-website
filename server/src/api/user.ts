import { UserGroup } from "common/enums"
import { NewUser } from "common/interfaces"
import express from "express"
import { Request, Response } from "express"
import { needsGroup } from "../middleware/needsGroup"
import * as userService from "../services/user"

const router = express.Router()

router.get("/member-list", needsGroup(UserGroup.Administrator), (req: Request, res: Response) => {
    const users = userService.getAllUsers()
    res.send(users)
})

router.post("/create-user", needsGroup(UserGroup.SuperAdministrator), (req: Request, res: Response) => {
    const user = req.body as NewUser
    console.log(user)

    // TODO: validate user
    userService.createUser(user)
    
    res.end()
})
export default router