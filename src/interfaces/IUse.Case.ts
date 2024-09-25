import { IUser } from "../models/User.model";

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

  VerifyOtp(passedData: {
    enteredOTP: string;
    email: string;
    tempId: string;
  }): Promise<{
    success: boolean;
    message: string;
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
  }>;

  ResendOTP(passedData: {
    email: string;
    tempId: string;
  }): Promise<{ success: boolean; message: string }>;

  userLogin(loginData: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string; userData?: IUser }>;

  blockUnblock(data: {
    userId: string;
  }): Promise<{ success: boolean; message?: string }>;

  fetchStudents(): Promise<{ success: boolean; students?: IUser[] }>;
}
