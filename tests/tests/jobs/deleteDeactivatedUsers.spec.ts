import { APIRequestContext, expect, test } from "@playwright/test"
import { LikeEntityType, UserGroup } from "common/enums"
import { DeactivatedUser, Like, User } from "common/interfaces"
import dayjs from "dayjs"
import sinon from "sinon"
import { job } from "../../../server/src/jobs/deleteDeactivatedUsers.js"
import { api } from "../../utils/api/index.js"
import { apiLogIn, unsafeApiLogIn } from "../../utils/auth.js"
import { loadServerEnv } from "../../utils/loadServerEnv.js"

test("Job deletes all identifiable user data", async ({ request }, workerInfo) => {

    // Create user and log in as user
    const user = await api.users.createRandom(workerInfo)
    await unsafeApiLogIn(request, user.email)
    
    // Like all entities
    const likeEntityId = 1
    await api.likes.create(request, LikeEntityType.EventComment, likeEntityId)
    await api.likes.create(request, LikeEntityType.PollComment, likeEntityId)
    await api.likes.create(request, LikeEntityType.SongLyricComment, likeEntityId)
    await api.likes.create(request, LikeEntityType.WallPost, likeEntityId)
    await api.likes.create(request, LikeEntityType.WallPostComment, likeEntityId)


    // Deactivate user
    await api.users.delete(workerInfo, user.id)

    // Fast forward the clock 90 days
    const clock = sinon.useFakeTimers({
        now: dayjs().add(90, "days").toDate(),
        toFake: ["Date"]
    })    

    loadServerEnv()
    await job()

    // Restore the clock
    clock.restore()

    // Log in as super admin
    await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)

    // Assert user is deleted
    expect(await getUser(request, user.id)).toBe(undefined)
    expect(await getDeactivatedUser(request, user.id)).toBe(undefined)

    // Assert all likes are deleted
    expect(await getLike(request, user.id, LikeEntityType.EventComment, likeEntityId)).toBe(undefined)
    expect(await getLike(request, user.id, LikeEntityType.PollComment, likeEntityId)).toBe(undefined)
    expect(await getLike(request, user.id, LikeEntityType.SongLyricComment, likeEntityId)).toBe(undefined)
    expect(await getLike(request, user.id, LikeEntityType.WallPost, likeEntityId)).toBe(undefined)
    expect(await getLike(request, user.id, LikeEntityType.WallPostComment, likeEntityId)).toBe(undefined)
})

async function getUser(request: APIRequestContext, userId: number) : Promise<User | undefined> {
    const users = await api.users.getAll(request)
    return users.find(u => u.id === userId)
}

async function getDeactivatedUser(request: APIRequestContext, userId: number): Promise<DeactivatedUser | undefined> {
    const users = await api.users.getAllDeactivated(request)
    return users.find(u => u.id === userId)
}

async function getLike(request: APIRequestContext, userId: number, entityType: LikeEntityType, entityId: number): Promise<Like | undefined> {
    const allLikes = await api.likes.getAll(request, entityType, entityId)
    return allLikes.find(l => l.userId === userId)
}