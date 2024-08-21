import UserModel, {IUser,ITempUser,TempUser} from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();


// interface Login{
//     email: string;
//     password: string;
// }


interface iTempuser{
    _id:string,
    userData:Object,
    otp:string,
    createdAt:Date
}

const userRepository = {
    findByEmail: async (email: string): Promise<IUser | null> => {
        try {
            const user = await UserModel.findOne({ email }).exec(); //.exec() method ensures that the query returns a promise.
            return user;
        } catch (err) {
            console.error(`Error finding user by email: ${err}`);
            return null;
        }
    },
    
    createTempUser: async (tempUserData: Partial<ITempUser>): Promise<ITempUser | null> => {
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
    },


    createUser: async (userData: Partial<IUser>): Promise<IUser | null> => {
        try {
            const { firstName, lastName, email, password } = userData;
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
};

export default userRepository