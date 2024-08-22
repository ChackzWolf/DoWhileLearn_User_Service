import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { IUser } from "../models/userModel";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environmental variables.")
}

const createToken = (user:IUser) :string=>{
    const token = jwt.sign(
        {
            id : user._id,
            email: user.email,  
        },JWT_SECRET
    )

    return token
}

export default createToken
