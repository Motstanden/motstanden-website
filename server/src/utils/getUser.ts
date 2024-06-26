import { UserGroup } from "common/enums"
import { Request } from "express"
import { z } from "zod"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"

const AccessTokenDataSchema = z.object({ 
    userId: z.number().int().positive().finite(),
    email: z.string().email(),
    groupId: z.number().int().positive().finite(),
    groupName: z.string().pipe(z.nativeEnum(UserGroup))
})

export function getUser(req: Request): AccessTokenData {
    
    // This will throw an error if the user object is not in the expected format.
    // This is a good thing, because that means the developer is trying to 
    // access the user object before checking if the user is authenticated.
    // This is a dangerous mistake to make, so we want to throw as early as possible.  
    const user = AccessTokenDataSchema.parse(req.user)
    
    return user
}