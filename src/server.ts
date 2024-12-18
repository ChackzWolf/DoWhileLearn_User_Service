import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { UserController }  from "./Controllers/User.controller";
import { connectDB } from "./Configs/DB.configs/MongoDB";
import morgan from 'morgan';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs'
import express from "express"
import { configs } from "./Configs/ENV_configs/ENV.configs";
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
export const controller = new UserController()
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
    Register: controller.signup,
    VerifyOTP: controller.verifyOtp,
    ResendOTP: controller.resendOtp,
    UserLogin: controller.userLogin,
    FetchStudentData: controller.fetchStudents,
    ToggleBlock: controller.blockUnblock,
    AddToCart: controller.addToCart,
    IsInCart: controller.isInCart, 
    CourseStatus: controller.courseStatus,
    GetCartItemsIds: controller.getCartItems,
    isBlocked: controller.isBlocked,
    SendOtpToEmail: controller.sendOtpToEmail ,
    ResendOtpToEmail: controller.resendOtpToEmail,
    VerifyOTPResetPassword : controller.VerifyEnteredOTP,
    ResetPassword: controller.resetPassword,
    AttachNameToReview: controller.linkNameToReview,
    AttachNameToMessages: controller.linkNameToMessages,
    GetUserDetails: controller.fetchUserById,
    FetchUsersByIds: controller.fetchUsersByIds
})

grpcServer()


// Start Kafka consumer
controller.start()
  .catch(error => console.error('Failed to start kafka course service:', error));

const PORT = configs.PORT; 
app.listen(PORT, () => {
  console.log(`Course service running on port ${PORT}`);
});
 




