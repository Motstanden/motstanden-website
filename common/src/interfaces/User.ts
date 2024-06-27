import {
    UserGroup,
    UserRank,
    UserStatus
} from "../enums/index.js"

export interface UserIdentity {
    id: number;
    fullName: string;
    shortFullName: string;        // Format: 'First M. L.' (for )
    initials: string;
}

export interface NewUser {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    profilePicture: string;
}

export interface User extends NewUser {
    id: number;
    groupId: number;
    groupName: UserGroup;
    rank: UserRank;
    capeName: string;
    status: UserStatus;
    phoneNumber: number | null;
    birthDate: string | null;       // Format: 'YYYY-MM-DD'

    startDate: string;              // Format: 'YYYY-MM-DD'
    endDate: string | null;         // Format: 'YYYY-MM-DD'
    
    createdAt: string;              // Format: 'YYYY-MM-DD HH-MM-SS'
    updatedAt: string;              // Format: 'YYYY-MM-DD HH-MM-SS'
}

export interface UserUpdateAsSelf extends Pick<User, 
    "firstName" | 
    "middleName" | 
    "lastName" | 
    "email" |  
    "phoneNumber" |
    "birthDate" |
    "startDate" |
    "endDate" 
> {}

export interface UserUpdateMembership extends Pick<User,
    "rank" |
    "capeName" |
    "status" |
    "startDate" |
    "endDate"
> {}
    
export interface UserUpdateRole extends Pick<User, "groupName"> {}

export interface UserUpdateAsSuperAdmin extends Pick<User, 
    "firstName" | 
    "middleName" | 
    "lastName" | 
    "email" |
    "groupName" |
    "rank" |
    "capeName" |
    "status" |
    "phoneNumber" |
    "birthDate" |
    "startDate" |
    "endDate" 
> {}
