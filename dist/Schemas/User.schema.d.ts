import mongoose from "mongoose";
import { IUser, ITempUser, OTPInterface } from "../Interfaces/Models/IUser";
export declare const Otp: mongoose.Model<OTPInterface, {}, {}, {}, mongoose.Document<unknown, {}, OTPInterface> & OTPInterface & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const TempUser: mongoose.Model<ITempUser, {}, {}, {}, mongoose.Document<unknown, {}, ITempUser> & ITempUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
declare const UserModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default UserModel;
