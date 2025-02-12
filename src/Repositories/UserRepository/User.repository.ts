import UserModel, { TempUser, Otp } from "../../Schemas/User.schema";
import { IUser, ITempUser, UserCart, OTPInterface } from "../../Interfaces/Models/IUser";
import { IUserRepository } from "../../Interfaces/IRepositories/IRepository.interface";
import {
    CreateUserDTO,
    BlockUnblockResponse,
    CourseInCartResponse,
    AddToPurchaseListResponse,
    CartItem,
} from '../../Interfaces/DTOs/IRepository.dto';
import { BaseRepository } from "../BaseRepository/Base.repository";
// import { ObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { StatusCode } from "../../Interfaces/Enums/Enums";


class UserRepository extends BaseRepository<IUser> implements IUserRepository {

    constructor() {
        super(UserModel);
    }

    async findByUserId(userId: string): Promise<IUser | null> {
        try {
            const user: IUser | null = await this.findById(userId);

            if (!user) {
                console.error(`User not found with id: ${userId}`);
                return null;
            }

            return user;
        } catch (error) {
            console.error(`Error finding user by id: ${error}`);
            return null;
        }
    }

    async getUsersByIds(studentIds: string[]): Promise<IUser[]> {
        try {
            return await UserModel.find({ _id: { $in: studentIds } }); // Assuming `User` is your Mongoose model
        }   catch (error:any) {
            console.error('Error in getUsersByIds:', error.message);
            throw new Error('Failed to fetch users by IDs');
        }
    }

    async findByEmail(email: string): Promise<IUser | null> {
        try {
            // const uuser = await UserModel.findOne({ email }).exec(); //.exec() method ensures that the query returns a promise.
            const user = await this.findOne({ email })
            return user;
        } catch (err) {
            console.error(`Error finding user by email: ${err}`);
            return null;
        }
    }

    async createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser | null> {
        try {
            const { userData, otp, createdAt } = tempUserData;

            const createdTempData = new TempUser({
                userData,
                otp,
                createdAt: createdAt || new Date()
            });
            const savedUser = await createdTempData.save();
            return savedUser;
        } catch (err) {
            console.error("Error creating temporary user data", err);
            return null;
        }
    }

