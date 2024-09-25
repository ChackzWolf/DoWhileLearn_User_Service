import * as grpc from '@grpc/grpc-js';


export interface BlockUnblockRequest {
    userId: string;
}
export interface BlockUnblockResponse {
    success: boolean;
    message?: string; 
}

export interface IUserController {
  signup(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
  
  verifyOtp(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
  
  resendOtp(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
  
  userLogin(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
  
  blockUnblock(call: grpc.ServerUnaryCall<BlockUnblockRequest,BlockUnblockResponse>, callback: grpc.sendUnaryData<BlockUnblockResponse>): Promise<void>;
  
  fetchStudents(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
}
