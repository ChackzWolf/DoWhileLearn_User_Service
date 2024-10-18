import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, ITempUser } from "../Interfaces/Models/IUser";
import { configs } from "../Configs/ENV_configs/ENV.configs";





// Create the schema
const UserSchema: Schema<IUser> = new Schema({
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
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isblocked: {
        type: Boolean,
        default: false
    },
    purchasedCourses: [{
        type: Schema.Types.ObjectId,
    }],
    cart:[{
        type: Schema.Types.ObjectId,
    }],
    wishlist:[{
        type: Schema.Types.ObjectId,
    }]

}, {
    timestamps: true
}); 




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


const otpSchema = new Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
  });






UserSchema.methods.toggleBlockStatus = async function (): Promise<void> {
    this.isblocked = !this.isblocked; // Toggle the blocked status
    await this.save(); // Save the updated document
};

UserSchema.methods.unblock = async function (): Promise<void> {
    this.isblocked = false;
    await this.save();
};

UserSchema.methods.block = async function (): Promise<void> {
    this.isblocked = true;
    await this.save();
};

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
      configs.JWT_SECRET,
      {
        expiresIn: configs.JWT_EXPIRATION_TIME,
      }
    );
  };

// sign refresh token
UserSchema.methods.SignRefreshToken = function () {
    return jwt.sign( 
      { id: this._id, role: this.role },
      configs.REFRESH_TOKEN_SECRET,
      {
        expiresIn: configs.REFRESH_TOKEN_EXPIRATION_TIME,
      }
    );
};

// compare password 
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const Otp = mongoose.model("setOTP",otpSchema)
export const TempUser = mongoose.model<ITempUser>("TempUserData",TempUserShcema)
const UserModel = mongoose.model<IUser>("User", UserSchema);


export default UserModel; 