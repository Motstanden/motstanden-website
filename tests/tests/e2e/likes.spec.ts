import { expect, test } from "@playwright/test"
import { LikeEntityType, UserGroup } from "common/enums"
import { disposeLogIn, logIn } from "../../utils/auth.js"

runTestSuite({ 
    entityType: LikeEntityType.EventComment, 
    entityId: 1
})
runTestSuite({ 
    entityType: LikeEntityType.PollComment,  
    entityId: 1
})
runTestSuite({ 
    entityType: LikeEntityType.SongLyricComment,  
    entityId: 1
})
runTestSuite({ 
    entityType: LikeEntityType.WallPost,  
    entityId: 1
})
runTestSuite({ 
    entityType: LikeEntityType.WallPostComment,  
    entityId: 1
})

interface TestOptions {
    entityType: LikeEntityType,
    entityId: number
}

function runTestSuite({entityType, entityId}: TestOptions) {

    test(`Like ${testName(entityType)}`, async ({browser}, workerInfo) => { 
        
        const { page } = await logIn(browser, workerInfo, UserGroup.Contributor)
        await page.goto(buildPageUrl(entityType, entityId))

        const comment = page.getByLabel("Kommentar", {exact: true}).nth(0)

        const getLikeButton = (like: LikeType) => {
            return comment.getByRole('button', { name: like.emoji + like.label })
        }

        const testChangeLike = async (oldLike: LikeType, newLike: LikeType) => { 
            const oldButton = getLikeButton(oldLike)
            await expect(oldButton).toBeVisible()

            await oldButton.click()
            const emojiButton = page.getByRole('tooltip').getByRole('button', { name: newLike.emoji, exact: true })
            await emojiButton.click()

            const newButton = oldLike === newLike 
                ? getLikeButton(likes.none) 
                : getLikeButton(newLike)

            await expect(newButton).toBeVisible()
        }

        await testChangeLike(likes.none, likes.thumbsUp)
        await testChangeLike(likes.thumbsUp, likes.heart)
        await testChangeLike(likes.heart, likes.haha)
        await testChangeLike(likes.haha, likes.wow)
        await testChangeLike(likes.wow, likes.sad)
        await testChangeLike(likes.sad, likes.angry)

        // Clicking the same like button should remove the like
        await testChangeLike(likes.angry, likes.angry)

        await disposeLogIn(page)
    })
}

const likes = {
    none: {
        emoji: "",
        label: "lik"
    },
    thumbsUp: {
        emoji: "👍",
        label: "liker"
    },
    heart: {
        emoji: "💚",
        label: "hjerte"
    },
    haha: {
        emoji: "😆",
        label: "haha"
    },
    wow: {
        emoji: "😮",
        label: "wow"
    },
    sad: {
        emoji: "😢",
        label: "trist"
    },
    angry: {
        emoji: "😠",
        label: "sint"
    }
} as const

type LikeType = 
    typeof likes.none | 
    typeof likes.thumbsUp | 
    typeof likes.heart | 
    typeof likes.haha | 
    typeof likes.wow | 
    typeof likes.sad | 
    typeof likes.angry


function buildPageUrl(entityType: LikeEntityType, entityId: number): string {
    switch(entityType) { 
        case LikeEntityType.EventComment:
            return `/arrangement/${entityId}`
        case LikeEntityType.PollComment:
            return `/avstemninger/${entityId}`
        case LikeEntityType.SongLyricComment:
            return `/studenttraller/${entityId}`
        case LikeEntityType.WallPost:
            return `/vegg/${entityId}`
        case LikeEntityType.WallPostComment: 
            return `/vegg/${entityId}`
        default:
            throw "Not implemented"
    }
}

function testName(entityType: LikeEntityType) {
    return entityType.replace("-", " ").replace("/", " ")
}