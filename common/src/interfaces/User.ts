import { UserGroup } from "../enums/UserGroup";
import { UserRank } from "../enums/UserRank";

export interface User {
    userId: number;
    email: string;
    groupId: number;
    groupName: UserGroup;
    rank: UserRank;
    firstName: string;
    middleName: string;
    lastName: string;
    profilePicture: string;
}