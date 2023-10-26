export interface NewLike {
    emojiId: number
}

export interface Like extends NewLike {
    id: number,
    userId: number,
}

export interface LikeEmoji {
    id: number,
    name: string,
    text: string,
}