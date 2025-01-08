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
exports.controller = void 0;
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
exports.controller = new User_Controller_1.UserController();
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
    Register: exports.controller.signup,
    VerifyOTP: exports.controller.verifyOtp,
    ResendOTP: exports.controller.resendOtp,
    UserLogin: exports.controller.userLogin,
    FetchStudentData: exports.controller.fetchStudents,
    ToggleBlock: exports.controller.blockUnblock,
    AddToCart: exports.controller.addToCart,
    IsInCart: exports.controller.isInCart,
    CourseStatus: exports.controller.courseStatus,
    GetCartItemsIds: exports.controller.getCartItems,
    isBlocked: exports.controller.isBlocked,
    SendOtpToEmail: exports.controller.sendOtpToEmail,
    ResendOtpToEmail: exports.controller.resendOtpToEmail,
    VerifyOTPResetPassword: exports.controller.VerifyEnteredOTP,
    ResetPassword: exports.controller.resetPassword,
    AttachNameToReview: exports.controller.linkNameToReview,
    AttachNameToMessages: exports.controller.linkNameToMessages,
    GetUserDetails: exports.controller.fetchUserById,
    FetchUsersByIds: exports.controller.fetchUsersByIds,
    UpdateUserDetails: exports.controller.updateUserDetails
});
grpcServer();
// Start Kafka consumer
exports.controller.start()
    .catch(function (error) { return console.error('Failed to start kafka course service:', error); });
var PORT = ENV_configs_1.configs.PORT;
app.listen(PORT, function () {
    console.log("Course service running on port ".concat(PORT));
});
