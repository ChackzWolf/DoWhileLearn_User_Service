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
import { ICurrentLesson, IPurchasedCourse } from "../../Interfaces/Models/IPurchasedCourse";


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
            console.log('User data while adding:', user);
    
            if (!user) {
                console.log('User not found while adding purchase list');
                return { message: 'User not found.', success: false };
            }
    
            // Check if the user already purchased the course
            const courseExists = user.purchasedCourses.some(course => course.courseId.equals(courseObjectId));
    
            if (!courseExists) {
                user.purchasedCourses.push({
                    courseId: courseObjectId,
                    progress: 0,
                    currentLesson: { module: 0, lesson: 0 },
                    completedLessons: [],
                    completed: false,
                    lastAccessed: new Date()
                });
    
                await user.save();
                return { message: 'Course added to Purchase List', success: true };
            } else {
                return { message: 'Course already in purchase list', success: true };
            }
        } catch (error) {
            console.error('Error adding course to purchase list:', error);
            throw new Error('Failed to update purchase list');
        }
    }
    
    async removeFromPurchaseList(userId: string, courseId: string): Promise<AddToPurchaseListResponse> {
        try {
            const courseObjectId = new ObjectId(courseId);
            console.log(userId, 'userId');
    
            const user = await this.findById(userId);
            console.log(user, 'user');
    
            if (!user) {
                console.log('User not found');
                return { message: 'User not found.', success: false };
            }
    
            // Find the index of the course in purchasedCourses
            const courseIndex = user.purchasedCourses.findIndex((course) => course.courseId.equals(courseObjectId));
    
            if (courseIndex === -1) {
                console.log('Course not found in purchase list.');
                return { message: 'Course not found in purchase list.', success: false };
            }
    
            // Remove the course from purchasedCourses
            console.log('Course found. Removing course.');
            user.purchasedCourses.splice(courseIndex, 1);
            await user.save();
    
            return { message: 'Course removed from Purchase List', success: true };
    
        } catch (error) {
            console.error('Error removing course from purchase list:', error);
            throw new Error('Failed to update purchase list');
        }
    }
    

    async CourseStatus(userId: string, courseId: string): Promise<{ inCart: boolean, inPurchase: boolean, inWishlist: boolean, purchasedCourseStatus:IPurchasedCourse | null }> {
        try {
            const courseObjectId = new ObjectId(courseId);
            const user = await this.findById(userId);
    
            if (!user) {
                throw new Error('User not found');
            }
    
            console.log(user.cart, "user cart");
            console.log(courseId, 'course Id');
    
            // Check if course is in cart
            const inCart = user.cart.includes(courseObjectId);
            console.log(inCart, 'cart status');
            console.log(user.purchasedCourses, 'purchasedCourses');
            // ✅ Check if course is in purchasedCourses by searching for courseId inside objects
            let inPurchase = false
            let  purchasedCourseStatus = null
            if(user.purchasedCourses.length > 0){
                purchasedCourseStatus = user.purchasedCourses.find(course => course.courseId.equals(courseObjectId)) || null;
                inPurchase = !!purchasedCourseStatus;
            }
    
            // Check if course is in wishlist
            const inWishlist = user.wishlist.includes(courseObjectId);
            console.log(purchasedCourseStatus,'/////////////////////////////// purchased course status')
            return { inCart, inPurchase, inWishlist, purchasedCourseStatus };
    
        } catch (error) {
            console.error('Error checking if course is in cart:', error);
            throw new Error('Failed to check user course status');
        }
    }

    async updateCurrentLesson(data: {userId:string, courseId:string, lessonIndex: number, moduleIndex: number}):Promise<ICurrentLesson>{
        try {
            const {userId, courseId, lessonIndex, moduleIndex} = data;
            const user = await this.findById(userId);  
            if (!user) throw new Error('User not found');
            const purchasedCourse = user.purchasedCourses.find(course => course.courseId.equals(new ObjectId(courseId)))
            if (!purchasedCourse) throw new Error('Course not found in purchasedCourses');
            purchasedCourse.currentLesson = { module: moduleIndex, lesson: lessonIndex };
            await user.save();
            const currentLesson = purchasedCourse.currentLesson
            return currentLesson
        } catch (error) {
            console.log(error)
            throw new Error("error updating current lesson")
        }
    }

    async updateCompletedLesson(data: {userId:string, courseId:string, lessonIndex:number, moduleIndex: number, totalLessons:number}):Promise<IPurchasedCourse>{
        try {
            const {userId, courseId, lessonIndex, moduleIndex, totalLessons} = data;
            const user = await this.findById(userId);
            if (!user) throw new Error('User not found');
            const purchasedCourse = user.purchasedCourses.find(course => course.courseId.equals(new ObjectId(courseId)));
            if (!purchasedCourse) throw new Error('Course not found in purchasedCourses');
            const isLessonCompleted = purchasedCourse.completedLessons.some(lesson =>
                lesson.module === moduleIndex && lesson.lesson === lessonIndex
            );
            if (!isLessonCompleted) {
                // Push new completed lesson
                purchasedCourse.completedLessons.push({
                    module: moduleIndex,
                    lesson: lessonIndex,
                    noTest:false,
                    testCompleted: false, 
                });
                
                purchasedCourse.completed = purchasedCourse.completedLessons.length >= totalLessons
                // Save the user document
                await user.save();
                console.log(`Lesson ${lessonIndex} in module ${moduleIndex} marked as completed.`);
                return purchasedCourse
            } else {
                console.log(`Lesson ${lessonIndex} in module ${moduleIndex} is already marked as completed.`);
                return purchasedCourse
            }

        } catch (error) {
            console.log(error)
            throw new Error("error updating current lesson")
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