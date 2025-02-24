import mongoose, { Document, Types } from "mongoose";
import { ICertification } from "./ICertification";
import { IBadge } from "./IBadge";
import { ISocialLinks } from "./ISocialLinks";
import { IPurchasedCourse } from "./IPurchasedCourse";
export interface IUser extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isblocked: boolean;
    purchasedCourses: IPurchasedCourse[];
    cart: mongoose.Types.ObjectId[];
    wishlist: mongoose.Types.ObjectId[];
    profilePicture: string;
    phoneNumber: string;
    bio: string;
    userId?: string;
    isVerified: boolean;
    certifications: ICertification[];
    badges: IBadge[];
    socialLinks: ISocialLinks;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
    block(): Promise<void>;
    unblock(): Promise<void>;
    toggleBlockStatus(): Promise<void>;
}
export interface ITempUser extends Document {
    userData: IUser;
    otp: string;
    createdAt: Date;
    _id: Types.ObjectId;
}
export interface CartItem {
    courseId: Types.ObjectId;
    quantity: number;
}
export interface UserCart extends Document {
    _id: Types.ObjectId;
    cart: CartItem[];
}
export interface OTPInterface extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
}
