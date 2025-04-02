import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { UserController }  from "./Controllers/User.Controller";
import { connectDB} from "./Configs/DB.configs/MongoDB";
import morgan from 'morgan';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs'
import express from "express"
import { configs } from "./Configs/ENV_configs/ENV.configs";
import UserRepository from "./Repositories/UserRepository/User.repository";
import { EmailService } from "./Utils/Send.email";
import { OTPService } from "./Utils/Generate.OTP";
import { UserService } from "./Services/User.service";
import { CertificateGenerator } from "./Utils/GenerateCertificate";
import { JWT } from "./Utils/Activation.token";
const app = express();


// error log
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(), // Log to the console
      new DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: configs.LOG_RETENTION_DAYS 
      })
    ],
  });
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
// error log end



const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));


connectDB()
dotenv.config();

const packatgeDefinition = protoLoader.loadSync(
    path.join(__dirname, "/protos/user.proto"), 
    {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true}
)

const userProto = grpc.loadPackageDefinition(packatgeDefinition)as any;

const server =  new grpc.Server()

const certificateGenerator = new CertificateGenerator()
const userRepository = new UserRepository(); 
const emailService = new EmailService(); 
const otpService = new OTPService();
const jwt = new JWT()
const userService = new UserService(userRepository, emailService, otpService, certificateGenerator, jwt);
const userController = new UserController(userService);

const grpcServer = () => {
    server.bindAsync( 
        `0.0.0.0:${configs.USER_GRPC_PORT}`,
        grpc.ServerCredentials.createInsecure(), 
        (err,port) => { 
            if(err){
                console.log(err, "Error happened grpc user service.");
                return;
            }else{
                console.log("USER_SERVICE running on port", port);
            }
        } 
    ) 
} 
 

server.addService(userProto.UserService.service, {
    Register: userController.signup.bind(userController),
    VerifyOTP: userController.verifyOtp.bind(userController),
    ResendOTP: userController.resendOtp.bind(userController),
    UserLogin: userController.userLogin.bind(userController),
    FetchStudentData: userController.fetchStudents.bind(userController),
    ToggleBlock: userController.blockUnblock.bind(userController),
    AddToCart: userController.addToCart.bind(userController),
    IsInCart: userController.isInCart.bind(userController),
    CourseStatus: userController.courseStatus.bind(userController),
    GetCartItemsIds: userController.getCartItems.bind(userController),
    isBlocked: userController.isBlocked.bind(userController),
    SendOtpToEmail: userController.sendOtpToEmail .bind(userController),
    ResendOtpToEmail: userController.resendOtpToEmail.bind(userController),
    VerifyOTPResetPassword : userController.VerifyEnteredOTP.bind(userController),
    ResetPassword: userController.resetPassword.bind(userController),
    AttachNameToReview: userController.linkNameToReview.bind(userController),
    AttachNameToMessages: userController.linkNameToMessages.bind(userController),
    GetUserDetails: userController.fetchUserById.bind(userController),
    FetchUsersByIds: userController.fetchUsersByIds.bind(userController),
    UpdateUserDetails: userController.updateUserDetails.bind(userController),
    GoogleAuthentication: userController.googleAuth.bind(userController),
    UpdateCurrentLesson: userController.updateCurrentLesson.bind(userController),
    UpdateCompletedLesson: userController.updateCompletedLesson.bind(userController),
    GetCertificate: userController.fetchUserCertificate.bind(userController),
    Test: userController.test.bind(userController), 
})

grpcServer()

userController.start()
  .catch(error => console.error('Failed to start kafka course service:', error));

const PORT = configs.PORT; 
app.listen(PORT, () => {
  console.log(`Course service running on port ${PORT}`);
});
