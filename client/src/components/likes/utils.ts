import { CommentEntityType, LikeEntityType } from "common/enums"

function convertToLikeEntity(type: CommentEntityType): LikeEntityType{
    switch(type) {
        case CommentEntityType.Event:
            return LikeEntityType.EventComment
        case CommentEntityType.Poll:
            return LikeEntityType.PollComment
        case CommentEntityType.SongLyric:
            return LikeEntityType.SongLyricComment
        case CommentEntityType.WallPost:
            return LikeEntityType.WallPostComment
    }
}

export const LikeUtils = {
    convertToLikeEntity: convertToLikeEntity,
}