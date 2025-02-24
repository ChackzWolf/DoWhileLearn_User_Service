import * as grpc from '@grpc/grpc-js';
import { IUserController } from "../Interfaces/IControllers/IController.interfaces";
import { UserRegisterDTO, UserRegisterResponse, VerifyOtpDTO, VerifyOtpResponse, ResendOtpDTO, ResendOtpResponse, UserLoginDTO, UserLoginResponse, BlockUnblockDTO, BlockUnblockResponse, FetchStudentsResponse, AddToCartDTO, AddToCartResponse, IsInCartResponse, CheckCourseStatusResponse, GetCartItemsDTO, GetCartItemsResponse, GetCourseStatus, IsInCart } from "../Interfaces/DTOs/IController.dto";
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
    paymentStatus: boolean;
    timestamp: Date;
    status: string;
}
import { KafkaMessage } from "kafkajs";
export declare class UserController implements IUserController {
    start(): Promise<void>;
    routeMessage(_topics: string[], message: KafkaMessage, topic: string): Promise<void>;
    handleMessage(message: KafkaMessage): Promise<void>;
    handleRollback(message: KafkaMessage): Promise<void>;
    signup(call: grpc.ServerUnaryCall<UserRegisterDTO, UserRegisterResponse>, callback: grpc.sendUnaryData<UserRegisterResponse>): Promise<void>;
    verifyOtp(call: grpc.ServerUnaryCall<VerifyOtpDTO, VerifyOtpResponse>, callback: grpc.sendUnaryData<VerifyOtpResponse>): Promise<void>;
    resendOtp(call: grpc.ServerUnaryCall<ResendOtpDTO, ResendOtpResponse>, callback: grpc.sendUnaryData<ResendOtpResponse>): Promise<void>;
    userLogin(call: grpc.ServerUnaryCall<UserLoginDTO, UserLoginResponse>, callback: grpc.sendUnaryData<UserLoginResponse>): Promise<void>;
    blockUnblock(call: grpc.ServerUnaryCall<BlockUnblockDTO, BlockUnblockResponse>, callback: grpc.sendUnaryData<BlockUnblockResponse>): Promise<void>;
    fetchUserById(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    fetchStudents(_call: grpc.ServerUnaryCall<null, FetchStudentsResponse>, callback: grpc.sendUnaryData<FetchStudentsResponse>): Promise<void>;
    updateUserDetails(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    addToCart(call: grpc.ServerUnaryCall<AddToCartDTO, AddToCartResponse>, callback: grpc.sendUnaryData<AddToCartResponse>): Promise<void>;
    isInCart(call: grpc.ServerUnaryCall<IsInCart, IsInCartResponse>, callback: grpc.sendUnaryData<IsInCartResponse>): Promise<void>;
    courseStatus(call: grpc.ServerUnaryCall<GetCourseStatus, CheckCourseStatusResponse>, callback: grpc.sendUnaryData<CheckCourseStatusResponse>): Promise<void>;
    getCartItems(call: grpc.ServerUnaryCall<GetCartItemsDTO, GetCartItemsResponse>, callback: grpc.sendUnaryData<GetCartItemsResponse>): Promise<void>;
    isBlocked(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    resetPassword(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    sendOtpToEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    resendOtpToEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    VerifyEnteredOTP(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    linkNameToReview(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    linkNameToMessages(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    fetchUsersByIds(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
}
