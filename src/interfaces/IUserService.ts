
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
        msg: string;
        token?: string;
    }>;

    VerifyOtp(passedData: {
        enteredOTP: string;
        email: string;
        tempId: string;
    }): Promise<{
        success: boolean;
        message: string;
        token?: string;
    }>;

    ResendOTP(passedData: {
        email: string;
        tempId: string;
    }): Promise<{
        success: boolean;
        msg: string;
    }>;
}
