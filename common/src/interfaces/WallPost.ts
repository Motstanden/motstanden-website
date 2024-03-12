export interface NewWallPost {
    content: string;
    wallUserId: number;   
}

export interface WallPost extends NewWallPost {
    id: number;
    createdBy: number;
    createdAt: string;      // yyyy-mm-dd hh:mm:ss
}