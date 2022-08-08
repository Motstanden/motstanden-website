import { UserGroup } from "../enums/UserGroup";
import { UserRank } from "../enums/UserRank";

export interface NewUser {
    email: string;
    groupName: UserGroup;
    rank: UserRank;
    firstName: string;
    middleName: string;
    lastName: string;
    profilePicture: string;
}

export interface User extends NewUser {
    userId: number;
    groupId: number;
}