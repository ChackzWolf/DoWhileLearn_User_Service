import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { UserController }  from "./controllers/userController";
import { connectDB } from "./configs/mongoDB";

connectDB()

dotenv.config();

const packatgeDefinition = protoLoader.loadSync(
    path.join(__dirname, "/protos/user.proto"),
    {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true}
)

const userProto = grpc.loadPackageDefinition(packatgeDefinition)as any;

const server =  new grpc.Server()

const grpcServer = () => {
    server.bindAsync(
        `0.0.0.0:${process.env.USER_GRPC_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (err,port) => {
            if(err){
                console.log(err, "Error happened grpc user service.");
                return;
            }else{
                console.log("gRPC user server started on port", port);
            }
        } 
    )
}
 

server.addService(userProto.UserService.service, {
    Register: UserController.signup,
    OtpVerify: UserController.otp,
})

grpcServer()







