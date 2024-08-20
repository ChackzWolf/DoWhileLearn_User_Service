import userRepository from "../repository/userRepository";
import UserModel, {IUser} from "../models/userModel";
import dotenv from "dotenv"
import { generateOTP } from "../utils/generateOTP";
import { SendVerificationMail } from "../utils/sendEmail";

dotenv.config();

interface User{
    firstName:string;
    lastName: string;
    email: string;
    password: string;
}

export const UserService = {
    userRegister: async(userData: Partial<IUser>): Promise <{ success: boolean, message: string, otp?: string, user_data?: User }> => {
        try{
            const {firstName, lastName, email, password} = userData;
            if(email === undefined){
                throw new Error("Email is undefined");
            }
            const emailExists = await userRepository.findByEmail(email);
            if(emailExists){
                return {success: false, message: "Email already exists" };
            }
            
            let otp = generateOTP();
            console.log(`OTP : [ ${otp} ]`);
            SendVerificationMail(email,otp)

            const user_data : User = {
                firstName:firstName || '',
                lastName:lastName || '',
                email:email || '',
                password:password || '',
            } 
            return {success: true, message: "Verification email sent", otp: otp, user_data: user_data}

        }catch(err){
            throw new Error(`Failed to signup: ${err}`);
        }
    }
}