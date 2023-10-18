import { UserEditMode, UserGroup } from "common/enums"
import { NewUser, User } from "common/interfaces"
import express, { NextFunction, Request, Response } from "express"
import { AuthenticateUser, updateAccessToken } from "../middleware/jwtAuthenticate.js"
import { requiresGroup } from "../middleware/requiresGroup.js"
import * as userService from "../services/user.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"

const router = express.Router()

router.get("/member-list", (req: Request, res: Response) => {
    const users = userService.getAllUsers()
    res.send(users)
})

router.post("/super-admin/update-user", requiresGroup(UserGroup.SuperAdministrator), handleUserUpdate(UserEditMode.SuperAdmin))

router.post("/admin/update-user", requiresGroup(UserGroup.Administrator), handleUserUpdate(UserEditMode.Admin))

router.post("/self-and-admin/update-user", requiresGroup(UserGroup.Administrator), RequireSelf, handleUserUpdate(UserEditMode.SelfAndAdmin))

router.post("/self/update-user", AuthenticateUser(), RequireSelf, handleUserUpdate(UserEditMode.Self))

function handleUserUpdate(updateMode: UserEditMode) {
    return (req: Request, res: Response, next: NextFunction) => {

        const payload = req.body as User
        if (!payload) {
            res.status(400).send("Bad data")
        }

        let changeSuccess = false
        try {
            userService.updateUser(payload, updateMode)
            changeSuccess = true
        } catch (err) {
            console.log(err)
            res.status(400).send("Failed to update user")
        }

        if (changeSuccess) {
            const currentUser = req.user as AccessTokenData
            if (payload.id === currentUser.userId) {
                updateAccessToken(req, res, () => { }, {})
            }
        }

        res.end()
    }
}

function RequireSelf(req: Request, res: Response, next: NextFunction) {
    const user = req.user as AccessTokenData
    const newUser = req.body as User | undefined
    if (newUser?.id && newUser.id === user.userId) {
        next()
    }
    else {
        res.status(401).send("Unauthorized").end()
    }
}

router.post("/create-user", requiresGroup(UserGroup.SuperAdministrator), (req: Request, res: Response) => {
    const user = req.body as NewUser

    // TODO: validate user

    try {
        const userId = userService.createUser(user)
        res.json({userId: userId})
    } catch (err) {
        console.log(err)
        res.status(400).send("Bad data")
    }

    res.end()
})
export default router