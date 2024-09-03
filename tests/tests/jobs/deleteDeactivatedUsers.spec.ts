import { APIRequestContext, expect, test } from "@playwright/test"
import { CommentEntityType, LikeEntityType, ParticipationStatus, UserGroup } from "common/enums"
import { Comment, DeactivatedUser, Like, User, WallPost } from "common/interfaces"
import { randomUUID } from "crypto"
import dayjs from "dayjs"
import sinon from "sinon"
import { job } from "../../../server/src/jobs/deleteDeactivatedUsers.js"
import { api } from "../../utils/api/index.js"
import { apiLogIn, unsafeApiLogIn } from "../../utils/auth.js"
import { loadServerEnv } from "../../utils/loadServerEnv.js"

test("Job deletes all user-identifiable data", async ({ request }, workerInfo) => {

    // Create user and log in as the new user
    const user = await api.users.createRandom(workerInfo)
    await unsafeApiLogIn(request, user.email)
    
    // Like all entities
    const likeEntityId = 1
    await api.likes.create(request, LikeEntityType.EventComment, likeEntityId)
    await api.likes.create(request, LikeEntityType.PollComment, likeEntityId)
    await api.likes.create(request, LikeEntityType.SongLyricComment, likeEntityId)
    await api.likes.create(request, LikeEntityType.WallPost, likeEntityId)
    await api.likes.create(request, LikeEntityType.WallPostComment, likeEntityId)

    // Comment on all entities
    const commentEntityId = 1
    const comment = `${randomUUID()}`
    await api.comments.new(request, CommentEntityType.Event, commentEntityId, comment)
    await api.comments.new(request, CommentEntityType.Poll, commentEntityId, comment)
    await api.comments.new(request, CommentEntityType.SongLyric, commentEntityId, comment)
    await api.comments.new(request, CommentEntityType.WallPost, commentEntityId, comment)

    // Create a wall post
    await api.wallPosts.new(request, { wallUserId: user.id, content: randomUUID() })

    // Participate in an event
    const eventId = 1
    await api.events.participants.upsert(request, eventId, ParticipationStatus.Attending)

    // Vote on a poll
    const pollId = 1
    const pollOptions = await api.polls.options.getAll(request, pollId) 
    const optionId = pollOptions[0].id
    await api.polls.votes.upsert(request, pollId, [optionId])

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

    // Assert all comments are deleted
    expect(await getComment(request, user.id, CommentEntityType.Event, commentEntityId)).toBe(undefined)
    expect(await getComment(request, user.id, CommentEntityType.Poll, commentEntityId)).toBe(undefined)
    expect(await getComment(request, user.id, CommentEntityType.SongLyric, commentEntityId)).toBe(undefined)
    expect(await getComment(request, user.id, CommentEntityType.WallPost, commentEntityId)).toBe(undefined)

    // Assert wall post is deleted
    expect(await getWallPost(request, user.id)).toBe(undefined)

    // Assert event participation is deleted
    expect(await getEventParticipant(request, user.id, eventId)).toBe(undefined)

    // Assert that the poll vote is deleted
    expect(await getPollVote(request, user.id, pollId)).toBe(undefined)
})

async function getUser(request: APIRequestContext, userId: number) : Promise<User | undefined> {
    const users = await api.users.getAll(request)
    return users.find(user => user.id === userId)
}

async function getDeactivatedUser(request: APIRequestContext, userId: number): Promise<DeactivatedUser | undefined> {
    const users = await api.users.getAllDeactivated(request)
    return users.find(user => user.id === userId)
}

async function getLike(request: APIRequestContext, userId: number, entityType: LikeEntityType, entityId: number): Promise<Like | undefined> {
    const allLikes = await api.likes.getAll(request, entityType, entityId)
    return allLikes.find(like => like.userId === userId)
}

async function getComment(request: APIRequestContext, userId: number, entityType: CommentEntityType, entityId: number): Promise<Comment | undefined> {
    const allComments = await api.comments.getAll(request, entityType, entityId)
    return allComments.find(comment => comment.createdBy === userId)
}

async function getWallPost(request: APIRequestContext, userId: number): Promise<WallPost | undefined> { 
    const allPosts = await api.wallPosts.getAll(request)
    return allPosts.find(post => post.wallUserId === userId)
}

async function getEventParticipant(request: APIRequestContext, userId: number, eventId: number) {
    const allParticipants = await api.events.participants.getAll(request, eventId)
    return allParticipants.find(user => user.id === userId)
}

async function getPollVote(request: APIRequestContext, userId: number, pollId: number) {
    const voteData = await api.polls.votes.getAll(request, pollId)
    for (const option of voteData) {
        const vote = option.voters.find(user => user.id === userId)
        if (vote !== undefined) {
            return option
        }
    }
    return undefined
}