    async updateProfilePicById(userId:string,profilePic:string):Promise<IUser>{
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(userId,{$set:{profilePicture:profilePic}},{ new: true, runValidators: true });
            if(!updatedUser){
                throw new Error('user not found');
            }
            console.log(updatedUser, 'this is updated user from repo')
            return updatedUser;
        } catch (error) {
            console.error("Error updating tutor:", error);
            throw error;
        }
    }

    async updateUser( dataToUpdate: Partial<IUser>):Promise<IUser> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                dataToUpdate._id,
                {
                    $set: {
                        firstName: dataToUpdate.firstName,
                        lastName: dataToUpdate.lastName,
                        email: dataToUpdate.email,
                        phoneNumber: dataToUpdate.phoneNumber,
                        bio: dataToUpdate.bio,
                        profilePicture: dataToUpdate.profilePicture,
                    },
                },
                { new: true, runValidators: true } // Returns updated document & applies schema validations
            );
    
            if (!updatedUser) {
                throw new Error('user not found');
            }
    
            return updatedUser;
        } catch (error) {
            console.error("Error updating tutor:", error);
            throw error;
        }
    }


    async createUser(userData: CreateUserDTO): Promise<IUser | null> {
        try {
            const { firstName, lastName, email, password } = userData;
            const savedUser = await this.create({
                firstName,
                lastName,
                email,
                password,
                //defaults
                profilePicture: userData.photoUrl || "",
                phoneNumber:'',
                bio:"",
                isblocked: false,
                purchasedCourses: [],
                cart: [],
                wishlist: []
            });
            return savedUser;
        } catch (err) {
            console.error("Error creating user:", err);
            return null;
        }
    }

    async blockUnblock(userId: string): Promise<BlockUnblockResponse> {
        try {
            const user = await this.findById(userId)
            if (!user) {
                return { success: false, message: "User not found." }
            }
            // await user.toggleBlockStatus();
            user.isblocked = !user.isblocked;
            await user.save()
            return { success: true, message: `User ${user.isblocked ? 'blocked' : "Unblocked"} successfully` };
        } catch (error) {
            console.error('Error toggling user block status:', error);
            return { success: false, message: 'An error occurred' };
        }
    }

    async getAllUsers() {
        try {
            const users = await this.findAll();
            return users;
        } catch (err) {
            console.error("error getting users: ", err);
            return null
        }
    }


    async toggleCourseInCart(userId: string, courseId: string): Promise<CourseInCartResponse> {
        try {
            const user = await this.findById(userId);

            // First, check if the course is already in the cart
            // const user = await UserModel.findOne({ _id: userId, cart: { $in: [courseId] } });

            if (user) {
                const courseObjId = new ObjectId(courseId)
                const courseInCart = user.cart.includes(courseObjId);
                console.log(user.cart, ': user cart')
                console.log(courseId, ": course id")
                if (courseInCart) {
                    console.log('includes in cart')
                    user.cart = user.cart.filter(id => !id.equals(courseObjId));
                    console.log(user.cart, 'cart after changes removing')
                    await user.save()
                    return { message: courseInCart ? 'Course removed from cart' : 'Course added to cart', inCart: user.cart.includes(courseObjId), success: true };
                } else {
                    console.log('not include incart')
                    user.cart.push(courseObjId);
                    await user.save()
                    console.log(user.cart, 'cart after changes adding')
                    return { message: courseInCart ? 'Course removed from cart' : 'Course added to cart', inCart: user.cart.includes(courseObjId), success: true };
                }
            } else {
                throw new Error('Failed to find user');
            }
        } catch (error) {
            console.error('Error toggling course in cart:', error);
            throw new Error('Failed to update cart');
        }
    }

    async CheckIfInCart(userId: string, courseId: string): Promise<{ inCart: boolean }> {
        try {

            console.log('trigg');
            const user = await this.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            console.log(user.cart, 'user cart')
            const courseObjectId = new ObjectId(courseId)

            return { inCart: user.cart.includes(courseObjectId) }; // Return true if user is found, false otherwise
        } catch (error) {
            console.error('Error checking if course is in cart:', error);
            throw new Error('Failed to check cart status');
        }
    }

    async addToPurchaseList(userId: string, courseId: string): Promise<AddToPurchaseListResponse> {
        try {
            const courseObjectId = new ObjectId(courseId);
            const user = await this.findById(userId);
            console.log('user', user, 'userdata while adding')
            if (user) {
                console.log('user found while adding.')
                if (!user.purchasedCourses.includes(courseObjectId)) {
                    user.purchasedCourses.push(courseObjectId);
                    await user.save();
                    return { message: 'Course added to Purchase List', success: true };
                } else {
                    return { message: 'Course already in purchase list', success: true };
                }
            } else {
                console.log('user no tofund while adding purchase list')
                return { message: 'User not found.', success: false };
            }

        } catch (error) {
            console.error('Error toggling course in cart:', error);
            throw new Error('Failed to update cart');
        }
    }
    async removeFromPurchaseList(userId: string, courseId: string): Promise<AddToPurchaseListResponse> {
        try {

            const courseObjectId = new ObjectId(courseId);
            console.log(userId, 'userId');
            const user = await this.findById(userId);
            console.log(user, 'user')
            if (user) {
                console.log('User found:', user);
                const courseIndex = user.purchasedCourses.findIndex((course) => course.equals(courseObjectId));
                if (courseIndex === -1) {
                    // Course not in list, so add it
                    console.log('Purchased course is empty.');

                    return { message: 'Purchased course is empty.', success: false };
                } else {
                    // Course is in the list, so remove it
                    console.log('Course already in user purchase list. Removing course.');
                    user.purchasedCourses.splice(courseIndex, 1);
                    await user.save();
                    return { message: 'Course removed from Purchase List', success: true };
                }
            } else {
                console.log('user not found')
                return { message: 'User not found.', success: false };
            }
        } catch (error) {
            console.error('Error updating purchase list:', error);
            throw new Error('Failed to update purchase list');
        }
    }

    async CourseStatus(userId: string, courseId: string): Promise<{ inCart: boolean, inPurchase: boolean, inWishlist: boolean }> {
        try {
            const courseObjectId = new ObjectId(courseId);
            const user = await this.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            console.log(user.cart, "user cart");
            console.log(courseId, 'course Id')
            const cart = user.cart.includes(courseObjectId)
            console.log(cart, 'cart status')
            const purchaseList = user.purchasedCourses.includes(courseObjectId);

            const wishlist = user.wishlist.includes(courseObjectId);

            return { inCart: !!cart, inPurchase: !!purchaseList, inWishlist: !!wishlist }


        } catch (error) {
            console.error('Error checking if course is in cart:', error);
            throw new Error('Failed to check user course status');
        }
    }

    async getCartItems(userId: string): Promise<CartItem[] | null> {
        try {
            const user = await this.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const cartItems = await UserModel.findById(userId).select('cart').lean<UserCart>();
            console.log(user.cart, "user cart")

            if (!cartItems) {
                throw new Error("User not found");
            }
            console.log(cartItems.cart, 'cart items')
            return cartItems.cart || [];
        } catch (error) {
            console.error("Error fetching cart items:", error);
            throw new Error('Failed to retrieve cart items');
        }
    }

    async isBlocked(userId: string): Promise<boolean | undefined> {
        try {
            const user: IUser | null = await UserModel.findById(userId)
            return user?.isblocked
        } catch (error) {
            throw new Error("User not found");
        }
    }

    async passwordChange(userId: string, newPassword: string): Promise<{ message: string, success: boolean, status: number }> {
        try {
            const user: IUser | null = await this.findById(userId);
            if (!user) {
                return { message: 'User not found!', success: false, status: StatusCode.NotFound };
            }
            // Ensure password is hashed before saving (if necessary)
            user.password = newPassword
            await user.save(); // Save the updated user with the new password
            return { message: 'Password updated successfully!', success: true, status: StatusCode.OK };
        } catch (error) {
            throw new Error("User not found");
        }
    }

    async storeOTP(email: string, otp: string): Promise<ObjectId> {
        try {
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

            // Use findOneAndUpdate to either update or create the OTP entry
            const otpEntry = await Otp.findOneAndUpdate(
                { email }, // Find the entry with the same email
                { otp, expiresAt }, // Update the OTP and expiration time
                { new: true, upsert: true } // Options: return the updated document and create if it doesn't exist
            );

            console.log(otpEntry, 'otpentry');
            return otpEntry._id as ObjectId;
        } catch (error: unknown) {
            throw new Error("User not found");
        }
    }

    async updateStoredOTP(otpId: string, otp: string):Promise<OTPInterface> {
        try {
            const otpEntry = await Otp.findOneAndUpdate(
                { _id: otpId }, // Find by otpId
                { otp }, // Update the OTP and expiration time
                { new: true, upsert: true } // Return updated doc, create if not exists
            );

            if (!otpEntry) {
                throw new Error('Failed to update or create OTP entry.');
            }

            return otpEntry;
        } catch (error) {
            console.error('Error updating OTP entry:', error);
            throw error; // Optionally rethrow the error for higher-level handling
        }
    }


    async verifyOTP(email: string, otp: string):Promise<boolean> {
        const otpEntry = await Otp.findOne({ email, otp, expiresAt: { $gt: new Date() } });
        return otpEntry !== null;
    }

    async getNameById(userId: string): Promise<string> {
        try {
            const user = await this.findById(userId);
            if (!user) {
                console.log(`User not found with ID: ${userId}`);
                return "Unknown User";
            }

            const name = `${user.firstName} ${user.lastName}`;
            console.log(name, 'retrieved user name');
            return name;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return "Unknown User";
        }
    }

};

export default UserRepository 