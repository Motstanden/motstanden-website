// ****************************************************************************
//              **** Names for sql query building ****
//
// NB:
//  The functions in this file exposes the database for sql injection attack.
//  This is dangerous, so don't touch it unless you know what you are doing
//
// ****************************************************************************

import { CommentEntityType } from "common/enums"


// Comments table names
export const commentsTable = {
    name: (entityType: CommentEntityType): string => {
        switch (entityType) {
            case CommentEntityType.Event:
                return "event_comment"
            case CommentEntityType.Poll:
                return "poll_comment"
            case CommentEntityType.SongLyric:
                return "song_lyric_comment"
            case CommentEntityType.WallPost:
                return "wall_post_comment"
            default:
                throw `Unknown entity type: ${entityType}`
        }
    },

    id: (entityType: CommentEntityType): string => {
        switch (entityType) {
            case CommentEntityType.Event:
                return "event_comment_id"
            case CommentEntityType.Poll:
                return "poll_comment_id"
            case CommentEntityType.SongLyric:
                return "song_lyric_comment_id"
            case CommentEntityType.WallPost:
                return "wall_post_comment_id"
            default:
                throw `Unknown entity type: ${entityType}`
        }
    },

    entityId: (entityType: CommentEntityType): string => {
        switch (entityType) {
            case CommentEntityType.Event:
                return "event_id"
            case CommentEntityType.Poll:
                return "poll_id"
            case CommentEntityType.SongLyric:
                return "song_lyric_id"
            case CommentEntityType.WallPost:
                return "wall_post_id"
            default:
                throw `Unknown entity type: ${entityType}`
        }
    }
}

// Unread comments table names
export const unreadCommentsTable = {
    name: (entityType: CommentEntityType): string => {
        switch (entityType) {
            case CommentEntityType.Event:
                return "unread_event_comment"
            case CommentEntityType.Poll:
                return "unread_poll_comment"
            case CommentEntityType.SongLyric:
                return "unread_song_lyric_comment"
            case CommentEntityType.WallPost:
                return "unread_wall_post_comment"
            default:
                throw `Unknown entity type: ${entityType}`
        }
    },

    id: (entityType: CommentEntityType): string => {
        switch (entityType) {
            case CommentEntityType.Event:
                return "unread_event_comment_id"
            case CommentEntityType.Poll:
                return "unread_poll_comment_id"
            case CommentEntityType.SongLyric:
                return "unread_song_lyric_comment_id"
            case CommentEntityType.WallPost:
                return "unread_wall_post_comment_id"
            default:
                throw `Unknown entity type: ${entityType}`
        }
    },

    commentId: (entityType: CommentEntityType): string => {
        switch (entityType) {
            case CommentEntityType.Event:
                return "event_comment_id"
            case CommentEntityType.Poll:
                return "poll_comment_id"
            case CommentEntityType.SongLyric:
                return "song_lyric_comment_id"
            case CommentEntityType.WallPost:
                return "wall_post_comment_id"
            default:
                throw `Unknown entity type: ${entityType}`
        }
    },
}
