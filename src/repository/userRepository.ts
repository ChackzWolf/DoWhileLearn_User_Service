import UserModel, {IUser,ITempUser,TempUser} from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();



class userRepository {
    
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
            });
            const savedUser = await createdUser.save();
            return savedUser;
        } catch (err) {
            console.error("Error creating user:", err);
            return null;
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

};

export default userRepository