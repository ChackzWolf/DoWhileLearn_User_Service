"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var grpc = __importStar(require("@grpc/grpc-js"));
var protoLoader = __importStar(require("@grpc/proto-loader"));
var path_1 = __importDefault(require("path"));
var User_Controller_1 = require("./Controllers/User.Controller");
var MongoDB_1 = require("./Configs/DB.configs/MongoDB");
var morgan_1 = __importDefault(require("morgan"));
var winston_1 = __importDefault(require("winston"));
var winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
var fs_1 = __importDefault(require("fs"));
var express_1 = __importDefault(require("express"));
var ENV_configs_1 = require("./Configs/ENV_configs/ENV.configs");
var User_repository_1 = __importDefault(require("./Repositories/UserRepository/User.repository"));
var Send_email_1 = require("./Utils/Send.email");
var Generate_OTP_1 = require("./Utils/Generate.OTP");
var User_service_1 = require("./Services/User.service");
var GenerateCertificate_1 = require("./Utils/GenerateCertificate");
var Activation_token_1 = require("./Utils/Activation.token");
var app = (0, express_1.default)();
// error log
var logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(), // Log to the console
        new winston_daily_rotate_file_1.default({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: ENV_configs_1.configs.LOG_RETENTION_DAYS
        })
    ],
});
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: function (message) { return logger.info(message.trim()); }
    }
}));
// error log end
var logStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, 'access.log'), { flags: 'a' });
app.use((0, morgan_1.default)('combined', { stream: logStream }));
(0, MongoDB_1.connectDB)();
dotenv_1.default.config();
var packatgeDefinition = protoLoader.loadSync(path_1.default.join(__dirname, "/protos/user.proto"), { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
var userProto = grpc.loadPackageDefinition(packatgeDefinition);
var server = new grpc.Server();
var certificateGenerator = new GenerateCertificate_1.CertificateGenerator();
var userRepository = new User_repository_1.default();
var emailService = new Send_email_1.EmailService();
var otpService = new Generate_OTP_1.OTPService();
var jwt = new Activation_token_1.JWT();
var userService = new User_service_1.UserService(userRepository, emailService, otpService, certificateGenerator, jwt);
var userController = new User_Controller_1.UserController(userService);
var grpcServer = function () {
    server.bindAsync("0.0.0.0:".concat(ENV_configs_1.configs.USER_GRPC_PORT), grpc.ServerCredentials.createInsecure(), function (err, port) {
        if (err) {
            console.log(err, "Error happened grpc user service.");
            return;
        }
        else {
            console.log("USER_SERVICE running on port", port);
        }
    });
};
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
    SendOtpToEmail: userController.sendOtpToEmail.bind(userController),
    ResendOtpToEmail: userController.resendOtpToEmail.bind(userController),
    VerifyOTPResetPassword: userController.VerifyEnteredOTP.bind(userController),
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
});
grpcServer();
userController.start()
    .catch(function (error) { return console.error('Failed to start kafka course service:', error); });
var PORT = ENV_configs_1.configs.PORT;
app.listen(PORT, function () {
    console.log("Course service running on port ".concat(PORT));
});
