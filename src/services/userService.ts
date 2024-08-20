import userRepository from "../repository/userRepository";
import  {IUser} from "../models/userModel";
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

            console.log(`userService userData`)
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
    },

    verifyOtp: async ( enteredOTP: string, otp: string, userData: User) : Promise<{ success: boolean, message: string, userData?: User }> => {
        try {
            if (otp === enteredOTP) {
                const createdUser = await userRepository.createUser(userData);
    
                if (createdUser) {
                    return {
                        success: true,
                        message: "Correct OTP",
                        userData: createdUser
                    };
                } else {
                    return {
                        success: false,
                        message: "User creation failed. User data is null."
                    };
                }
            } else {
                return { success: false, message: 'Invalid OTP.' };
            }
        } catch (err) {
            throw new Error(`Failed to verify OTP: ${err}`);
        }
    }
}