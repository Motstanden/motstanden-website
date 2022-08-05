import { UserGroup } from "../enums/UserGroup";

export interface AccessTokenData {
    userId: number;
    email: string;
    groupId: number;
    groupName: UserGroup;
}
