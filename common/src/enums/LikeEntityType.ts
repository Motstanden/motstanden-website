
// All though a purist would argue that the strings should be singular and delimited by a hyphen (E.G. "event-comment"), 
// this structure is used to match the API endpoints - which is very convenient for us!

export enum LikeEntityType {
    EventComment = "events/comments",
    PollComment = "polls/comments",
    SongLyricComment = "lyrics/comments",
    WallPost = "wall/posts",
    WallPostComment = "wall/posts/comments"
}