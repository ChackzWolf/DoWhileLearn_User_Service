import { UserService } from "../services/userService";


const userService = new UserService()


export class UserController {

    async signup(call: any, callback: any) {
        try {
            const userData = call.request;
            const response = await userService.userRegister( userData);
            if(response.success) {
                callback( null , { success: true, msg: "OTP sent", tempId: response.tempId, email: response.email});
            }else{
                callback(null, {success: false, msg: "Email already exists."})
            }
        } catch (err) {
            callback(err)
        }
    }
    async verifyOtp(call: any, callback: any) {
        try{
            console.log(`UserController ${call}`);
            const data = call.request;
            const response = await userService.VerifyOtp(data);
            console.log(response, 'userController')
            callback(null, response);
        }catch(err){
            console.error(err)
        }
    }
    async resendOtp(call:any, callback:any) {
        try{
        const data = call.request;
        const response = await userService.ResendOTP(data);
        callback(null,response);
        }catch(err){
            callback(err)
        }
    }
}