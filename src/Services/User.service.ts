import  { TempUser } from "../Schemas/User.schema";
import { IUser, ITempUser, CartItem } from "../Interfaces/Models/IUser";
import dotenv from "dotenv"
import { IUserService } from "../Interfaces/IService/IService.interface";
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
    FetchStudentsResponse,
    GoogleAuthenticationRequestDTO,
    GoogleAuthenticationResponse
  } from '../Interfaces/DTOs/IService.dto';
  import { kafkaConfig } from "../Configs/Kafka.configs/Kafka.config";
import { IUserRepository } from "../Interfaces/IRepositories/IRepository.interface";
import { IEmailService } from "../Interfaces/IUtils/IEmailService";
import { IOTPService } from "../Interfaces/IUtils/IOTPService";
import { ICurrentLesson, IPurchasedCourse } from "../Interfaces/Models/IPurchasedCourse";
import { ICertificateGenerator } from "../Interfaces/IUtils/ICertificateGenerator";
import { uploadPDF } from "../Configs/S3.configs";
import { ICertification } from "../Interfaces/Models/ICertification";
import { IJWT } from "../Interfaces/IUtils/IJWT";


dotenv.config();
export interface OrderEventData {
    userId: string;
    tutorId: string;
    courseId: string;
    transactionId: string;
    title: string;
    thumbnail: string;
    price: string;
    adminShare: string; 
    tutorShare: string;
    paymentStatus:boolean;
    timestamp: Date;
    status: string;
  }


 

export class UserService implements IUserService{


    private userRepository: IUserRepository;
    private emailService: IEmailService;
    private otpService: IOTPService;
    private certificateGenerator: ICertificateGenerator
    private jwt: IJWT

