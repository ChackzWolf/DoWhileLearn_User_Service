import userRepository from "../repository/userRepository";
import  {IUser, ITempUser, TempUser} from "../models/userModel";
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
 

export const UserService = {
    userRegister: async(userData: User): Promise <{ success: boolean, message: string, tempId?: string, email?: string }> => {
        try{
            console.log(`userService ${userData}`)
            const email = userData.email;
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


            const tempUserData: ITempUser | null = await userRepository.createTempUser({
                otp,
                userData: userData as IUser,
            });

            if (tempUserData) { 
                const tempId = tempUserData._id.toString(); // Convert ObjectId to string if needed
                return { success: true, message: "Verification email sent", tempId, email};
            } else {
                throw new Error("Failed to create temporary user data.");
            }
 

        }catch(err){
            throw new Error(`Failed to signup: ${err}`);
        } 
    },

    VerifyOtp: async (pass:any) =>{
        try{
            const tempUser: ITempUser | null  = await TempUser.findById(pass.tempId);
            if(tempUser){
                if(tempUser.otp === pass.enteredOTP){
                    const createUser = userRepository.createUser(tempUser.userData);

                    console.log('created user', createUser)
                    if(!createUser){
                        throw new Error('Failed to create User');
                    }else{
                        // const token = createToken(createUser);
                        return {sucess: true, message: "User has been registered."}

                    }
                }
            }  

            console.log(tempUser, 'userService')   

            return pass;
        }catch(err){ 
            console.error(err)  
        }
    }
    // verifyOtp: async ( enteredOTP: string, otp: string, userData: User) : Promise<{ success: boolean, message: string, userData?: User }> => {
    //     try {
    //         if (otp === enteredOTP) {
    //             const createdUser = await userRepository.createUser(userData);
                
    //             if (createdUser) {
    //                 return {
    //                     success: true,
    //                     message: "Correct OTP",
    //                     userData: createdUser 
    //                 };
    //             } else { 
    //                 return {
    //                     success: false,
    //                     message: "User creation failed. User data is null."
    //                 };
    //             }
    //         } else {
    //             return { success: false, message: 'Invalid OTP.' };
    //         }
    //     } catch (err) {
    //         throw new Error(`Failed to verify OTP: ${err}`);
    //     }
    // }
}