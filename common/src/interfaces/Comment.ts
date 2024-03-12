import { CommentEntityType } from "../enums/CommentEntityType.js";

export interface NewComment {
    comment: string;
}

export interface Comment extends NewComment {
    id: number;
    createdBy: number;
    createdAt: string;      // yyyy-mm-dd hh:mm:ss
}

export interface EntityComment extends Comment {
    entityId: number;
    type: CommentEntityType;
}