    constructor(userRepository: IUserRepository, emailService: IEmailService, otpService: IOTPService, certificateGenerator:ICertificateGenerator, jwt: IJWT) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.otpService = otpService;
        this.certificateGenerator = certificateGenerator;
        this.jwt = jwt;
    }
    
    
    async userRegister(userData: UserRegisterDTO): Promise<UserRegisterResponse> {
        try{
            console.log(`userService ${userData}`)
            const email = userData.email;
            if(email === undefined){
                throw new Error("Email is undefined");
            } 
            const emailExists = await this.userRepository.findByEmail(email);
            
            if(emailExists){
                console.log('email exists triggered')
                return {success: false, message: "Email already exists" };
            }

            let otp = this.otpService.generateOTP();
            console.log(`OTP : [ ${otp} ]`);
            await this.emailService.sendVerificationMail(email,otp)

            console.log('Email send')

            const tempUserData: ITempUser | null = await this.userRepository.createTempUser({
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

    async googleAuthentication(data: GoogleAuthenticationRequestDTO): Promise<GoogleAuthenticationResponse> {
        try{
            console.log(`userService ${data}`)
            const {firstName, email, lastName, photoUrl} = data;
            console.log(firstName, lastName, email, photoUrl)
            const userData = await this.userRepository.findByEmail(email);
            if(userData){
                const userId = userData._id;
                const isBlocked = await this.userRepository.isBlocked(userId)
                if(isBlocked){
                    return {success: false, message : 'isBlocked'}
                }
                const {accessToken , refreshToken} = this.jwt.createToken(userData);


                console.log('afaf',userData.profilePicture)
                if(!userData.profilePicture){
                    console.log('trig')
                    const userId = userData._id; 
                    const user = await this.userRepository.updateProfilePicById(userId,photoUrl);
                    return {
                        success:true,
                        userId,
                        userData:user,
                        accessToken,
                        refreshToken,
                        message: "User login successful.",
                    };
                }
                
                return {
                    success:true,
                    userId,
                    userData,
                    accessToken,
                    refreshToken,
                    message: "User login successful.",
                };
            }else{
                const data = { firstName, lastName, email, password:'Jacks@123', photoUrl }
                console.log(data, 'new account')
                const createdUser: IUser | null = await this.userRepository.createUser(data);
            
                if (!createdUser) {
                    throw new Error("Failed to create user.");
                }
                const userId: string = createdUser._id.toString();
                console.log(createdUser, 'created user')
                const { accessToken, refreshToken } = this.jwt.createToken(createdUser);
                return { 
                    success: true, 
                    message: "User has been registered successfully.", 
                    userId,
                    accessToken, 
                    refreshToken,
                    userData:createdUser,
                };
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
            
            const createdUser: IUser | null = await this.userRepository.createUser(tempUser.userData);
            
            if (!createdUser) {
                throw new Error("Failed to create user.");
            }
            const userId: string = createdUser._id.toString();

            const { accessToken, refreshToken } = this.jwt.createToken(createdUser);
    
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
            let newOTP = this.otpService.generateOTP();
            console.log(`OTP : [   ${newOTP}   ]`);

            const updatedTempUser = await TempUser.findByIdAndUpdate(tempId,{otp:newOTP},{new:true})

            if(!updatedTempUser){
                console.log('failed to send otp')
                return { success: false, message: "Register time has expaired. Try registering again"}
            }else{
                this.emailService.sendVerificationMail(email,newOTP)

                return {success: true, message:"OTP has been resent"};
            } 
        }catch{
            return {success: false, message: "An error occured while Resending OTP"}
        }
    } 
    
    async userLogin(loginData: UserLoginDTO): Promise<UserLoginResponse> {
        try {
            console.log(loginData, 'user login')
            const {email, password} = loginData;
            const userData = await this.userRepository.findByEmail(email);
            if(userData){
                const checkPassword = await userData.comparePassword(password)
                if(checkPassword){
                    const userId = userData._id;
                    const isBlocked = await this.userRepository.isBlocked(userId)
                    if(isBlocked){
                        return {success: false, message : 'isBlocked'}
                    }
                    const {accessToken , refreshToken} = this.jwt.createToken(userData);
                    
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

    async getUserById(data:{userId:string}){
        try {
            const userId = data.userId;
            const userData = await this.userRepository.findByUserId(userId);
            if(userData){
                return {success:true, status:StatusCode.OK, message:"Fetched user details successfuly", userData};
            }
            return {success:false, status:StatusCode.NotFound, message:"Failed to fetch user details."}
        } catch (error) {
            console.log(error, "error from service");
            return { success:false, message: "An error occured while fetching user details"};
        }
    }

    async blockUnblock(data: BlockUnblockDTO): Promise<BlockUnblockResponse> {
        try{
            console.log(data.userId,'from use case')
            const response = await this.userRepository.blockUnblock(data.userId);
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
            const students = await this.userRepository.getAllUsers();
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
           const response = await this.userRepository.toggleCourseInCart(data.userId,data.courseId)
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
            const response = await this.userRepository.CheckIfInCart(data.userId,data.courseId);
            console.log(response,'response from servcie')
            return {inCart:response.inCart,success:true};
        } catch (err) {
            return {success:false};
        }
    } 

    async addToPurchaseList (orderData: OrderEventData):Promise<void>{
        try {
            console.log(orderData, "order data form addpurchase list service");
            const { userId, courseId} = orderData;
            const response = await this.userRepository.addToPurchaseList(userId , courseId);
            console.log(response)
            if(response.success){
                await kafkaConfig.sendMessage('user.response', {
                    success: true,
                    service: 'user-service',
                    status: 'COMPLETED',
                    transactionId: orderData.transactionId
                  });
            }else{
                throw new Error(" response success is not true.");
            }
        } catch (error:any) {
            console.log(error)
            await kafkaConfig.sendMessage('user.response', {
                ...orderData,
                service: 'user-service',
                status: 'FAILED',
                error: error.message
              });
        }
    }

    async deleteFromPurchaseList(orderData:OrderEventData):Promise<void>{
        try {
            const {userId, courseId} = orderData;
            console.log(orderData)
            const response = await this.userRepository.removeFromPurchaseList(userId,courseId);
            if(response.success){
                await kafkaConfig.sendMessage('rollback-completed', {
                    transactionId: orderData.transactionId,
                    service: 'user-service'
                  });
            }else{
                throw new Error("Error in role back")
            }
        } catch (error) {
            throw new Error("delet course from purchase list failed");
        }
    }
 
    async checkCourseStatus(data:{userId:string,courseId:string}):Promise<{ inCart: boolean, inPurchase:boolean ,inWishlist:boolean, purchasedCourseStatus:IPurchasedCourse | null}>{
        try {
            const response = await this.userRepository.CourseStatus(data.userId,data.courseId);
            console.log(response)
            return {inCart:response.inCart, inPurchase:response.inPurchase, inWishlist:response.inWishlist, purchasedCourseStatus: response.purchasedCourseStatus};
        } catch (error) {
            
            console.log(error)
            throw new Error('Failed to check user course status');

        }
    }

    async getCartItems(data: { userId: string }): Promise<{ cart?: CartItem[], success: boolean }> {
        try {
          const response = await this.userRepository.getCartItems(data.userId);
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
            const response = await this.userRepository.isBlocked(data.userId);

            return {isBlocked : response }
        } catch (error) {
            return {isBlocked:true}
        }
    }

    async resetPassword(data: {userId:string, password:string}){
        try {
            const {userId,password} = data;
            const response = await this.userRepository.passwordChange(userId, password);
            return response
        } catch (error) {
            return {message:'error occured in service while changing password', success:false, status: StatusCode.NotModified}
        }
    }

    async sendEmailOtp (data: {email:string}){
        try {
            const email = data.email; 
            const emailExists = await this.userRepository.findByEmail(email);
            if(!emailExists){
                console.log("email not found triggered")
                return {success: false, message: "Email not found", status:StatusCode.NotFound };
            }
            let otp = this.otpService.generateOTP();
            console.log(`OTP : [ ${otp} ]`);
            this.emailService.sendVerificationMail(email,otp)
            console.log('1')
            const otpId = await this.userRepository.storeOTP(email,otp);
            console.log('2')
            return {message: 'An OTP has send to your email address.', success:true, status: StatusCode.Found,email, otpId, userId:emailExists._id};
        } catch (error) {
            return {message:'error occured in sending OTP.', success:false, status: StatusCode.Conflict}
        }
    }

    async resendEmailOtp (data: {email: string,otpId:string}) {
        try {
            console.log('trig resend')
            const {email, otpId} = data;
            let otp = this.otpService.generateOTP();
            console.log(`OTP : [ ${otp} ]`);


            this.emailService.sendVerificationMail(email,otp) 


            const updateStoredOTP = await this.userRepository.updateStoredOTP(otpId,otp);
            if(!updateStoredOTP){
                return {success:false, status: StatusCode.NotFound, message:"Time expired. try again later."}
            }
            console.log(updateStoredOTP,'stored otp')
            return {success:true,status : StatusCode.Accepted, message : "OTP has resend"};
        } catch (error) {
            console.log(error, "error")
            return {success:false, status: StatusCode.Conflict, message: "Error occured while resending OTP."};
        }
    }

    async resetPasswordVerifyOTP(data: {email:string,enteredOTP:string}){
        try { 
            const {email,enteredOTP} = data;
            const response = await this.userRepository.verifyOTP(email,enteredOTP)
            const user = await this.userRepository.findByEmail(email);
            if(response && user){
                return {success:true, message: 'Email has been verified successfuly.',status:StatusCode.Accepted,email,userId:user._id}
            }
            return {success:false, message: 'Entered wrong OTP.', status:StatusCode.NotAcceptable,email}
        } catch (error) {
            return {success:false, message: "Something went wrong.",status:StatusCode.FailedDependency, email:data.email} 
        }
    }



    async attachReviewById(data: any): Promise<any[]> {
        try {
            
            const updatedData = await Promise.all(
                data.reviewData.map(async (review:any) => {
                    const userId = review.userId;
                    const name = await this.userRepository.getNameById(userId); // getNameById returns either the user's full name or "Unknown User" if not found
                    console.log(name, 'name to review. from user service')
                    return { ...review, name };
                })
            );
            return updatedData;
        } catch (error) {
            console.error('Error while fetching names by user ID:', error);
            throw new Error('Could not attach names to reviews.');
        }
    }

    async updateUserDetails(data:{formData:IUser}):Promise <{success:boolean, status:number, message:string}>{
        try {
            const datatoUpdate = data.formData;
            const response = await this.userRepository.updateUser(datatoUpdate);
            console.log(response);
            if(!response){
                return {success:false, status:StatusCode.Conflict, message:"No response. Error occured while updating tutor details."}
            }
            return {success: true, status:StatusCode.Accepted, message: "Tutor details updated successfuly."}
        } catch (error) {
            return {success:false, status:StatusCode.Conflict, message:"Error occured while updating tutor details."}
        }
    }

    async attachMessageById(data: any): Promise<any[]> {
        try {

            console.log(data, 'ata from service')
            
            const updatedData = await Promise.all(
                data.messages.map(async (msg:any) => {
                    const userId = msg.userId;
                    const name = await this.userRepository.getNameById(userId); // getNameById returns either the user's full name or "Unknown User" if not found
                    return { ...msg, name:name.name, imageUrl: name.imageUrl };
                })
            );
            return updatedData;
        } catch (error) {
            console.error('Error while fetching names by user ID:', error);
            throw new Error('Could not attach names to reviews.');
        }
    }

    async fetchUsersByIds( data: {studentIds: string[] }){
        try {
            const studentIds = data.studentIds;
            const users = await this.userRepository.getUsersByIds(studentIds)
            return users
        } catch (error) {
            console.error('Error while fetching users by ids', error);
            throw new Error('Could not attach names to reviews.');
        }
    }

    async updateCurrentLesson( data: {moduleIndex: number, lessonIndex:number, courseId:string, userId:string}):Promise<ICurrentLesson>{
        try {
            const currentLesson = await this.userRepository.updateCurrentLesson(data);
            return currentLesson
        } catch (error) {
            console.error(error);
            throw new Error('Error updating update completed lesson ')
        }
    }

    async updateCompletedLesson(data: {userId: string ,courseId :string, lessonIndex: number, moduleIndex: number, totalLessons:number, courseName:string, tutorName:string}):Promise<{data:IPurchasedCourse}>{
        try {
            const response =  await this.userRepository.updateCompletedLesson(data);
            console.log(response, 'this is the resposne')

            if(response){
                if(response.completed){
                    console.log(response, 'this is the resposne')
                    const user = await this.userRepository.findByUserId(data.userId)

                    const courseCertificate = await this.userRepository.getCertificate(data.userId, data.courseId);
                    console.log(courseCertificate,'courseCertificate');
                    if(!courseCertificate.success){
                         console.log('certificate not found ',  courseCertificate );
                        const now = new Date();
                        const dataForCertificate = {
                            studentName: `${user?.firstName} ${user?.lastName}`,
                            courseName: data.courseName,
                            completionDate: now.toISOString().split('T')[0],
                            certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
                            instructorName: data.tutorName,
                        }
                        
                        const certificate = await this.certificateGenerator.generateCertificate(dataForCertificate)
                        const certificateUrl = await uploadPDF(certificate,`${data.courseName}${data.userId}`)
                        const certificationData = {
                            courseId:data.courseId,
                            title:data.courseName ,
                            certificateUrl: certificateUrl.publicUrl
                        }
                        console.log(certificationData,'certification data');
                        await this.userRepository.addCertification(data.userId, certificationData)
                    }
                }
                return {data : response}
            }else{
                throw new Error('Error updating update completed lesson ')
            }
        } catch (error) {
            console.error(error);
            throw new Error('Error updating update completed lesson ')
        }
    }

    async getCertificate(data:{userId:string, courseId:string}):Promise<{success:boolean, certificate?:ICertification}>{
        try {
            const {userId, courseId} = data;
            const response = await this.userRepository.getCertificate(userId, courseId);
            if(response.success){
                return response
            }else{
                return response
            }
        } catch (error) {
            console.log('failed in service to fetch certificate ', error);
            throw new Error( ' Failed to fetch certificate from  service');
        }
    }
    
}  

