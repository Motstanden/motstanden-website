import { Locator, Page, expect, test } from "@playwright/test"
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

    let page: Page

    test.beforeAll(async ({browser}, workerInfo) => { 
        page = (await logIn(browser, workerInfo, UserGroup.Contributor)).page
    })

    test.afterAll(async () => { 
        await disposeLogIn(page)
    })

    test(`Like ${testName(entityType)}`, async () => { 
        await page.goto(buildPageUrl(entityType, entityId))
        const comment = page.getByLabel("Kommentar", {exact: true}).nth(0)
        await testLikes(page, comment)
    })
}

async function testLikes(page: Page, container: Locator) {
    await testChangeLike(page, container, likes.none, likes.thumbsUp)
    await testChangeLike(page, container, likes.thumbsUp, likes.heart)
    await testChangeLike(page, container, likes.heart, likes.haha)
    await testChangeLike(page, container, likes.haha, likes.wow)
    await testChangeLike(page, container, likes.wow, likes.sad)
    await testChangeLike(page, container, likes.sad, likes.angry)

    // Clicking the same like button should remove the like
    await testChangeLike(page, container, likes.angry, likes.angry)
}

async function testChangeLike(page: Page, container: Locator, oldLike: LikeType, newLike: LikeType) {
    const oldButton = getLikeButton(container, oldLike)
    await expect(oldButton).toBeVisible()
    await oldButton.click()

    const emojiButton = page.getByRole('tooltip').getByRole('button', { name: newLike.emoji, exact: true })
    await expect(emojiButton).toBeVisible()
    await emojiButton.click()

    const newButton = oldLike === newLike 
        ? getLikeButton(container, likes.none) 
        : getLikeButton(container, newLike)

    await expect(newButton).toBeVisible()
    await expect(oldButton).not.toBeVisible()
}

function getLikeButton(container: Locator, like: LikeType) {
    return container.getByRole('button', { name: like.emoji + like.label, exact: true})
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