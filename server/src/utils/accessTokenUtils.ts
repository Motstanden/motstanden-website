import { UserGroup } from "common/enums";
import { userGroupToNum } from "common/utils";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";

export function hasGroupAccess(token: AccessTokenData, requiredGroup: UserGroup) {
    return userGroupToNum(token.groupName) >= userGroupToNum(requiredGroup)
}