import { IUser, ITempUser, OTPInterface } from "../../Interfaces/Models/IUser";
import { IUserRepository } from "../../Interfaces/IRepositories/IRepository.interface";
import { CreateUserDTO, BlockUnblockResponse, CourseInCartResponse, AddToPurchaseListResponse, CartItem } from '../../Interfaces/DTOs/IRepository.dto';
import { BaseRepository } from "../BaseRepository/Base.repository";
import { ObjectId } from 'mongodb';
import { ICurrentLesson, IPurchasedCourse } from "../../Interfaces/Models/IPurchasedCourse";
import { ICertification } from "../../Interfaces/Models/ICertification";
declare class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor();
    findByUserId(userId: string): Promise<IUser | null>;
    getUsersByIds(studentIds: string[]): Promise<IUser[]>;
    findByEmail(email: string): Promise<IUser | null>;
    createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser | null>;
    updateProfilePicById(userId: string, profilePic: string): Promise<IUser>;
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
        purchasedCourseStatus: IPurchasedCourse | null;
    }>;
    updateCurrentLesson(data: {
        userId: string;
        courseId: string;
        lessonIndex: number;
        moduleIndex: number;
    }): Promise<ICurrentLesson>;
    updateCompletedLesson(data: {
        userId: string;
        courseId: string;
        lessonIndex: number;
        moduleIndex: number;
        totalLessons: number;
    }): Promise<IPurchasedCourse>;
    getCertificate(userId: string, courseId: string): Promise<{
        certificate?: ICertification;
        success: boolean;
    }>;
    addCertification(userId: string, certificationData: {
        courseId: string;
        title: string;
        certificateUrl: string;
    }): Promise<{
        message: string;
        certification: ICertification[];
    }>;
    getCartItems(userId: string): Promise<CartItem[] | null>;
    isBlocked(userId: string): Promise<boolean | undefined>;
    passwordChange(userId: string, newPassword: string): Promise<{
        message: string;
        success: boolean;
        status: number;
    }>;
    storeOTP(email: string, otp: string): Promise<ObjectId>;
    updateStoredOTP(otpId: string, otp: string): Promise<OTPInterface>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
    getNameById(userId: string): Promise<string>;
}
export default UserRepository;
