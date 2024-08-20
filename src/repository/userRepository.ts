import UserModel, {IUser} from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();


interface Login{
    email: string;
    password: string;
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