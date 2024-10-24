import userRepository from "../Repositories/UserRepository/User.repository";
import  { TempUser } from "../Schemas/User.schema";
import { IUser, ITempUser, CartItem } from "../Interfaces/Models/IUser";
import dotenv from "dotenv"
import { generateOTP } from "../Utils/Generate.OTP";
import { SendVerificationMail } from "../Utils/Send.email";
import { IUserService } from "../Interfaces/IService/IService.interface";
import createToken from "../Utils/Activation.token";
import { StatusCode } from "../Interfaces/Enums/Enums";
import { 
    UserRegisterDTO, 
    UserRegisterResponse, 
    VerifyOtpDTO, 
    VerifyOtpResponse, 
    ResendOtpDTO, 
    ResendOtpResponse, 
    UserLoginDTO, 
    UserLoginResponse, 
    BlockUnblockDTO, 
    BlockUnblockResponse,
    FetchStudentsResponse
  } from '../Interfaces/DTOs/IService.dto';

dotenv.config();



const repository = new userRepository()

 

export class UserService implements IUserService{
    
    async userRegister(userData: UserRegisterDTO): Promise<UserRegisterResponse> {
        try{
            console.log(`userService ${userData}`)
            const email = userData.email;
            if(email === undefined){
                throw new Error("Email is undefined");
            } 
            const emailExists = await repository.findByEmail(email);
            
            if(emailExists){
                console.log('email exists triggered')
                return {success: false, message: "Email already exists" };
            }

            let otp = generateOTP();
            console.log(`OTP : [ ${otp} ]`);
            await SendVerificationMail(email,otp)

            console.log('Email send')

            const tempUserData: ITempUser | null = await repository.createTempUser({
                otp,
                userData: userData as IUser, 
            });    

            if (tempUserData) {  
                const tempId = tempUserData._id.toString(); // Convert ObjectId to string if needed
                return { success: true, message: "Verification email sent", tempId, email};
            } else {
                throw new Error("Failed to create temporary user data.");
            }
 

        }catch(err){
            throw new Error(`Failed to signup: ${err}`);
        } 
    } 

    async VerifyOtp(passedData: VerifyOtpDTO): Promise<VerifyOtpResponse> {
        try { 
            const { tempId, enteredOTP } = passedData;
            const tempUser: ITempUser | null = await TempUser.findById(tempId);
            
            if (!tempUser) {
                return { success: false, message: "Temp user not found. { Internal error }" };
            }
    
            if (tempUser.otp !== enteredOTP) {
                return { success: false, message: "You have entered invalid OTP." };
            }
            
            const createdUser: IUser | null = await repository.createUser(tempUser.userData);
            
            if (!createdUser) {
                throw new Error("Failed to create user.");
            }
            const userId: string = createdUser._id.toString();

            const { accessToken, refreshToken } = createToken(createdUser);
    
            return { 
                success: true, 
                message: "User has been registered successfully.", 
                userId,
                accessToken, 
                refreshToken 
            };
    
        } catch (err) {
            console.error("Error in VerifyOtp:", err);
            return { 
                success: false, 
                message: "An error occurred while verifying OTP." 
            };
        }
    }


    async ResendOTP(passedData: ResendOtpDTO): Promise<ResendOtpResponse> {
        try{
            const {email,tempId} = passedData;
            let newOTP = generateOTP();
            console.log(`OTP : [   ${newOTP}   ]`);

            const updatedTempUser = await TempUser.findByIdAndUpdate(tempId,{otp:newOTP},{new:true})

            if(!updatedTempUser){
                console.log('failed to send otp')
                return { success: false, message: "Register time has expaired. Try registering again"}
            }else{
                await SendVerificationMail(email,newOTP)

                return {success: true, message:"OTP has been resent"};
            } 
        }catch{
            return {success: false, message: "An error occured while Resending OTP"}
        }
    } 
    
    async userLogin(loginData: UserLoginDTO): Promise<UserLoginResponse> {
        try {
            const {email, password} = loginData;
            const userData = await repository.findByEmail(email);
            if(userData){
                const checkPassword = await userData.comparePassword(password)
                if(checkPassword){
                    const userId = userData._id;

                    const isBlocked = await repository.isBlocked(userId)
                    if(isBlocked){
                        return {success: false, message : 'isBlocked'}
                    }
                    const {accessToken , refreshToken} = createToken(userData);
                    
                    return {success:true, message: "User login successful.", userData, accessToken, refreshToken, userId};
                }else {
                    return { success: false, message: "Invalid password."}
                }
            }else{
                return {success: false , message: "This Email is not registered."}
            }
            
        } catch (error) {
            return { success:false, message: "An error occured while loggin in."};
        }
    }


    async blockUnblock(data: BlockUnblockDTO): Promise<BlockUnblockResponse> {
        try{
            console.log(data.userId,'from use case')
            const response = await repository.blockUnblock(data.userId);
            if(!response.success){
                return {success:false, message:"Error finding user."}
            }
            return {success: true, message: response.message}

        }catch(error){
            return { success :false, message: "an error occured."}
        }
    }

