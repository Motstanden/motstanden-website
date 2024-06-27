import { UserEditMode, UserGroup, UserRank, UserStatus } from "common/enums"
import { User, UserUpdateAsSelf, UserUpdateAsSuperAdmin, UserUpdateMembership, UserUpdateRole } from "common/interfaces"
import express, { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { db } from "../db/index.js"
import { AuthenticateUser, logOutAllUnits, updateAccessToken } from "../middleware/jwtAuthenticate.js"
import { RequiresGroup } from "../middleware/requiresGroup.js"
import { validateBody, validateParams } from "../middleware/zodValidation.js"
import { getUser } from "../utils/getUser.js"
import { Schemas } from "../utils/zodSchema.js"

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

const UserSchema = z.object({ 
    // Personal details
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
        
    phoneNumber: z.number()
        .int()
        .positive()
        .finite()
        .min(10000000, "Phone number must be 8 digits")
        .max(99999999, "Phone number must be 8 digits")
        .nullable(),
    birthDate: Schemas.z.dateTime(),
    
    // Membership details
    capeName: z.string().trim(),
    rank: z.string().trim().pipe(z.nativeEnum(UserRank)),
    status: z.string().trim().pipe(z.nativeEnum(UserStatus)),
    startDate: Schemas.z.dateTime(),
    endDate: Schemas.z.dateTime().nullable(),
    
    // Website details
    groupName: z.string().pipe(z.nativeEnum(UserGroup)), 

})

router.get("/users/:id",
    AuthenticateUser(),
    validateParams(Schemas.params.id),
    (req, res) => {
        const { id } = Schemas.params.id.parse(req.params)
        const user = db.users.get(id)
        if(user !== undefined) {
            res.json(user)
        } else {
            res.status(404).send("User not found")
        }
    }
)

// ---- Update users ----
const UpdateUserSchema = UserSchema.omit({ profilePicture: true })

router.patch("/users/:id", 
    AuthenticateUser(),
    RequiresGroup(UserGroup.SuperAdministrator),
    validateParams(Schemas.params.id),
    validateBody(UpdateUserSchema),
    (req, res) => { 
        const newUserData: UserUpdateAsSuperAdmin = UpdateUserSchema.parse(req.body)
        const { id } = Schemas.params.id.parse(req.params)
        
        // TODO: Update all user fields
    }
)

const UpdateCurrentUserSchema = UserSchema.pick({
    firstName: true,
    middleName: true,
    lastName: true,
    email: true,
    phoneNumber: true,
    birthDate: true,
    startDate: true,
    endDate: true
})

router.patch("/users/me", 
    AuthenticateUser(), 
    validateBody(UpdateCurrentUserSchema),
    (req, res) => { 
        const newUserData: UserUpdateAsSelf = UpdateCurrentUserSchema.parse(req.body)
        const user = getUser(req)
        // TODO: Update current user with new data
    }
)

const UpdateUserRoleSchema = UserSchema.pick({ groupName: true })

router.put("/users/:id/role", 
    AuthenticateUser(),
    RequiresGroup(UserGroup.Administrator),
    validateParams(Schemas.params.id),
    validateBody(UpdateUserRoleSchema),
    (req, res) => { 
        const newRole: UserUpdateRole = UpdateUserRoleSchema.parse(req.body)
        const { id } = Schemas.params.id.parse(req.params)
        // TODO: Update user role.
        //  1. Super admin can do whatever they want
        //  2. Prevent admin from demoting super admins
        //  3. Prevent admin from promoting users to super admins 
    }
)

const UpdateUserMembershipSchema = UserSchema.pick({ 
    rank: true, 
    capeName: true, 
    status: true, 
    startDate: true, 
    endDate: true
})

router.put("/users/:id/membership",
    AuthenticateUser(),
    RequiresGroup(UserGroup.Administrator),
    validateParams(Schemas.params.id),
    validateBody(UpdateUserMembershipSchema),
    (req, res) => { 
        const newUserData: UserUpdateMembership = UpdateUserMembershipSchema.parse(req.body)
        const { id } = Schemas.params.id.parse(req.params)

        // TODO: Update user membership
    }
)

// --- DEPRECATED: Remove soon ----

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
            // db.users.update(payload, updateMode)
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

const NewUserSchema = UserSchema.pick({
    firstName: true, 
    lastName: true, 
    middleName: true, 
    email: true,
    profilePicture: true 
})

router.post("/users", 
    AuthenticateUser(),
    RequiresGroup(UserGroup.SuperAdministrator),
    validateBody(NewUserSchema), 
    (req: Request, res: Response) => {
        const user = NewUserSchema.parse(req.body)
        const userId = db.users.insert(user)
        res.json({userId: userId})
})

export default router