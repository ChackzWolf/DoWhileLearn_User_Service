import dotenv from "dotenv";
import jwt ,{ Secret }from "jsonwebtoken";
import { IUser } from "../Interfaces/Models/IUser";
import { configs } from "../Configs/ENV_configs/ENV.configs";
import { IJWT } from "../Interfaces/IUtils/IJWT";
dotenv.config()

const JWT_SECRET = configs.JWT_SECRET;
const REFRESH_TOKEN_SECRET = configs.REFRESH_TOKEN_SECRET;

if(!JWT_SECRET || !REFRESH_TOKEN_SECRET){
    throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environmental variables. ")
}


export class JWT implements IJWT{
    createToken(user:IUser) : {accessToken:string,refreshToken:string} {

        const accessToken = jwt.sign(
            {
                id : user._id,
                role:"USER",
                email: user.email,  
            },JWT_SECRET as Secret,
            { expiresIn: configs.JWT_EXPIRATION_TIME }
        )
        
        const refreshToken = jwt.sign(
            {
                id: user._id,
                role:"USER",
                email: user.email,
            },
            REFRESH_TOKEN_SECRET as Secret,
            {expiresIn: configs.REFRESH_TOKEN_EXPIRATION_TIME}
        )
    
        return {accessToken, refreshToken}
    }
}



