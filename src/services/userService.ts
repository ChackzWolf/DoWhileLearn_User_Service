import userRepository from "../repository/userRepository";
import  {IUser, ITempUser, TempUser} from "../models/userModel";
import dotenv from "dotenv"
import { generateOTP } from "../utils/generateOTP";
import { SendVerificationMail } from "../utils/sendEmail";
import createToken from "../utils/activationToken";
dotenv.config();

interface User{
    firstName:string;
    lastName: string; 
    email: string;
    password: string;
}

interface VerifyOtpData{
    enteredOTP:string;
    email:string;
    tempId:string
}

const repository = new userRepository()

interface promiseReturn { success: boolean, message: string, tempId?: string, email?: string }
 

export class UserService {
    
    async userRegister(userData: User): Promise <promiseReturn> {
        try{
            console.log(`userService ${userData}`)
            const email = userData.email;
            if(email === undefined){
                throw new Error("Email is undefined");
            } 
            const emailExists = await repository.findByEmail(email);
            
            if(emailExists){
                console.log('email exists triggered')
                return {success: false, message: "Email already exists" };
            }

            let otp = generateOTP();
            console.log(`OTP : [ ${otp} ]`);

            await SendVerificationMail(email,otp)
  
            console.log('Email send')


            const tempUserData: ITempUser | null = await repository.createTempUser({
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
    }

    async VerifyOtp(passedData: VerifyOtpData): Promise<{success:boolean, message:string, token?:string}>{
        try {
            const tempUser: ITempUser | null = await TempUser.findById(passedData.tempId);
            
            if (!tempUser) {
                return { success: false, message: "Temp user not found." };
            }
    
            if (tempUser.otp !== passedData.enteredOTP) {
                return { success: false, message: "Invalid OTP." };
            }
    
            const createUser: IUser | null = await repository.createUser(tempUser.userData);
    
            if (!createUser) {
                throw new Error("Failed to create user.");
            }
    
            const token = createToken(createUser);
            return { success: true, message: "User has been registered.", token };
    
        } catch (err) {
            console.error("Error in VerifyOtp:", err);
            return { success: false, message: "An error occurred while verifying OTP." };
        }
    }



    async ResendOTP(passedData : VerifyOtpData):Promise<{success: boolean, msg:string}> {
        try{
            const {email,tempId} = passedData;
            let newOTP = generateOTP();
            console.log(`OTP : [   ${newOTP}   ]`);

            const updatedTempUser = await TempUser.findByIdAndUpdate(tempId,{otp:newOTP},{new:true})

            if(!updatedTempUser){
                console.log('failed to send otp')
                return { success: false, msg: "Register time has expaired. Try registering again"}
            }else{
                await SendVerificationMail(email,newOTP)

                return {success: true, msg:"OTP has been resent"};
            } 
        }catch{
            return {success: false, msg: "An error occured while Resending OTP"}
        }
    }
}