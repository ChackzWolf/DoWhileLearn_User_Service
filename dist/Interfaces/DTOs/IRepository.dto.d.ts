import { Types, Document } from 'mongoose';
export interface CreateUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    photoUrl?: string;
}
export interface BlockUnblockResponse {
    success: boolean;
    message: string;
}
export interface CourseInCartResponse {
    message: string;
    success: boolean;
    inCart: boolean;
}
export interface AddToPurchaseListResponse {
    success: boolean;
    message: string;
}
export interface CartItem {
    courseId: Types.ObjectId;
    quantity: number;
}
export interface UserCart extends Document {
    _id: Types.ObjectId;
    cart: CartItem[];
}
