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
    CheckCourseStatusResponse,
    GetCartItemsDTO,
    GetCartItemsResponse,
    GetCourseStatus,
    IsInCart,
    GoogleAuthenticationRequestDTO,
    GoogleAuthenticationResponse,
    UpdateCurrentCourseDTO,
    UpdateCompletedLessonDTO,
    FetchUserCerticateDTO,
    FetchUserCerticateResponse
} from "../Interfaces/DTOs/IController.dto";

export interface OrderEventData {
    userId: string;
    tutorId: string;
    courseId: string;
    transactionId: string;
    title: string;
    thumbnail: string;
    price: string;
    adminShare: string; 
    tutorShare: string;
    paymentStatus:boolean;
    timestamp: Date;
    status: string;
}

import { KafkaMessage } from "kafkajs";
import { kafkaConfig } from "../Configs/Kafka.configs/Kafka.config";
import { ICurrentLesson, IPurchasedCourse } from "../Interfaces/Models/IPurchasedCourse";


export class UserController implements IUserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async start(): Promise<void> {
        const topics =          [ 
          'user.update', 
          'user-service.rollback'       
        ]

        await kafkaConfig.consumeMessages(
          'user-service-group',
          topics,
          this.routeMessage.bind(this)
        );
      } 

      async routeMessage(_topics:string[], message:KafkaMessage, topic:string):Promise<void>{
        try {
          switch (topic) {
            case 'user.update':
                await this.handleMessage(message); 
                break;
            case 'user-service.rollback':
                await this.handleRollback(message);
                break;
            default:
                console.warn(`Unhandled topic: ${topic}`);
        }
        } catch (error) {
          
        }
      } 
 
    // checking order  success or fail
    async handleMessage(message: KafkaMessage): Promise<void> {
        try {
            const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '');
            console.log('START', paymentEvent, 'MESAGe haaha')
            await this.userService.addToPurchaseList(paymentEvent)
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }


        // checking order  success or fail
    async handleRollback(message: KafkaMessage): Promise<void> {
        try {
            const paymentEvent = JSON.parse(message.value?.toString() || '');
            console.log('ROLE BACK KICKED', paymentEvent, 'MESAGe haaha')
            await this.userService.deleteFromPurchaseList(paymentEvent.data);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    async googleAuth(call:grpc.ServerUnaryCall<GoogleAuthenticationRequestDTO,GoogleAuthenticationResponse>, callback:grpc.sendUnaryData<GoogleAuthenticationResponse>): Promise<void>{
        try {
            console.log('auth request from controller', call.request)
            const data = call.request;
            console.log(data)
            const response = await this.userService.googleAuthentication(data);
            callback(null,response);
        } catch (error) {
            callback(error as grpc.ServiceError)
        }
    }

    async signup(call: grpc.ServerUnaryCall<UserRegisterDTO, UserRegisterResponse>, callback: grpc.sendUnaryData<UserRegisterResponse>): Promise<void> {
        try {
            const userData = call.request;
            const response = await this.userService.userRegister(userData);
            if (response.success) {
                callback(null, { success: true, msg: "OTP sent", tempId: response.tempId, email: response.email });
            } else {
                callback(null, { success: false, msg: "Email already exists." })
            }
        } catch (error) {
            callback(error as grpc.ServiceError)
        }
    }

    async verifyOtp(call: grpc.ServerUnaryCall<VerifyOtpDTO, VerifyOtpResponse>, callback: grpc.sendUnaryData<VerifyOtpResponse>): Promise<void> {

        try {
            const data = call.request;
            const response = await this.userService.VerifyOtp(data);
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError)
        }
    }

    async resendOtp(call: grpc.ServerUnaryCall<ResendOtpDTO, ResendOtpResponse>, callback: grpc.sendUnaryData<ResendOtpResponse>): Promise<void> {
        try {
            const data = call.request;
            const response = await this.userService.ResendOTP(data);
            
            callback(null, response);
        } catch (err) {
            callback(err as grpc.ServiceError)
        }
    }

    async userLogin(call: grpc.ServerUnaryCall<UserLoginDTO, UserLoginResponse>, callback: grpc.sendUnaryData<UserLoginResponse>): Promise<void> {
        try {
            console.log('trig', call.request)
            const data = call.request;
            const response = await this.userService.userLogin(data);
            console.log(response, 'response from controller ')

            callback(null, response);
        } catch (err) {
            callback(err as grpc.ServiceError)
        } 
    }

    async blockUnblock(call: grpc.ServerUnaryCall<BlockUnblockDTO, BlockUnblockResponse>, callback: grpc.sendUnaryData<BlockUnblockResponse>): Promise<void> {
        try {
            const userId = call.request; // Extract userId from request
            console.log(userId, 'controller')
            const response = await this.userService.blockUnblock(userId); // Call your service
            callback(null, response); // Pass response to callback
        } catch (error) {
            callback(error as grpc.ServiceError); // Pass error to callback
        }
    }

    async fetchUserById(call:grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            const data = call.request;
            console.log('trig fetchdata by userId form contoller', data);
            const response = await this.userService.getUserById(data);
            console.log(response, 'response from controller (fetchUserById)')
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError); // Pass error to callback

        }
    }

    async fetchStudents(_call: grpc.ServerUnaryCall<null, FetchStudentsResponse>, callback: grpc.sendUnaryData<FetchStudentsResponse>): Promise<void> {
        try {
            console.log('triggerd')
            const response = await this.userService.fetchStudents();
            console.log(response, 'response from controller')
            callback(null, response);
        } catch (err) {
            callback(err as grpc.ServiceError);
        }
    }

    async updateUserDetails(call: grpc.ServerUnaryCall<any,any>, callback:grpc.sendUnaryData<any>): Promise<void>{
        try {
            console.log('triggered user details update.', call.request)
            const data = call.request;
            const response = await this.userService.updateUserDetails(data);
            console.log(response, "response from controller.");
            callback(null, response);
        } catch (error) {
            throw new Error ("error from controller fetching tutor details")
        } 
    } 

    async addToCart(call: grpc.ServerUnaryCall<AddToCartDTO, AddToCartResponse>, callback: grpc.sendUnaryData<AddToCartResponse>): Promise<void> {
        try {
            const data = call.request
            const response = await this.userService.addToCart(data) 
            console.log(response, 'response from controller');
            callback(null, response)
        } catch (err) {
            callback(err as grpc.ServiceError);
        } 
    }

    async isInCart(call: grpc.ServerUnaryCall<IsInCart, IsInCartResponse>, callback: grpc.sendUnaryData<IsInCartResponse>): Promise<void> {
        try {
            const data = call.request;
            const response = await this.userService.isInCart(data);
            callback(null, response);
        } catch (err) {

        }
    }



    async courseStatus(call: grpc.ServerUnaryCall<GetCourseStatus, CheckCourseStatusResponse>, callback: grpc.sendUnaryData<CheckCourseStatusResponse>): Promise<void> {
        try {
            const data = call.request;
            const response = await this.userService.checkCourseStatus(data)
            console.log(response, 'response form checking course status')
            callback(null, response)
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async getCartItems(call: grpc.ServerUnaryCall<GetCartItemsDTO, GetCartItemsResponse>, callback: grpc.sendUnaryData<GetCartItemsResponse>): Promise<void> {
        try {
            console.log('trug')
            const data = call.request;
            console.log(data, 'data form controller')
            const response = await this.userService.getCartItems(data);
            console.log(response)
            callback(null, { success: response.success, courseIds: response.cart })
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async isBlocked(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('isBlocked trig');
            const data = call.request
            console.log(data);
            const response = await this.userService.checkIsBlocked(data);
            console.log(response, 'response from controller')
            callback(null, { isBlocked: response.isBlocked })
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async resetPassword(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('trig respassword controller')
            const data = call.request;
            const response = await this.userService.resetPassword(data)
            callback(null, response)
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async sendOtpToEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('trig to otp email send controller ', call.request)
            const data = call.request;
            const response = await this.userService.sendEmailOtp(data);
            console.log('reseponse from controller', response);
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async resendOtpToEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('trig to resend otp email send controller ', call.request);
            const data = call.request;
            const response = await this.userService.resendEmailOtp(data);
            console.log('reseponse from controller', response);
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async VerifyEnteredOTP(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('trig', call.request);
            const data = call.request;
            const response = await this.userService.resetPasswordVerifyOTP(data);
            console.log(response, 'response from controller')
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError);
        }  
    } 

    async linkNameToReview(call:grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        console.log("vann")
        try {
            console.log('trig review fetch', call.request);
            const data = call.request;
            const response = await this.userService.attachReviewById(data);
            console.log(response, 'this is the response from attatch review by id');
            const reviewData = response;
            callback(null, {reviewData});
        } catch (error) {  
            callback(error as grpc.ServiceError);
        }
    } 
    
    async linkNameToMessages(call:grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>): Promise<void> {

        console.log("vann")
        try {
            console.log('trig message fetch', call.request);
            const data = call.request;
            const response = await this.userService.attachMessageById(data);
            console.log(response, 'this is the response');
            const messageData = {
                courseId: data.courseId,
                messages: response,
            }
            callback(null, messageData);
        } catch (error) {  
            callback(error as grpc.ServiceError);
        }
    } 

    async fetchUsersByIds(call: grpc.ServerUnaryCall<any,any>,callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('triggered fetch users by ids', call.request);
            const data = call.request;
            const response =  await this.userService.fetchUsersByIds(data);
            console.log(response)
            callback(null, {users:response})
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    } 

    async updateCurrentLesson(call:grpc.ServerUnaryCall<UpdateCurrentCourseDTO, ICurrentLesson>, callback:grpc.sendUnaryData<ICurrentLesson>):Promise<void> {
        try {
            const data = call.request;
            const response = await this.userService.updateCurrentLesson(data)
            callback(null, response)
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async updateCompletedLesson(call:grpc.ServerUnaryCall<UpdateCompletedLessonDTO, {data:IPurchasedCourse}>, callback:grpc.sendUnaryData<{data:IPurchasedCourse}>):Promise<void>{
        try {
            const data = call.request;
            const response = await this.userService.updateCompletedLesson(data);
            callback(null, response)
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async fetchUserCertificate(call:grpc.ServerUnaryCall<FetchUserCerticateDTO, FetchUserCerticateResponse>, callback:grpc.sendUnaryData<FetchUserCerticateResponse>):Promise<void>{
        try {
            const data = call.request;
            const response = await this.userService.getCertificate(data);
            callback(null, response)
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }
 
    test(_call: grpc.ServerUnaryCall<null, {success:boolean}>, callback: grpc.sendUnaryData<{success:boolean}>): void {
        console.log('test')
        callback(null, {success:true})
    }
}




