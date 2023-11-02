export interface NewLike {
    emojiId: number
}

export interface Like extends NewLike {
    id: number,
    userId: number,
}

type EmojiDescription = "liker" | "elsker" | "haha" | "wow" | "sint" | "trist"

export interface LikeEmoji {
    id: number,
    description: EmojiDescription,
    text: string,
}