import { AccessTokenData } from "./AccessTokenData";

export interface RefreshTokenData extends AccessTokenData {
    salt: string
}