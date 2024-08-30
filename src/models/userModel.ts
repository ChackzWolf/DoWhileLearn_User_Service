import mongoose, { Document, Schema,Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export interface IUser extends Document {
    firstName:string;
    lastName:string;
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
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
}
,
{
    timestamps: true,
})

// Hash password
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password || "", 10);
    next();
});

// sign access token
UserSchema.methods.SignAccessToken = function () {
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.ACCESS_TOKEN || "",
      {
        expiresIn: "5m",
      }
    );
  };



// sign refresh token
UserSchema.methods.SignRefreshToken = function () {
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.REFRESH_TOKEN || "",
      {
        expiresIn: "3d",
      }
    );
};

// compare password
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};



export const TempUser = mongoose.model<ITempUser>("TempUserData",TempUserShcema)
const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel; 