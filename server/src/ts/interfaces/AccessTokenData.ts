import { UserGroup } from "common/enums"

export interface AccessTokenData {
    userId: number;
    email: string;
    groupId: number;
    groupName: UserGroup;
}
