import userRepository from "../repository/userRepository";
import  {IUser, ITempUser} from "../models/userModel";
import dotenv from "dotenv"
import { generateOTP } from "../utils/generateOTP";
import { SendVerificationMail } from "../utils/sendEmail";

dotenv.config();

interface User{
    _id:string,
    firstName:string;
    lastName: string; 
    email: string;
    password: string;
}

interface Tempuser{
    _id:string,
    userData:User,
    otp:string,
    createdAt:Date
}

export const UserService = {
    userRegister: async(userData: IUser): Promise <{ success: boolean, message: string, otp?: string, tempId?: string }> => {
        try{

            console.log(`userService ${userData}`)
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

            await SendVerificationMail(email,otp)
  
            console.log('Email send')


            const tempUserData: Tempuser | null  = await userRepository.createTempUser({
                otp,
                userData:userData,
            })

            if (!tempUserData) {
                throw new Error("Failed to create temporary user data.");
            }

           
            return {
                success: true,
                message: "Verification email sent",
                otp: otp,
                tempId: tempUserData._id.toString()// Ensure _id is converted to string if necessary
            };



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