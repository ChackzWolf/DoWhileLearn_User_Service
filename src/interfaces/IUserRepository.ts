import { ITempUser, IUser } from "../models/userModel";

export interface IUserRepository{
    findByEmail(email:string):Promise<IUser | null>
    createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser> | null
    createUser(userData: Partial<IUser>):Promise<IUser | null>
    
}
