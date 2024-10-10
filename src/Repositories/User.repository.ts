import UserModel, { TempUser } from "../Schemas/User.schema";
import { IUser, ITempUser, UserCart } from "../Interfaces/Models/IUser";
import { IUserRepository } from "../Interfaces/IRepositories/IRepository.interface";
import dotenv from "dotenv";
import { 
  CreateUserDTO,
  BlockUnblockResponse, 
  CourseInCartResponse, 
  AddToPurchaseListResponse,  
  CartItem,
} from '../Interfaces/DTOs/IRepository.dto';

dotenv.config();


class userRepository implements IUserRepository {
    
    
   async findByEmail(email: string): Promise<IUser | null> {
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


    async createUser(userData: CreateUserDTO): Promise<IUser | null>{
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

    async blockUnblock(userId:string):Promise<BlockUnblockResponse>  {
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


    async toggleCourseInCart(userId: string, courseId: string):Promise<CourseInCartResponse > {
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

      async addToPurchaseList(userId: string, courseId: string):Promise<AddToPurchaseListResponse> {
        try {
          // First, check if the course is already in the cart  
    
            // If courseId is not in cart, add it
            await UserModel.updateOne(
              { _id: userId },
              { $addToSet: { purchasedCourses: courseId } } // Add courseId to cart array, ensuring uniqueness
            );
            return { message: 'Course added to Purchase List', success:true};
          
        } catch (error) {
          console.error('Error toggling course in cart:', error);
          throw new Error('Failed to update cart');
        }
      }

      async CourseStatus(userId: string, courseId: string): Promise<{ inCart: boolean, inPurchase:boolean ,inWishlist:boolean }> {
        try {
          const cart = await UserModel.findOne(
            { _id: userId, cart: { $in: [courseId] } },
            { _id: 1 } // Only return _id to minimize data retrieval
          );

          const purchaseList = await UserModel.findOne(
            { _id: userId, purchasedCourses: { $in: [courseId] } },
            { _id: 1 } // Only return _id to minimize data retrieval
          );

          const wishlist = await UserModel.findOne(
            { _id: userId, wishlist: { $in: [courseId] } },
            { _id: 1 } // Only return _id to minimize data retrieval
          );

          return {inCart: !!cart, inPurchase: !!purchaseList, inWishlist: !!wishlist}


        } catch (error) {
          console.error('Error checking if course is in cart:', error);
          throw new Error('Failed to check user course status');
        }
      }

      async getCartItems(userId: string): Promise<CartItem[] | null> {
        try {
          const cartItems = await UserModel.findById(userId).select('cart').lean<UserCart>();
          
          if (!cartItems) {
            throw new Error("User not found");
          }
          
          return cartItems.cart || [];
        } catch (error) {
          console.error("Error fetching cart items:", error);
          throw new Error('Failed to retrieve cart items');
        }
      }

      async isBlocked(userId: string): Promise<boolean | undefined> {
        try {
          const user : IUser | null= await UserModel.findById(userId)
          return user?.isblocked
        } catch (error) {
          throw new Error("User not found");
        }
      }
};

export default userRepository 