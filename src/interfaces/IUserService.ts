import { IUser } from "../models/userModel";

export interface IUserService {
    userRegister(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        tempId?: string;
        email?: string;
    }>;

    userLogin(loginData: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        userData?: IUser;
    }>;

    VerifyOtp(passedData: {
        enteredOTP: string;
        email: string;
        tempId: string;
    }): Promise<{
        success: boolean;
        message: string;
        userData?: IUser
    }>;

    ResendOTP(passedData: {
        email: string;
        tempId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
