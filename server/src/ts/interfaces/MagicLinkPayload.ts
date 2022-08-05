
export interface MagicLinkPayload {
    destination: string;
    code: string;
    iat: number;    // iat = Issued at. Is NumericDate value, which is defined as defined as the number of seconds (not milliseconds) since Epoch:
    exp: number;    // exp = Expiration Time. ----||---- 
}
