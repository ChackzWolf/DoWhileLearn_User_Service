import { Types } from 'mongoose';
export interface UserRegisterDTO {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}
export interface UserRegisterResponse {
    success: boolean;
    msg: string;
    tempId?: string;
    email?: string;
}
export interface VerifyOtpDTO {
    email: string;
    tempId: string;
    enteredOTP: string;
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
    success: boolean;
    message: string;
    userData?: any;
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
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
    students?: any[];
}
export interface AddToCartDTO {
    userId: string;
    courseId: string;
}
export interface AddToCartResponse {
    success: boolean;
    message?: string;
    inCart?: boolean;
}
export interface IsInCart {
    userId: string;
    courseId: string;
}
export interface IsInCartResponse {
    inCart?: boolean;
    success: boolean;
}
export interface AddToPurchaseListDTO {
    userId: string;
    courseId: string;
}
export interface AddToPurchaseListResponse {
    message?: string;
    success: boolean;
    status: number;
}
export interface GetCourseStatus {
    userId: string;
    courseId: string;
}
export interface CheckCourseStatusResponse {
    inCart: boolean;
    inPurchase: boolean;
    inWishlist: boolean;
}
export interface GetCartItemsDTO {
    userId: string;
}
export interface GetCartItemsResponse {
    courseIds?: CartItem[];
    success: boolean;
}
export interface CartItem {
    courseId: Types.ObjectId;
    quantity: number;
}
