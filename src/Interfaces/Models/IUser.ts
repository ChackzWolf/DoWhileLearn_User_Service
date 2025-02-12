import mongoose, { Document,Types } from "mongoose";





export interface IUser extends Document {
    _id:string
    firstName:string;
    lastName:string;
    email: string;
    password: string;
    isblocked: boolean;
    purchasedCourses: mongoose.Types.ObjectId[]; // Array of ObjectId values
    cart:mongoose.Types.ObjectId[]; // Array of ObjectId values
    wishlist:mongoose.Types.ObjectId[]; // Array of ObjectId values
    profilePicture:string,
    phoneNumber:string,
    bio:string,
    userId?:string
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
    _id: Types.ObjectId; // This is the correct type for MongoDB _id
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