// Name for cookies with the attribute: HttpOnly=false
// These types of cookies can be accessed by both the client and the server.
// The server should never trust the data in these cookies because it can be modified by the client.
export enum PublicCookieName {

    // This cookie stores the last valid user data.
    // It is used to do optimistic authentication in the client.
    UnsafeUserInfo = "UnsafeUserInfo"
}