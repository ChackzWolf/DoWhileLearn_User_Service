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
    IsInCart
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
// import { kafkaConfig } from "../Configs/Kafka.configs/Kafka.config";
import { KafkaMessage } from "kafkajs";
import { kafkaConfig } from "../Configs/Kafka.configs/Kafka.config";
const userService = new UserService()


export class UserController implements IUserController {

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
            await userService.addToPurchaseList(paymentEvent)
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }


        // checking order  success or fail
    async handleRollback(message: KafkaMessage): Promise<void> {
        try {
            const paymentEvent = JSON.parse(message.value?.toString() || '');
            console.log('ROLE BACK KICKED', paymentEvent, 'MESAGe haaha')
            await userService.deleteFromPurchaseList(paymentEvent.data);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    async signup(call: grpc.ServerUnaryCall<UserRegisterDTO, UserRegisterResponse>, callback: grpc.sendUnaryData<UserRegisterResponse>): Promise<void> {
        try {
            const userData = call.request;
            const response = await userService.userRegister(userData);
            if (response.success) {
                callback(null, { success: true, msg: "OTP sent", tempId: response.tempId, email: response.email });
            } else {
                callback(null, { success: false, msg: "Email already exists." })
            }
        } catch (err) {
            callback(err as grpc.ServiceError)
        }
    }

    async verifyOtp(call: grpc.ServerUnaryCall<VerifyOtpDTO, VerifyOtpResponse>, callback: grpc.sendUnaryData<VerifyOtpResponse>): Promise<void> {

        try {
            const data = call.request;
            const response = await userService.VerifyOtp(data);
            callback(null, response);
        } catch (err) {
            callback(err as grpc.ServiceError)
        }
    }

    async resendOtp(call: grpc.ServerUnaryCall<ResendOtpDTO, ResendOtpResponse>, callback: grpc.sendUnaryData<ResendOtpResponse>): Promise<void> {
        try {
            const data = call.request;
            const response = await userService.ResendOTP(data);
            callback(null, response);
        } catch (err) {
            callback(err as grpc.ServiceError)
        }
    }

    async userLogin(call: grpc.ServerUnaryCall<UserLoginDTO, UserLoginResponse>, callback: grpc.sendUnaryData<UserLoginResponse>): Promise<void> {
        try {
            console.log('trig')
            const data = call.request;
            const response = await userService.userLogin(data);
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
            const response = await userService.blockUnblock(userId); // Call your service
            callback(null, response); // Pass response to callback
        } catch (error) {
            callback(error as grpc.ServiceError); // Pass error to callback
        }
    }

    async fetchUserById(call:grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            const data = call.request;
            console.log('trig fetchdata by userId form contoller', data);
            const response = await userService.getUserById(data);
            console.log(response, 'response from controller (fetchUserById)')
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError); // Pass error to callback

        }
    }

    async fetchStudents(_call: grpc.ServerUnaryCall<null, FetchStudentsResponse>, callback: grpc.sendUnaryData<FetchStudentsResponse>): Promise<void> {
        try {
            console.log('triggerd')
            const response = await userService.fetchStudents();
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
            const response = await userService.updateUserDetails(data);
            console.log(response, "response from controller.");
            callback(null, response);
        } catch (error) {
            throw new Error ("error from controller fetching tutor details")
        } 
    } 

    async addToCart(call: grpc.ServerUnaryCall<AddToCartDTO, AddToCartResponse>, callback: grpc.sendUnaryData<AddToCartResponse>): Promise<void> {
        try {
            const data = call.request
            const response = await userService.addToCart(data)
            console.log(response, 'response from controller');
            callback(null, response)
        } catch (err) {
            callback(err as grpc.ServiceError);
        }
    }

    async isInCart(call: grpc.ServerUnaryCall<IsInCart, IsInCartResponse>, callback: grpc.sendUnaryData<IsInCartResponse>): Promise<void> {
        try {
            const data = call.request;
            const response = await userService.isInCart(data);
            callback(null, response);
        } catch (err) {

        }
    }



    async courseStatus(call: grpc.ServerUnaryCall<GetCourseStatus, CheckCourseStatusResponse>, callback: grpc.sendUnaryData<CheckCourseStatusResponse>): Promise<void> {
        try {
            const data = call.request;
            const response = await userService.checkCourseStatus(data)
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
            const response = await userService.getCartItems(data);
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
            const response = await userService.checkIsBlocked(data);
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
            const response = await userService.resetPassword(data)
            callback(null, response)
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async sendOtpToEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('trig to otp email send controller ', call.request)
            const data = call.request;
            const response = await userService.sendEmailOtp(data);
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
            const response = await userService.resendEmailOtp(data);
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
            const response = await userService.resetPasswordVerifyOTP(data);
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
            const response = await userService.attachReviewById(data);
            console.log(response, 'this is the response');
            const reviewData =response;
            callback(null, {reviewData});
        } catch (error) {  
            
        }
    } 
    async linkNameToMessages(call:grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>): Promise<void> {

        console.log("vann")
        try {
            console.log('trig message fetch', call.request);
            const data = call.request;
            const response = await userService.attachMessageById(data);
            console.log(response, 'this is the response');
            const messageData = {
                courseId: data.courseId,
                messages: response,
            }
            callback(null, messageData);
        } catch (error) {  
            
        }
    } 

    async fetchUsersByIds(call: grpc.ServerUnaryCall<any,any>,callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('triggered fetch users by ids', call.request);
            const data = call.request;
            const response =  await userService.fetchUsersByIds(data);
            console.log(response)
            callback(null, {users:response})
        } catch (error) {
            
        }
    }
}

