// /src/interfaces/IUserRepository.ts

import { IUser, ITempUser, OTPInterface } from '../Models/IUser';
import { 
          CreateUserDTO,
          BlockUnblockResponse, 
          CourseInCartResponse, 
          AddToPurchaseListResponse, 
          CartItem
        } from '../DTOs/IRepository.dto';
import { ObjectId } from 'mongodb';

export interface IUserRepository {
  updateUser( dataToUpdate: Partial<IUser>):Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser | null>;
  createUser(userData: CreateUserDTO): Promise<IUser | null>;
  blockUnblock(userId: string): Promise<BlockUnblockResponse>;
  getAllUsers(): Promise<IUser[] | null>;
  toggleCourseInCart(userId: string, courseId: string): Promise<CourseInCartResponse>;
  CheckIfInCart(userId: string, courseId: string): Promise<{ inCart: boolean }>;
  addToPurchaseList(userId: string, courseId: string): Promise<AddToPurchaseListResponse>;
  CourseStatus(userId: string, courseId: string): Promise<{ inCart: boolean, inPurchase: boolean, inWishlist: boolean }>;
  getCartItems(userId: string): Promise< CartItem[] | null>
  isBlocked(userId: string): Promise<boolean | undefined>
  passwordChange(userId: string, newPassword: string): Promise<{ message: string, success: boolean, status: number }>
  storeOTP(email: string, otp: string): Promise<ObjectId>
  findByUserId(userId: string): Promise<IUser | null>
  removeFromPurchaseList(userId: string, courseId: string): Promise<AddToPurchaseListResponse>
  updateStoredOTP(otpId: string, otp: string):Promise<OTPInterface>
  verifyOTP(email: string, otp: string):Promise<boolean> 
  getNameById(userId: string): Promise<string>
  getUsersByIds(studentIds: string[]): Promise<IUser[]>
  updateProfilePicById(userId:string,profilePic:string):Promise<IUser>
}
