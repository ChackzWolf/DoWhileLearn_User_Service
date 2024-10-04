import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { UserController }  from "./controllers/User.Controller";
import { connectDB } from "./configs/mongoDB";
import morgan from 'morgan';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs'
import express from "express"
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
        maxFiles: '14d' // Keep logs for 14 days
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
        `0.0.0.0:${process.env.USER_GRPC_PORT}`,
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
    AddPurchasedCourses: controller.addToPurchaseList, 
    CourseStatus: controller.CourseStatus,
    GetCartItemsIds: controller.GetCartItems
})

grpcServer()







