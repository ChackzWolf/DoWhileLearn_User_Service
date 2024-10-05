import { UserService } from "../Services/User.service";
import * as grpc from '@grpc/grpc-js';
import { IUserController } from "../Interfaces/IControllers/IController.interfaces";
import {
    UserRegisterDTO,
    UserRegisterResponse,
    VerifyOtpDTO,
    VerifyOtpResponse,
    ResendOtpDTO,
    ResendOtpResponse,
    UserLoginDTO,
    UserLoginResponse,
    BlockUnblockDTO,
    BlockUnblockResponse,
    FetchStudentsResponse,
    AddToCartDTO,
    AddToCartResponse,
    IsInCartResponse,
    AddToPurchaseListDTO,
    AddToPurchaseListResponse,
    CheckCourseStatusResponse,
    GetCartItemsDTO,
    GetCartItemsResponse,
    GetCourseStatus,
    IsInCart
} from "../Interfaces/DTOs/IController.dto";


const userService = new UserService()


export class UserController implements IUserController{

    async signup(call: grpc.ServerUnaryCall<UserRegisterDTO, UserRegisterResponse>, callback: grpc.sendUnaryData<UserRegisterResponse>): Promise<void> {
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
 
    async verifyOtp(call: grpc.ServerUnaryCall<VerifyOtpDTO, VerifyOtpResponse>, callback: grpc.sendUnaryData<VerifyOtpResponse>): Promise<void> {
        
        try{
            const data = call.request;
            const response = await userService.VerifyOtp(data);
            callback(null, response);
        }catch(err){
            callback(err as grpc.ServiceError)
        }
    }

    async resendOtp(call: grpc.ServerUnaryCall<ResendOtpDTO, ResendOtpResponse>, callback: grpc.sendUnaryData<ResendOtpResponse>): Promise<void> {
        try{
            const data = call.request;
            const response = await userService.ResendOTP(data);
            callback(null,response);
        }catch(err){
            callback(err as grpc.ServiceError) 
        } 
    } 
 
    async userLogin(call: grpc.ServerUnaryCall<UserLoginDTO, UserLoginResponse>, callback: grpc.sendUnaryData<UserLoginResponse>): Promise<void> {
        try{
            console.log('trig')  
            const data = call.request; 
            const response = await userService.userLogin(data);
            console.log(response, 'response from controller ')
            callback(null, response);
        }catch(err){
            callback(err as grpc.ServiceError)
        }
    }

    async blockUnblock(call: grpc.ServerUnaryCall<BlockUnblockDTO, BlockUnblockResponse>, callback: grpc.sendUnaryData<BlockUnblockResponse>): Promise<void> {
        try {
            const userId = call.request; // Extract userId from request
            console.log(userId,'controller')
            const response = await userService.blockUnblock(userId); // Call your service
            callback(null, response); // Pass response to callback
        } catch (error) {
            callback(error as grpc.ServiceError); // Pass error to callback
        }
    }

    async fetchStudents(_call: grpc.ServerUnaryCall<null, FetchStudentsResponse>, callback: grpc.sendUnaryData<FetchStudentsResponse>): Promise<void> {
        try{
            console.log('triggerd')
            const response = await userService.fetchStudents();
            console.log(response, 'response from controller')
            callback(null, response);
        }catch(err){
            callback(err as grpc.ServiceError);
        }
    } 

    async addToCart(call:grpc.ServerUnaryCall<AddToCartDTO, AddToCartResponse>, callback:grpc.sendUnaryData<AddToCartResponse>):Promise<void>{
        try {
            const data= call.request
            const response = await userService.addToCart(data)
            console.log(response,'response from controller');
            callback(null,response)
        } catch (err) {
            callback(err as grpc.ServiceError);
        }
    }

    async isInCart(call:grpc.ServerUnaryCall<IsInCart, IsInCartResponse>, callback:grpc.sendUnaryData<IsInCartResponse>):Promise<void>{
        try {
            const data = call.request;
            const response = await userService.isInCart(data);
            callback(null, response);
        } catch (err) {
            
        }
    }

    async addToPurchaseList(call:grpc.ServerUnaryCall<AddToPurchaseListDTO, AddToPurchaseListResponse>, callback:grpc.sendUnaryData<AddToPurchaseListResponse>):Promise<void>{
        try {
            const data= call.request
            const response = await userService.addToPurchaseList(data)
            console.log(response,'response from controller');
            callback(null,response)
        } catch (err) {
            callback(err as grpc.ServiceError);
        }
    }
 
    async courseStatus(call:grpc.ServerUnaryCall<GetCourseStatus, CheckCourseStatusResponse>, callback:grpc.sendUnaryData<CheckCourseStatusResponse>):Promise<void>{
        try {
            const data = call.request;
            const response = await userService.checkCourseStatus(data)
            console.log(response, 'response form checking course status')
            callback(null,response)
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async getCartItems(call:grpc.ServerUnaryCall<GetCartItemsDTO, GetCartItemsResponse>, callback:grpc.sendUnaryData<GetCartItemsResponse>):Promise<void> {
        try {
            console.log('trug')
            const data = call.request;
            console.log(data,'data form controller')
            const response = await userService.getCartItems(data);
            console.log(response)
            callback(null,{success: response.success, courseIds : response.cart})
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }
}

 