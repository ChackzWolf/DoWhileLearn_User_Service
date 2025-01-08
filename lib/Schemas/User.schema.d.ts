import mongoose from "mongoose";
import { IUser, ITempUser } from "../Interfaces/Models/IUser";
export declare const Otp: mongoose.Model<{
    email: string;
    otp: string;
    expiresAt: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    otp: string;
    expiresAt: NativeDate;
}> & {
    email: string;
    otp: string;
    expiresAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    otp: string;
    expiresAt: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    otp: string;
    expiresAt: NativeDate;
}>> & mongoose.FlatRecord<{
    email: string;
    otp: string;
    expiresAt: NativeDate;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
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
