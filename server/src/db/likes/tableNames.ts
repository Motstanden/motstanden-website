// ****************************************************************************
//              **** Names for sql query building ****
//
// NB:
//  The functions in this file exposes the database for sql injection attack.
//  This is dangerous, so don't touch it unless you know what you are doing
//
// ****************************************************************************

import { LikeEntityType } from "common/enums"

export const likesTable = {
    name: (entityType: LikeEntityType): string => { 
        switch (entityType) {
            case LikeEntityType.EventComment:
                return "event_comment_like"
            case LikeEntityType.PollComment:
                return "poll_comment_like"
            case LikeEntityType.SongLyricComment:
                return "song_lyric_comment_like"
            case LikeEntityType.WallPost:
                return "wall_post_like"
            case LikeEntityType.WallPostComment:
                return "wall_post_comment_like"
        }
    },

    id: (entityType: LikeEntityType): string => {
        switch (entityType) {
            case LikeEntityType.EventComment:
                return "event_comment_like_id"
            case LikeEntityType.PollComment:
                return "poll_comment_like_id"
            case LikeEntityType.SongLyricComment:
                return "song_lyric_comment_like_id"
            case LikeEntityType.WallPost:
                return "wall_post_like_id"
            case LikeEntityType.WallPostComment:
                return "wall_post_comment_like_id"
        }
    },

    entityId: (entityType: LikeEntityType): string => { 
        switch (entityType) {
            case LikeEntityType.EventComment:
                return "event_comment_id"
            case LikeEntityType.PollComment:
                return "poll_comment_id"
            case LikeEntityType.SongLyricComment:
                return "song_lyric_comment_id"
            case LikeEntityType.WallPost:
                return "wall_post_id"
            case LikeEntityType.WallPostComment:
                return "wall_post_comment_id"
        }
    }
}