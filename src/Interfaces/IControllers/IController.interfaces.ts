import * as grpc from '@grpc/grpc-js';

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
} from "../DTOs/IController.dto";
import { KafkaMessage } from "kafkajs";

export interface IUserController {  

  // start(): Promise<void>

  handleMessage(message: KafkaMessage): Promise<void>
  
  signup(call: grpc.ServerUnaryCall<UserRegisterDTO, UserRegisterResponse>, callback: grpc.sendUnaryData<UserRegisterResponse>): Promise<void>;
  
  verifyOtp(call: grpc.ServerUnaryCall<VerifyOtpDTO, VerifyOtpResponse>, callback: grpc.sendUnaryData<VerifyOtpResponse>): Promise<void>;
  
  resendOtp(call: grpc.ServerUnaryCall<ResendOtpDTO, ResendOtpResponse>, callback: grpc.sendUnaryData<ResendOtpResponse>): Promise<void>;
  
  userLogin(call: grpc.ServerUnaryCall<UserLoginDTO, UserLoginResponse>, callback: grpc.sendUnaryData<UserLoginResponse>): Promise<void>;
  
  blockUnblock(call: grpc.ServerUnaryCall<BlockUnblockDTO,BlockUnblockResponse>, callback: grpc.sendUnaryData<BlockUnblockResponse>): Promise<void>;
  
  fetchStudents(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<FetchStudentsResponse>): Promise<void>;

  addToCart(call:grpc.ServerUnaryCall<AddToCartDTO, AddToCartResponse>, callback:grpc.sendUnaryData<AddToCartResponse>):Promise<void>

  isInCart(call:grpc.ServerUnaryCall<IsInCart, IsInCartResponse>, callback:grpc.sendUnaryData<IsInCartResponse>):Promise<void>
  
  courseStatus(call:grpc.ServerUnaryCall<GetCourseStatus, CheckCourseStatusResponse>, callback:grpc.sendUnaryData<CheckCourseStatusResponse>):Promise<void>

  getCartItems(call:grpc.ServerUnaryCall<GetCartItemsDTO, GetCartItemsResponse>, callback:grpc.sendUnaryData<GetCartItemsResponse>):Promise<void>
}
