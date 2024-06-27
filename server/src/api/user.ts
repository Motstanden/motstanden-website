import { UserGroup, UserRank, UserStatus } from "common/enums"
import { UpdateUserAsSelfBody, UpdateUserAsSuperAdminBody, UpdateUserMembershipBody, UpdateUserRoleBody } from "common/interfaces"
import express, { Request, Response } from "express"
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

// ---- User schema ----

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
    birthDate: z.string().date(),
    
    // Membership details
    capeName: z.string().trim(),
    rank: z.string().trim().pipe(z.nativeEnum(UserRank)),
    status: z.string().trim().pipe(z.nativeEnum(UserStatus)),
    startDate: z.string().date(),
    endDate: z.string().date().nullable(),
    
    // Website details
    groupName: z.string().pipe(z.nativeEnum(UserGroup)), 
})

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

// ---- PATCH/PUT users ----

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
        const newUserData: UpdateUserAsSelfBody = UpdateCurrentUserSchema.parse(req.body)
        const user = getUser(req)

        // This could have been written as db.users.update(id, newUserData)
        // However, it is safer and more secure to be explicit about what fields are updated.
        db.users.update(user.userId, {
            firstName: newUserData.firstName,
            middleName: newUserData.middleName,
            lastName: newUserData.lastName,
            email: newUserData.email,
            phoneNumber: newUserData.phoneNumber,
            birthDate: newUserData.birthDate,
            startDate: newUserData.startDate,
            endDate: newUserData.endDate,
        })

        updateAccessTokenIfCurrentUser(req, res, user.userId)
        res.end()
    }
)

const UpdateUserSchema = UserSchema.omit({ profilePicture: true })

router.patch("/users/:id", 
    AuthenticateUser(),
    RequiresGroup(UserGroup.SuperAdministrator),
    validateParams(Schemas.params.id),
    validateBody(UpdateUserSchema),
    (req, res) => { 
        const newUserData: UpdateUserAsSuperAdminBody = UpdateUserSchema.parse(req.body)
        const { id } = Schemas.params.id.parse(req.params)
        
        // This could have been written as db.users.update(id, newUserData)
        // However, it is safer and more secure to be explicit about what fields are updated.
        db.users.update(id, {
            firstName: newUserData.firstName,
            middleName: newUserData.middleName,
            lastName: newUserData.lastName,
            email: newUserData.email,
            groupName: newUserData.groupName,
            rank: newUserData.rank,
            capeName: newUserData.capeName,
            status: newUserData.status,
            phoneNumber: newUserData.phoneNumber,
            birthDate: newUserData.birthDate,
            startDate: newUserData.startDate,
            endDate: newUserData.endDate,
        })

        updateAccessTokenIfCurrentUser(req, res, id)
        res.end()
    }
)

const UpdateUserRoleSchema = UserSchema.pick({ groupName: true })

router.put("/users/:id/role", 
    AuthenticateUser(),
    RequiresGroup(UserGroup.Administrator),
    validateParams(Schemas.params.id),
    validateBody(UpdateUserRoleSchema),
    (req, res) => { 
        const { groupName: newRole }: UpdateUserRoleBody = UpdateUserRoleSchema.parse(req.body)
        const { id } = Schemas.params.id.parse(req.params)

        const currentUser = getUser(req)
        const targetUser = db.users.get(id)

        if(targetUser === undefined) { 
            return res.status(410).send("User does not exists")
        }

        const isSuperAdmin = currentUser.groupName === UserGroup.SuperAdministrator
        const isAdmin = currentUser.groupName === UserGroup.Administrator
        const newRoleIsSuperAdmin = newRole === UserGroup.SuperAdministrator
        const targetUserIsSuperAdmin = targetUser.groupName === UserGroup.SuperAdministrator

        if(isSuperAdmin) {
            // Super admins can do whatever they want
            db.users.update(id, { groupName: newRole })

        } else if (isAdmin && !newRoleIsSuperAdmin && !targetUserIsSuperAdmin) { 
            // Admin can change roles as long as:
            //   1. They are not promoting a user to super admin
            //   2. They are not demoting a super admin
            db.users.update(id, { groupName: newRole })
        } else {
            res.status(403).send("Shame on you for trying this! This is logged and reported")   // Lie
        }

        updateAccessTokenIfCurrentUser(req, res, id)
        res.end()
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
        const newUserData: UpdateUserMembershipBody = UpdateUserMembershipSchema.parse(req.body)
        const { id } = Schemas.params.id.parse(req.params)

        // This could have been written as db.users.update(id, newUserData)
        // However, it is safer and more secure to be explicit about what fields are updated.
        db.users.update(id, {
            rank: newUserData.rank,
            capeName: newUserData.capeName,
            status: newUserData.status,
            startDate: newUserData.startDate,
            endDate: newUserData.endDate,
        })

        updateAccessTokenIfCurrentUser(req, res, id)
        res.end()
    }
)

function updateAccessTokenIfCurrentUser(req: Request, res: Response, userId: number) {
    const currentUser = getUser(req)
    if (userId === currentUser.userId) {
        updateAccessToken(req, res, () => { }, {})
    }
}

export default router