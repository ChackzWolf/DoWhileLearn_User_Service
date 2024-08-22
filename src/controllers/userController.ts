import { UserService } from "../services/userService";



export const UserController = {
    signup: async (call: any, callback: any) => {
        try {
            console.log(`UserController ${call}`)
            const userData = call.request;
            const response = await UserService.userRegister( userData);
            console.log(response, 'from user controller')
            if(response.success) {
                callback( null , { success: true, msg: "OTP sent", tempId: response.tempId, email: response.email});
            }else{
                callback(null, {success: false, msg: "Email already exists."})
            }
        } catch (err) {
            callback(err)
        }
    },
    verifyOtp: async (call: any, callback: any) =>{
        try{
            console.log(`UserController ${call}`);
            const data = call.request
            const response = await UserService.VerifyOtp(data);
            console.log(response, 'userController')
            callback(null, "hello world");
        }catch(err){
            console.error(err)
        }
    }
    // otp: async( call: any, callback: any) => {
    //     try {
    //         const body = call.request;
    //         const {otp, userData, enteredOTP} = body;
    //         const otpResponse = await UserService.verifyOtp(enteredOTP, otp, userData);
    //         callback(null, otpResponse)
    //     }catch(err){
    //         callback(err);
    //     }
    // }
}