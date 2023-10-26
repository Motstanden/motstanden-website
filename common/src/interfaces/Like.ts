export interface NewLike {
    emojiId: number
}

export interface Like extends NewLike {
    id: number,
    userId: number,
}