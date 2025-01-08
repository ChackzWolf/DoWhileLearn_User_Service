import { IUser, ITempUser } from '../Models/IUser';
import { CreateUserDTO, BlockUnblockResponse, CourseInCartResponse, AddToPurchaseListResponse, CartItem } from '../DTOs/IRepository.dto';
export interface IUserRepository {
    updateUser(dataToUpdate: Partial<IUser>): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser | null>;
    createUser(userData: CreateUserDTO): Promise<IUser | null>;
    blockUnblock(userId: string): Promise<BlockUnblockResponse>;
    getAllUsers(): Promise<IUser[] | null>;
    toggleCourseInCart(userId: string, courseId: string): Promise<CourseInCartResponse>;
    CheckIfInCart(userId: string, courseId: string): Promise<{
        inCart: boolean;
    }>;
    addToPurchaseList(userId: string, courseId: string): Promise<AddToPurchaseListResponse>;
    CourseStatus(userId: string, courseId: string): Promise<{
        inCart: boolean;
        inPurchase: boolean;
        inWishlist: boolean;
    }>;
    getCartItems(userId: string): Promise<CartItem[] | null>;
}
