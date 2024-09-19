import { IUser, ITempUser } from "../models/User.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser | null>;
  createUser(userData: Partial<IUser>): Promise<IUser | null>;
  blockUnblock(userId: string): Promise<{ success: boolean; message?: string }>;
  getAllUsers(): Promise<IUser[] | null>;
}