import { UserRegisterDTO, UserRegisterResponse, VerifyOtpDTO, VerifyOtpResponse, ResendOtpDTO, ResendOtpResponse, UserLoginDTO, UserLoginResponse, BlockUnblockDTO, BlockUnblockResponse, FetchStudentsResponse, GoogleAuthenticationRequestDTO, GoogleAuthenticationResponse } from '../DTOs/IService.dto';
import { ICertification } from '../Models/ICertification';
import { ICurrentLesson, IPurchasedCourse } from '../Models/IPurchasedCourse';
export interface IUserService {
    userRegister(userData: UserRegisterDTO): Promise<UserRegisterResponse>;
    googleAuthentication(data: GoogleAuthenticationRequestDTO): Promise<GoogleAuthenticationResponse>;
    VerifyOtp(passedData: VerifyOtpDTO): Promise<VerifyOtpResponse>;
    ResendOTP(passedData: ResendOtpDTO): Promise<ResendOtpResponse>;
    userLogin(loginData: UserLoginDTO): Promise<UserLoginResponse>;
    blockUnblock(data: BlockUnblockDTO): Promise<BlockUnblockResponse>;
    fetchStudents(): Promise<FetchStudentsResponse>;
    checkCourseStatus(data: {
        userId: string;
        courseId: string;
    }): Promise<{
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
