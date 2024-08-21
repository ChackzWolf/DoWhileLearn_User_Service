import { UserService } from "../services/userService";

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string; 
} 

export const UserController = {
    signup: async (call: any, callback: any) => {
        try {
            console.log(`UserController ${call}`)
            const userData : UserData = call.request;
            const response = await UserService.userRegister(userData);
            console.log(response, 'from user controller')
            if(response.success) {
                callback( null , { success: true, msg: "OTP sent", otp: response.otp, data: response.tempId});
            }else{
                callback(null, {success: false, msg: "Email already exists."})
            }
        } catch (err) {
            callback(err)
        }
    },
    otp: async( call: any, callback: any) => {
        try {
            const body = call.request;
            const {otp, userData, enteredOTP} = body;
            const otpResponse = await UserService.verifyOtp(enteredOTP, otp, userData);
            callback(null, otpResponse)
        }catch(err){
            callback(err);
        }
    }
}