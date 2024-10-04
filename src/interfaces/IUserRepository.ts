import { IUser, ITempUser } from "../models/User.model";
import { Types } from 'mongoose';

interface CartItem {
  courseId: Types.ObjectId;
  quantity: number; 
}


export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser | null>; 
  createUser(userData: Partial<IUser>): Promise<IUser | null>;
  blockUnblock(userId: string): Promise<{ success: boolean; message?: string }>;
  getAllUsers(): Promise<IUser[] | null>;
  toggleCourseInCart(userId: string, courseId: string):Promise<{message?:string, success:boolean, inCart?: boolean}>
  CheckIfInCart(userId: string, courseId: string): Promise<{ inCart: boolean }>
  addToPurchaseList(userId: string, courseId: string):Promise<{message?:string, success:boolean}>
  CourseStatus(userId: string, courseId: string): Promise<{ inCart: boolean, inPurchase:boolean ,inWishlist:boolean }>
  getCartItems(userId: string): Promise<CartItem[] | null> 
} 