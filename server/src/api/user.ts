import { UserEditMode, UserGroup } from "common/enums"
import { User } from "common/interfaces"
import express, { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { db } from "../db/index.js"
import { AuthenticateUser, logOutAllUnits, updateAccessToken } from "../middleware/jwtAuthenticate.js"
import { RequiresGroup } from "../middleware/requiresGroup.js"
import { validateBody } from "../middleware/zodValidation.js"
import { getUser } from "../utils/getUser.js"

const router = express.Router()

// ---- GET users ----

router.get("/users", 
    AuthenticateUser(),
    (req: Request, res: Response) => {
        const users = db.users.getAll()
        res.json(users)
})

router.get("/users/identifiers",
    AuthenticateUser(),
    (req: Request, res: Response) => {
        const users = db.users.getAllAsIdentifiers()
        res.json(users)
})
    
router.get("/users/me",
    AuthenticateUser(),
    (req, res) => {
        const user = getUser(req)
        const userData = db.users.get(user.userId)
        if(userData !== undefined) {
            res.json(userData)
        } else {
            // This should never happen.
            // If the user is authenticated, the user should be in the database.
            console.error(`User authenticated but not found in database.\nUser: ${user}\nLogging user out of all units.`)
            logOutAllUnits(req, res)
            res.status(410).send("User authenticated but not found in database")        
        }
    }
)


// ---- Update users ----

router.post("/super-admin/update-user", AuthenticateUser(), RequiresGroup(UserGroup.SuperAdministrator), handleUserUpdate(UserEditMode.SuperAdmin))

router.post("/admin/update-user", AuthenticateUser(), RequiresGroup(UserGroup.Administrator), handleUserUpdate(UserEditMode.Admin))

router.post("/self-and-admin/update-user", AuthenticateUser(), RequiresGroup(UserGroup.Administrator), RequireSelf(), handleUserUpdate(UserEditMode.SelfAndAdmin))

router.post("/self/update-user", AuthenticateUser(), RequireSelf(), handleUserUpdate(UserEditMode.Self))

function handleUserUpdate(updateMode: UserEditMode) {
    return (req: Request, res: Response, next: NextFunction) => {

        const payload = req.body as User
        if (!payload) {
            res.status(400).send("Bad data")
        }

        let changeSuccess = false
        try {
            db.users.update(payload, updateMode)
            changeSuccess = true
        } catch (err) {
            console.log(err)
            res.status(400).send("Failed to update user")
        }

        if (changeSuccess) {
            const currentUser = getUser(req)
            if (payload.id === currentUser.userId) {
                updateAccessToken(req, res, () => { }, {})
            }
        }

        res.end()
    }
}

function RequireSelf() {
    return (req: Request, res: Response, next: NextFunction) => { 
        const user = getUser(req)
        const newUser = req.body as User | undefined
        if (newUser?.id && newUser.id === user.userId) {
            next()
        }
        else {
            res.status(401).send("Unauthorized").end()
        }
    }
}

// ---- POST users ----

const NewUserSchema = z.object({ 
    firstName: z.string().trim().min(1, "First name cannot be empty"),
    middleName: z.string().trim(),
    lastName: z.string().trim().min(1, "Last name cannot be empty"),
    email: z.string()
        .trim()
        .toLowerCase()
        .email()
        .refine(value => !value.endsWith("ntnu.no"), "Email cannot be an NTNU email"),
    profilePicture: z.string()
        .trim()
        .pipe(z.union([
            z.literal("files/private/profilbilder/boy.png"),
            z.literal("files/private/profilbilder/girl.png")
        ])),
})


router.post("/users", 
    RequiresGroup(UserGroup.SuperAdministrator),
    validateBody(NewUserSchema), 
    (req: Request, res: Response) => {
    const user = NewUserSchema.parse(req.body)
    const userId = db.users.insert(user)
    res.json({userId: userId})
})

export default router