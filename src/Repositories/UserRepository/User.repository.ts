import UserModel, { TempUser,Otp } from "../../Schemas/User.schema";
import { IUser, ITempUser, UserCart } from "../../Interfaces/Models/IUser";
import { IUserRepository } from "../../Interfaces/IRepositories/IRepository.interface";
import { 
  CreateUserDTO,
  BlockUnblockResponse, 
  CourseInCartResponse, 
  AddToPurchaseListResponse,  
  CartItem,
} from '../../Interfaces/DTOs/IRepository.dto';
import { BaseRepository } from "../BaseRepository/Base.repository";
import { ObjectId } from "mongodb";
import { StatusCode } from "../../Interfaces/Enums/Enums";


class userRepository extends BaseRepository<IUser> implements IUserRepository {

  constructor() {
    super(UserModel); // Pass the UserModel to BaseRepository
}
    
   async findByEmail(email: string): Promise<IUser | null> {
        try {
            // const uuser = await UserModel.findOne({ email }).exec(); //.exec() method ensures that the query returns a promise.
            const user = await this.findOne({email})
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
            const savedUser = await this.create({
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
            return savedUser;
        } catch (err) {
            console.error("Error creating user:", err);
            return null;
        }
    } 

    async blockUnblock(userId:string):Promise<BlockUnblockResponse>  {
        try{
            const user = await this.findById(userId)
            if(!user){
                return {success:false, message: "User not found."}
            }
            // await user.toggleBlockStatus();
            user.isblocked = !user.isblocked;
            await user.save()
            return {success: true, message: `User ${user.isblocked? 'blocked': "Unblocked"} successfully`};
        }catch (error) {
            console.error('Error toggling user block status:', error);
            return { success: false, message: 'An error occurred' };
        }
    }

    async getAllUsers() {
        try{
            const users = await this.findAll();
            return  users;
        }catch(err){
            console.error("error getting users: " , err);
            return null
        }
    }


    async toggleCourseInCart(userId: string, courseId: string):Promise<CourseInCartResponse > {
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
                return { message: courseInCart?'Course removed from cart':'Course added to cart', inCart:user.cart.includes(courseObjId), success:true};
            } else {
              console.log('not include incart')
                user.cart.push(courseObjId);
                await user.save()
                console.log(user.cart, 'cart after changes adding')
                return { message: courseInCart?'Course removed from cart':'Course added to cart', inCart:user.cart.includes(courseObjId), success:true};
            }
        } else{
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

      async addToPurchaseList(userId: string, courseId: string):Promise<AddToPurchaseListResponse> {
        try {
            const courseObjectId = new ObjectId(courseId);
            const user = await this.findById(userId);

            if(user){
              if(!user.purchasedCourses.includes(courseObjectId)){
                user.purchasedCourses.push(courseObjectId);
                await user.save();
                return { message: 'Course added to Purchase List', success:true};
              }else{
                return { message: 'Course already in purchase list', success:false};
              }
            }else{
              return { message: 'User not found.', success:false};
            }
          
        } catch (error) {
          console.error('Error toggling course in cart:', error);
          throw new Error('Failed to update cart');
        }
      }

      async CourseStatus(userId: string, courseId: string): Promise<{ inCart: boolean, inPurchase:boolean ,inWishlist:boolean }> {
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

          return {inCart: !!cart, inPurchase: !!purchaseList, inWishlist: !!wishlist}


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
          const user : IUser | null= await UserModel.findById(userId)
          return user?.isblocked
        } catch (error) {
          throw new Error("User not found");
        }
      }

      async passwordChange(userId:string,newPassword:string):Promise<{message:string,success:boolean,status:number}>{
        try{
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

      async storeOTP(email: string, otp: string) {
        try {
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
            
            // Use findOneAndUpdate to either update or create the OTP entry
            const otpEntry = await Otp.findOneAndUpdate(
                { email }, // Find the entry with the same email
                { otp, expiresAt }, // Update the OTP and expiration time
                { new: true, upsert: true } // Options: return the updated document and create if it doesn't exist
            );
    
            console.log(otpEntry, 'otpentry');
        } catch (error: unknown) {
            console.log(error);
        }
    }

      async verifyOTP(email:string, otp:string) {
        const otpEntry = await Otp.findOne({ email, otp, expiresAt: { $gt: new Date() } });
        return otpEntry !== null;
      }

 

};

export default userRepository 