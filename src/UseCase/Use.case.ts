import userRepository from "../repository/userRepository";
import  {IUser, ITempUser, TempUser} from "../models/userModel";
import dotenv from "dotenv"
import { generateOTP } from "../utils/generateOTP";
import { SendVerificationMail } from "../utils/sendEmail";
import { IUserService } from "../interfaces/IUserService";
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
 

export class UserService implements IUserService{
    
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

    async VerifyOtp(passedData: VerifyOtpData): Promise<{success:boolean, message:string , userData?: IUser}>{
        try {
            const {tempId, enteredOTP} = passedData;
            const tempUser: ITempUser | null = await TempUser.findById(tempId);
            
            if (!tempUser) {
                return { success: false, message: "Temp user not found. { Internal error }" };
            }
    
            if (tempUser.otp !== enteredOTP) {
                return { success: false, message: "You have entered invalid OTP." };
            }
    
            const createdUser: IUser | null = await repository.createUser(tempUser.userData);
    
            if (!createdUser) {
                throw new Error("Failed to create user.");
            }
    
            return { success: true, message: "User has been registered successfuly.", userData: createdUser};
    
        } catch (err) {
            console.error("Error in VerifyOtp:", err);
            return { success: false, message: "An error occurred while verifying OTP." };
        }
    }


    async ResendOTP(passedData : VerifyOtpData):Promise<{success: boolean, message:string}> {
        try{
            const {email,tempId} = passedData;
            let newOTP = generateOTP();
            console.log(`OTP : [   ${newOTP}   ]`);

            const updatedTempUser = await TempUser.findByIdAndUpdate(tempId,{otp:newOTP},{new:true})

            if(!updatedTempUser){
                console.log('failed to send otp')
                return { success: false, message: "Register time has expaired. Try registering again"}
            }else{
                await SendVerificationMail(email,newOTP)

                return {success: true, message:"OTP has been resent"};
            } 
        }catch{
            return {success: false, message: "An error occured while Resending OTP"}
        }
    } 
    
    async userLogin(loginData: { email: string; password: string; }): Promise<{ success: boolean; message: string; userData?: IUser }> {
        try {
            const {email, password} = loginData;
            const userData = await repository.findByEmail(email);
            if(userData){
                const checkPassword = await userData.comparePassword(password)
                if(checkPassword){
                    return {success:true, message: "User login successful.", userData}
                }else {
                    return { success: false, message: "Invalid password."}
                }
            }else{
                return {success: false , message: "This Email is not registered."}
            }
            
        } catch (error) {
            return { success:false, message: "An error occured while loggin in."};
        }
    }

    async fetchStudents():Promise<{success: boolean, students?:any | undefined}>{
        try{
            const students = await repository.getAllUsers();
            if(students){
               return {success :true, students}
            }
        }catch(err){
            return {success: false};
        }
    }
    
}  