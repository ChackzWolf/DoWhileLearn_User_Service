import UserModel, {IUser,ITempUser,TempUser} from "../models/User.model";
import { IUserRepository } from "../interfaces/IUserRepository";
import dotenv from "dotenv";

dotenv.config();



class userRepository implements IUserRepository {
    
    
    async findByEmail (email: string): Promise<IUser | null>{
        try {
            const user = await UserModel.findOne({ email }).exec(); //.exec() method ensures that the query returns a promise.
            console.log(user, 'email in userRepository')
            return user;
        } catch (err) {
            console.error(`Error finding user by email: ${err}`);
            return null;
        }
    }
    
    async createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser | null>{
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


    async createUser(userData: Partial<IUser>): Promise<IUser | null>{
        try {
            const { firstName, lastName, email, password } = userData ;
            const createdUser = new UserModel({
                firstName,
                lastName,
                email,
                password,
                // Ensure all fields are set, including defaults
                isblocked: false,
                purchasedCourses: [],
                cart: [],
                wishlist: []
            });
            const savedUser = await createdUser.save();
            return savedUser;
        } catch (err) {
            console.error("Error creating user:", err);
            return null;
        }
    } 

    async blockUnblock(userId:string):Promise<{ success: boolean; message?: string }>  {
        try{
            const user = await UserModel.findById(userId)
            if(!user){
                return {success:false, message: "User not found."}
            }
            await user.toggleBlockStatus();
        
            return {success: true, message: `User ${user.isblocked? 'blocked': "Unblocked"} successfully`};
        }catch (error) {
            console.error('Error toggling user block status:', error);
            return { success: false, message: 'An error occurred' };
        }
    }

    async getAllUsers() {
        try{
            const users = await UserModel.find();
            return  users;
        }catch(err){
            console.error("error getting users: " , err);
            return null
        }
    }


    async toggleCourseInCart(userId: string, courseId: string):Promise<{message?:string, success:boolean, inCart?: boolean}> {
      try {
        // First, check if the course is already in the cart
        const user = await UserModel.findOne({ _id: userId, cart: { $in: [courseId] } });
    
        if (user) {
          // If courseId is already in cart, remove it
          await UserModel.updateOne(
            { _id: userId },
            { $pull: { cart: courseId } } // Remove courseId from cart array
          );
          return { message: 'Course removed from cart', inCart:false, success:true};
        } else {
          // If courseId is not in cart, add it
          await UserModel.updateOne(
            { _id: userId },
            { $addToSet: { cart: courseId } } // Add courseId to cart array, ensuring uniqueness
          );
          return { message: 'Course added to cart', inCart:true, success:true};
        }
      } catch (error) {
        console.error('Error toggling course in cart:', error);
        throw new Error('Failed to update cart');
      }
    }

      async CheckIfInCart(userId: string, courseId: string): Promise<{ inCart: boolean }> {
        try {
          const user = await UserModel.findOne(
            { _id: userId, cart: { $in: [courseId] } },
            { _id: 1 } // Only return _id to minimize data retrieval
          );
          return { inCart: !!user }; // Return true if user is found, false otherwise
        } catch (error) {
          console.error('Error checking if course is in cart:', error);
          throw new Error('Failed to check cart status');
        }
      }

};

export default userRepository