import { IUser } from "../Models/IUser";
export interface UserRegisterDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export interface UserRegisterResponse {
    success: boolean;
    message: string;
    tempId?: string;
    email?: string;
}
export interface VerifyOtpDTO {
    enteredOTP: string;
    email: string;
    tempId: string;
}
export interface VerifyOtpResponse {
    success: boolean;
    message: string;
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
}
export interface ResendOtpDTO {
    email: string;
    tempId: string;
}
export interface ResendOtpResponse {
    success: boolean;
    message: string;
}
export interface UserLoginDTO {
    email: string;
    password: string;
}
export interface UserLoginResponse {
    userId?: string;
    refreshToken?: string;
    accessToken?: string;
    success: boolean;
    message: string;
    userData?: IUser;
}
export interface BlockUnblockDTO {
    userId: string;
}
export interface BlockUnblockResponse {
    success: boolean;
    message?: string;
}
export interface FetchStudentsResponse {
    success: boolean;
    students?: IUser[];
}
