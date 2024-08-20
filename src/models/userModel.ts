import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser extends Document {
    firstName:string;
    lastName:string;
    email: string;
    password: string
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

//pre-save password

UserSchema.pre<IUser>('save', async function(next) {
    if(!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;