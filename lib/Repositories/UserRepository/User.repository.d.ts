import { IUser, ITempUser } from "../../Interfaces/Models/IUser";
import { IUserRepository } from "../../Interfaces/IRepositories/IRepository.interface";
import { CreateUserDTO, BlockUnblockResponse, CourseInCartResponse, AddToPurchaseListResponse, CartItem } from '../../Interfaces/DTOs/IRepository.dto';
import { BaseRepository } from "../BaseRepository/Base.repository";
declare class userRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor();
    findByUserId(userId: string): Promise<IUser | null>;
    getUsersByIds(studentIds: string[]): Promise<IUser[]>;
    findByEmail(email: string): Promise<IUser | null>;
    createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser | null>;
    updateUser(dataToUpdate: Partial<IUser>): Promise<IUser>;
    createUser(userData: CreateUserDTO): Promise<IUser | null>;
    blockUnblock(userId: string): Promise<BlockUnblockResponse>;
    getAllUsers(): Promise<IUser[] | null>;
    toggleCourseInCart(userId: string, courseId: string): Promise<CourseInCartResponse>;
    CheckIfInCart(userId: string, courseId: string): Promise<{
        inCart: boolean;
    }>;
    addToPurchaseList(userId: string, courseId: string): Promise<AddToPurchaseListResponse>;
    removeFromPurchaseList(userId: string, courseId: string): Promise<AddToPurchaseListResponse>;
    CourseStatus(userId: string, courseId: string): Promise<{
        inCart: boolean;
        inPurchase: boolean;
        inWishlist: boolean;
    }>;
    getCartItems(userId: string): Promise<CartItem[] | null>;
    isBlocked(userId: string): Promise<boolean | undefined>;
    passwordChange(userId: string, newPassword: string): Promise<{
        message: string;
        success: boolean;
        status: number;
    }>;
    storeOTP(email: string, otp: string): Promise<import("mongoose").Types.ObjectId>;
    updateStoredOTP(otpId: string, otp: string): Promise<import("mongoose").Document<unknown, {}, {
        email: string;
        otp: string;
        expiresAt: NativeDate;
    }> & {
        email: string;
        otp: string;
        expiresAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
    getNameById(userId: string): Promise<string>;
}
export default userRepository;
