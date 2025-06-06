import { IUser, CartItem } from "../Interfaces/Models/IUser";
import { IUserService } from "../Interfaces/IService/IService.interface";
import { StatusCode } from "../Interfaces/Enums/Enums";
import { UserRegisterDTO, UserRegisterResponse, VerifyOtpDTO, VerifyOtpResponse, ResendOtpDTO, ResendOtpResponse, UserLoginDTO, UserLoginResponse, BlockUnblockDTO, BlockUnblockResponse, FetchStudentsResponse, GoogleAuthenticationRequestDTO, GoogleAuthenticationResponse } from '../Interfaces/DTOs/IService.dto';
import { IUserRepository } from "../Interfaces/IRepositories/IRepository.interface";
import { IEmailService } from "../Interfaces/IUtils/IEmailService";
import { IOTPService } from "../Interfaces/IUtils/IOTPService";
import { ICurrentLesson, IPurchasedCourse } from "../Interfaces/Models/IPurchasedCourse";
import { ICertificateGenerator } from "../Interfaces/IUtils/ICertificateGenerator";
import { ICertification } from "../Interfaces/Models/ICertification";
import { IJWT } from "../Interfaces/IUtils/IJWT";
export interface OrderEventData {
    userId: string;
    tutorId: string;
    courseId: string;
    transactionId: string;
    title: string;
    thumbnail: string;
    price: string;
    adminShare: string;
    tutorShare: string;
    paymentStatus: boolean;
    timestamp: Date;
    status: string;
}
export declare class UserService implements IUserService {
    private userRepository;
    private emailService;
    private otpService;
    private certificateGenerator;
    private jwt;
    constructor(userRepository: IUserRepository, emailService: IEmailService, otpService: IOTPService, certificateGenerator: ICertificateGenerator, jwt: IJWT);
    userRegister(userData: UserRegisterDTO): Promise<UserRegisterResponse>;
    googleAuthentication(data: GoogleAuthenticationRequestDTO): Promise<GoogleAuthenticationResponse>;
    VerifyOtp(passedData: VerifyOtpDTO): Promise<VerifyOtpResponse>;
    ResendOTP(passedData: ResendOtpDTO): Promise<ResendOtpResponse>;
    userLogin(loginData: UserLoginDTO): Promise<UserLoginResponse>;
    getUserById(data: {
        userId: string;
    }): Promise<{
        success: boolean;
        status: StatusCode;
        message: string;
        userData: IUser;
    } | {
        success: boolean;
        status: StatusCode;
        message: string;
        userData?: undefined;
    } | {
        success: boolean;
        message: string;
        status?: undefined;
        userData?: undefined;
    }>;
    blockUnblock(data: BlockUnblockDTO): Promise<BlockUnblockResponse>;
    fetchStudents(): Promise<FetchStudentsResponse>;
    addToCart(data: {
        userId: string;
        courseId: string;
    }): Promise<{
        message?: string;
        success: boolean;
        inCart?: boolean;
    }>;
    isInCart(data: {
        userId: string;
        courseId: string;
    }): Promise<{
        inCart?: boolean;
        success: boolean;
    }>;
    addToPurchaseList(orderData: OrderEventData): Promise<void>;
    deleteFromPurchaseList(orderData: OrderEventData): Promise<void>;
    checkCourseStatus(data: {
        userId: string;
        courseId: string;
    }): Promise<{
        inCart: boolean;
        inPurchase: boolean;
        inWishlist: boolean;
        purchasedCourseStatus: IPurchasedCourse | null;
    }>;
    getCartItems(data: {
        userId: string;
    }): Promise<{
        cart?: CartItem[];
        success: boolean;
    }>;
    checkIsBlocked(data: {
        userId: string;
    }): Promise<{
        isBlocked: boolean | undefined;
    }>;
    resetPassword(data: {
        userId: string;
        password: string;
    }): Promise<{
        message: string;
        success: boolean;
        status: number;
    }>;
    sendEmailOtp(data: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
        status: StatusCode;
        email?: undefined;
        otpId?: undefined;
        userId?: undefined;
    } | {
        message: string;
        success: boolean;
        status: StatusCode;
        email: string;
        otpId: import("bson").ObjectId;
        userId: string;
    }>;
    resendEmailOtp(data: {
        email: string;
        otpId: string;
    }): Promise<{
        success: boolean;
        status: StatusCode;
        message: string;
    }>;
    resetPasswordVerifyOTP(data: {
        email: string;
        enteredOTP: string;
    }): Promise<{
        success: boolean;
        message: string;
        status: StatusCode;
        email: string;
        userId: string;
    } | {
        success: boolean;
        message: string;
        status: StatusCode;
        email: string;
        userId?: undefined;
    }>;
    attachReviewById(data: any): Promise<any[]>;
    updateUserDetails(data: {
        formData: IUser;
    }): Promise<{
        success: boolean;
        status: number;
        message: string;
    }>;
    attachMessageById(data: any): Promise<any[]>;
    fetchUsersByIds(data: {
        studentIds: string[];
    }): Promise<IUser[]>;
    updateCurrentLesson(data: {
        moduleIndex: number;
        lessonIndex: number;
        courseId: string;
        userId: string;
    }): Promise<ICurrentLesson>;
    updateCompletedLesson(data: {
        userId: string;
        courseId: string;
        lessonIndex: number;
        moduleIndex: number;
        totalLessons: number;
        courseName: string;
        tutorName: string;
    }): Promise<{
        data: IPurchasedCourse;
    }>;
    getCertificate(data: {
        userId: string;
        courseId: string;
    }): Promise<{
        success: boolean;
        certificate?: ICertification;
    }>;
}
