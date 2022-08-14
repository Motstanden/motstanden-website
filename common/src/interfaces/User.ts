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
    capeName: string;
    
    status: UserStatus;
    startDate: string;              // Format: 'YYYY-MM-DD'
    
    endDate: string | null;         // Format: 'YYYY-MM-DD'
    phoneNumber: number | null;
    birthDate: string | null;       // Format: 'YYYY-MM-DD'
}

export interface User extends NewUser {
    userId: number;
    groupId: number;
    createdAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'
    updatedAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'
}