import mongoose, { Document, Schema,Types } from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser extends Document {
    firstName:string;
    lastName:string;
    email: string;
    password: string
}

export interface ITempUser extends Document {
    userData: IUser;
    otp: string;
    createdAt: Date;
    _id: Types.ObjectId; // This is the correct type for MongoDB _id
}

const UserSchema: Schema <IUser> = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const TempUserShcema: Schema <ITempUser> = new Schema({
    userData: {
        type: Object,
        require: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type:Date,
        default: Date.now,
        expires: 900 // expires after 15 minutes
    }
})

//pre-save password

UserSchema.pre<IUser>('save', async function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})
export const TempUser = mongoose.model<ITempUser>("TempUserData",TempUserShcema)
const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;