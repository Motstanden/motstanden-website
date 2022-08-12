import { UserStatus } from "../enums";
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
    status: UserStatus;
    startDate: string,          // Format: 'YYYY-MM-DD'
    
    endDate?: string,           // Format: 'YYYY-MM-DD'
    capeName?: string;
    phoneNumber?: number;
    birthDate?: string;          // Format: 'YYYY-MM-DD'
}

export interface User extends NewUser {
    userId: number;
    groupId: number;
    createdAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'
    updatedAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'
}