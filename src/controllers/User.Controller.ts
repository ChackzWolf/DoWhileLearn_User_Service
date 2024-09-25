import { UserService } from "../UseCase/Use.case";
import * as grpc from '@grpc/grpc-js';
import { IUserController } from "../interfaces/IUserController";
import { BlockUnblockRequest,BlockUnblockResponse } from "../interfaces/IUserController";

// interface BlockUnblockRequest {
//     userId: string;
// }
// interface BlockUnblockResponse {
//     success: boolean;
//     message?: string;
// }


const userService = new UserService()


export class UserController implements IUserController{

    async signup(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            const userData = call.request;
            const response = await userService.userRegister( userData);
            if(response.success) {
                callback( null , { success: true, msg: "OTP sent", tempId: response.tempId, email: response.email});
            }else{
                callback(null, {success: false, msg: "Email already exists."})
            }
        } catch (err) {
            callback(err as grpc.ServiceError)
        }
    } 
 
    async verifyOtp(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) : Promise<void>{
        try{
            const data = call.request;
            const response = await userService.VerifyOtp(data);
            callback(null, response);
        }catch(err){
            console.error(err as grpc.ServiceError)
        }
    }

    async resendOtp(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try{
            const data = call.request;
            const response = await userService.ResendOTP(data);
            callback(null,response);
        }catch(err){
            callback(err as grpc.ServiceError) 
        }
    } 
 
    async userLogin(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>{
        try{
            const data = call.request;
            const response = await userService.userLogin(data);
            console.log(response, 'response from controller ')
            callback(null, response);
        }catch(err){
            callback(err as grpc.ServiceError)
        }
    }

    async  blockUnblock(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>{
        try {
            const userId = call.request; // Extract userId from request
            console.log(userId,'controller')
            const response = await userService.blockUnblock(userId); // Call your service
            callback(null, response); // Pass response to callback
        } catch (error) {
            callback(error as grpc.ServiceError); // Pass error to callback
        }
    }

    async fetchStudents(_call: grpc.ServerUnaryCall<BlockUnblockRequest, BlockUnblockResponse>, callback: grpc.sendUnaryData<BlockUnblockResponse>): Promise<void>{
        try{
            console.log('triggerd')
            const response = await userService.fetchStudents();
            console.log(response, 'response from controller')
            callback(null, response);
        }catch(err){
            callback(err as grpc.ServiceError);
        }
    } 

    async addToCart(call:grpc.ServerUnaryCall<any, any>, callback:grpc.sendUnaryData<any>):Promise<void>{
        try {
            const data= call.request
            const response = await userService.addToCart(data)
            console.log(response,'response from controller');
            callback(null,response)
        } catch (err) {
            callback(err as grpc.ServiceError);
        }
    }

    async isInCart(call:grpc.ServerUnaryCall<any, any>, callback:grpc.sendUnaryData<any>):Promise<void>{
        try {
            const data = call.request;
            const response = await userService.isInCart(data);
            callback(null, response);
        } catch (err) {
            
        }
    }
}

 