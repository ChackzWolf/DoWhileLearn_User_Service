import { UserService } from "../UseCase/Use.case";
import * as grpc from '@grpc/grpc-js';
import { IUserController } from "../interfaces/IUserController";
// interface BlockUnblockRequest {
//     userId: string;
// }
// interface BlockUnblockResponse {
//     success: boolean;
//     message?: string;
// }


const userService = new UserService()


export class UserController implements IUserController{

    async signup(call: any, callback: any): Promise<void> {
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
 
    async verifyOtp(call: any, callback: any) : Promise<void>{
        try{
            const data = call.request;
            const response = await userService.VerifyOtp(data);
            callback(null, response);
        }catch(err){
            console.error(err)
        }
    }

    async resendOtp(call:any, callback:any): Promise<void> {
        try{
            const data = call.request;
            const response = await userService.ResendOTP(data);
            callback(null,response);
        }catch(err){
            callback(err) 
        }
    } 
 
    async userLogin(call:any, callback:any): Promise<void>{
        try{
            const data = call.request;
            const response = await userService.userLogin(data);
            callback(null, response);
        }catch(err){
            callback(err)
        }
    }

    async  blockUnblock(
        call: any,
        callback: any
    ): Promise<void> {
        try {
            const userId = call.request; // Extract userId from request
            console.log(userId,'controller')
            const response = await userService.blockUnblock(userId); // Call your service
            callback(null, response); // Pass response to callback
        } catch (error) {
            callback(error as grpc.ServiceError); // Pass error to callback
        }
    }

    async fetchStudents(_call: any, callback: any) {
        try{
            console.log('triggerd')
            const response = await userService.fetchStudents();
            console.log(response, 'response from controller')
            callback(null, response);
        }catch(err){
            callback(err);
        }
    } 
}

 