// IController.dto.ts
import { Types } from 'mongoose';
// User Registration DTO
export interface UserRegisterDTO {
    email: string;
    firstName :string;
    lastName: string;
    password: string;
}



// User Registration Response DTO
export interface UserRegisterResponse {
    success: boolean;
    msg: string;
    tempId?: string;
    email?: string;
}

// Verify OTP DTO
export interface VerifyOtpDTO {
    email: string;
    tempId: string;
    enteredOTP: string;
}

// Verify OTP Response DTO
export interface VerifyOtpResponse {
    success: boolean;
    message: string;
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
}

// Resend OTP DTO
export interface ResendOtpDTO {
    email: string;
    tempId: string;
}

// Resend OTP Response DTO
export interface ResendOtpResponse {
    success: boolean;
    message: string;
}

// User Login DTO
export interface UserLoginDTO {
    email: string;
    password: string;
}

// User Login Response DTO
export interface UserLoginResponse {
    success: boolean;
    message: string;
    userData?: any; // Specify user data structure if available
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
}

// Block/Unblock DTO
export interface BlockUnblockDTO {
    userId: string;
}

// Block/Unblock Response DTO
export interface BlockUnblockResponse {
    success: boolean;
    message?: string;
}

// Fetch Students Response DTO
export interface FetchStudentsResponse {
    success: boolean;
    students?: any[]; // Specify student structure if available
}

// Add to Cart DTO
export interface AddToCartDTO {
    userId: string;
    courseId: string;
}

// Add to Cart Response DTO
export interface AddToCartResponse {
    success: boolean;
    message?: string;
    inCart?: boolean;
}

export interface IsInCart {
    userId: string;
    courseId: string;
}

// Check If In Cart Response DTO
export interface IsInCartResponse {
    inCart?: boolean;
    success: boolean;
}

// Add to Purchase List DTO
export interface AddToPurchaseListDTO {
    userId: string;
    courseId: string;
}

// Add to Purchase List Response DTO
export interface AddToPurchaseListResponse {
    message?: string;
    success: boolean;
    status: number; // Use appropriate status code type
}

export interface GetCourseStatus {
    userId: string;
    courseId: string;
}

// Check Course Status Response DTO
export interface CheckCourseStatusResponse {
    inCart: boolean;
    inPurchase: boolean;
    inWishlist: boolean;
}

// Get Cart Items DTO
export interface GetCartItemsDTO {
    userId: string;
}

// Get Cart Items Response DTO
export interface GetCartItemsResponse {
    courseIds?: CartItem[];
    success: boolean;
}

// Cart Item Interface
export interface CartItem {
    courseId: Types.ObjectId;
    quantity: number; // Specify quantity structure if available
}
