import { IUser } from "../Models/IUser";

export interface IJWT {
    createToken(user:IUser) : {accessToken:string,refreshToken:string}
}