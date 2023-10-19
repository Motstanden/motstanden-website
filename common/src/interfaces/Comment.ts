import { CommentEntityType } from "../enums/CommentEntityType.js";

export interface NewComment {
    content: string;
}

export interface Comment extends NewComment {
    id: number;
    userId: number;
    createdAt: string;      // yyyy-mm-dd hh:mm:ss
}

export interface EntityComment extends Comment {
    entityId: number;
    type: CommentEntityType;
}