    async fetchStudents(): Promise<FetchStudentsResponse> {
        try {
            const students = await repository.getAllUsers();
            console.log(students, 'students')
            if (students) {
                return { success: true, students };
            } else {
                return { success: false };
            }
        } catch (err) {
            return { success: false };
        }
    }

    async addToCart(data:{userId:string,courseId:string}):Promise<{message?:string, success:boolean, inCart?:boolean}>{
        try {
            console.log(data, 'data form use ncase')
           const response = await repository.toggleCourseInCart(data.userId,data.courseId)
           if(response.success){
                return {success:true, message: "course added to cart", inCart:response.inCart};
           }else{
            return {success: false}
           }

        } catch (error) {
            console.log(error)
            return {success:false};
        }
    }

    async isInCart(data:{userId:string,courseId:string}):Promise<{inCart?:boolean,success:boolean}>{
        try {
            console.log('trig')
            const response = await repository.CheckIfInCart(data.userId,data.courseId);
            console.log(response,'response from servcie')
            return {inCart:response.inCart,success:true};
        } catch (err) {
            return {success:false};
        }
    } 

    async addToPurchaseList (data:{userId:string,courseId:string}){
        try {
            console.log(data)
            const response = await repository.addToPurchaseList(data.userId,data.courseId);
            console.log(response)
            if(response.success){
                return {message:response.message, success: true, status: StatusCode.Created}
            }else{
                return {message: "error creating order", success: false, status: StatusCode.NotFound}
            }
        } catch (error) {
            console.log(error)
            return {message :"Error occured while creating order", success: false , status: StatusCode.ExpectationFailed }
        }
    }

    async checkCourseStatus(data:{userId:string,courseId:string}):Promise<{ inCart: boolean, inPurchase:boolean ,inWishlist:boolean }>{
        try {
            const response = await repository.CourseStatus(data.userId,data.courseId);
            console.log(response)
            return {inCart:response.inCart, inPurchase:response.inPurchase, inWishlist:response.inWishlist};
        } catch (error) {
            
            console.log(error)
            throw new Error('Failed to check user course status');

        }
    }

    async getCartItems(data: { userId: string }): Promise<{ cart?: CartItem[], success: boolean }> {
        try {
          const response = await repository.getCartItems(data.userId);
            console.log(response, 'response in userCase')
          if (!response) {
            return { success: false }; // Return false if no items are found or the user doesn't exist
          }
      
          // Map the cart items (if they exist) to a string array (e.g., courseId strings)

          return { cart : response, success: true };
        } catch (error) {
          console.error("Error getting cart items:", error);
          return { success: false };
        }
      }

    async checkIsBlocked(data: {userId:string}): Promise<{isBlocked:boolean | undefined}> {
        try {
            const response = await repository.isBlocked(data.userId);

            return {isBlocked : response }
        } catch (error) {
            return {isBlocked:true}
        }
    }

    async resetPassword(data: {userId:string, password:string}){
        try {
            const {userId,password} = data;
            const response = await repository.passwordChange(userId, password);
            return response
        } catch (error) {
            return {message:'error occured in service while changing password', success:false, status: StatusCode.NotModified}
        }
    }

    async sendEmailOtp (data: {email:string}){
        try {
            const email = data.email; 
            const emailExists = await repository.findByEmail(email);
            if(!emailExists){
                console.log("email not found triggered")
                return {success: false, message: "Email not found", status:StatusCode.NotFound };
            }
            let otp = generateOTP();
            console.log(`OTP : [ ${otp} ]`);
            await SendVerificationMail(email,otp)
            console.log('1')
            const otpId = await repository.storeOTP(email,otp);
            console.log('2')
            return {message: 'An OTP has send to your email address.', success:true, status: StatusCode.Found,email, otpId};
        } catch (error) {
            return {message:'error occured in sending OTP.', success:false, status: StatusCode.Conflict}
        }
    }

    async resendEmailOtp (data: {email: string,otpId:string}) {
        try {
            const {email, otpId} = data;
            let otp = generateOTP();
            console.log(`OTP : [ ${otp} ]`);
            await SendVerificationMail(email,otp)
            await repository.updateStoredOTP(otpId,otp);
            return {success:true,status : StatusCode.Accepted};
        } catch (error) {
            return {success:false, status: StatusCode.Conflict};
        }
    }

    async resetPasswordVerifyOTP(data: {email:string,enteredOTP:string}){
        try { 
            const {email,enteredOTP} = data;
            const response = await repository.verifyOTP(email,enteredOTP)
            const user = await repository.findByEmail(email);
            if(response && user){
                return {success:true, message: 'Email has been verified successfuly.',status:StatusCode.Accepted,email,userId:user._id}
            }
            return {success:false, message: 'Entered wrong OTP.', status:StatusCode.NotAcceptable,email}
        } catch (error) {
            return {success:false, message: "Something went wrong.",status:StatusCode.FailedDependency, email:data.email} 
        }
    }
    
}  