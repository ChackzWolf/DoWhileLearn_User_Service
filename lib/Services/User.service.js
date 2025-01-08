"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var User_repository_1 = __importDefault(require("../Repositories/UserRepository/User.repository"));
var User_schema_1 = require("../Schemas/User.schema");
var dotenv_1 = __importDefault(require("dotenv"));
var Generate_OTP_1 = require("../Utils/Generate.OTP");
var Send_email_1 = require("../Utils/Send.email");
var Activation_token_1 = __importDefault(require("../Utils/Activation.token"));
var Enums_1 = require("../Interfaces/Enums/Enums");
var Kafka_config_1 = require("../Configs/Kafka.configs/Kafka.config");
dotenv_1.default.config();
var repository = new User_repository_1.default();
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.prototype.userRegister = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var email, emailExists, otp, tempUserData, tempId, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        console.log("userService ".concat(userData));
                        email = userData.email;
                        if (email === undefined) {
                            throw new Error("Email is undefined");
                        }
                        return [4 /*yield*/, repository.findByEmail(email)];
                    case 1:
                        emailExists = _a.sent();
                        if (emailExists) {
                            console.log('email exists triggered');
                            return [2 /*return*/, { success: false, message: "Email already exists" }];
                        }
                        otp = (0, Generate_OTP_1.generateOTP)();
                        console.log("OTP : [ ".concat(otp, " ]"));
                        return [4 /*yield*/, (0, Send_email_1.SendVerificationMail)(email, otp)];
                    case 2:
                        _a.sent();
                        console.log('Email send');
                        return [4 /*yield*/, repository.createTempUser({
                                otp: otp,
                                userData: userData,
                            })];
                    case 3:
                        tempUserData = _a.sent();
                        if (tempUserData) {
                            tempId = tempUserData._id.toString();
                            return [2 /*return*/, { success: true, message: "Verification email sent", tempId: tempId, email: email }];
                        }
                        else {
                            throw new Error("Failed to create temporary user data.");
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        throw new Error("Failed to signup: ".concat(err_1));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.VerifyOtp = function (passedData) {
        return __awaiter(this, void 0, void 0, function () {
            var tempId, enteredOTP, tempUser, createdUser, userId, _a, accessToken, refreshToken, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        tempId = passedData.tempId, enteredOTP = passedData.enteredOTP;
                        return [4 /*yield*/, User_schema_1.TempUser.findById(tempId)];
                    case 1:
                        tempUser = _b.sent();
                        if (!tempUser) {
                            return [2 /*return*/, { success: false, message: "Temp user not found. { Internal error }" }];
                        }
                        if (tempUser.otp !== enteredOTP) {
                            return [2 /*return*/, { success: false, message: "You have entered invalid OTP." }];
                        }
                        return [4 /*yield*/, repository.createUser(tempUser.userData)];
                    case 2:
                        createdUser = _b.sent();
                        if (!createdUser) {
                            throw new Error("Failed to create user.");
                        }
                        userId = createdUser._id.toString();
                        _a = (0, Activation_token_1.default)(createdUser), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                        return [2 /*return*/, {
                                success: true,
                                message: "User has been registered successfully.",
                                userId: userId,
                                accessToken: accessToken,
                                refreshToken: refreshToken
                            }];
                    case 3:
                        err_2 = _b.sent();
                        console.error("Error in VerifyOtp:", err_2);
                        return [2 /*return*/, {
                                success: false,
                                message: "An error occurred while verifying OTP."
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.ResendOTP = function (passedData) {
        return __awaiter(this, void 0, void 0, function () {
            var email, tempId, newOTP, updatedTempUser, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        email = passedData.email, tempId = passedData.tempId;
                        newOTP = (0, Generate_OTP_1.generateOTP)();
                        console.log("OTP : [   ".concat(newOTP, "   ]"));
                        return [4 /*yield*/, User_schema_1.TempUser.findByIdAndUpdate(tempId, { otp: newOTP }, { new: true })];
                    case 1:
                        updatedTempUser = _b.sent();
                        if (!!updatedTempUser) return [3 /*break*/, 2];
                        console.log('failed to send otp');
                        return [2 /*return*/, { success: false, message: "Register time has expaired. Try registering again" }];
                    case 2: return [4 /*yield*/, (0, Send_email_1.SendVerificationMail)(email, newOTP)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { success: true, message: "OTP has been resent" }];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        _a = _b.sent();
                        return [2 /*return*/, { success: false, message: "An error occured while Resending OTP" }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.userLogin = function (loginData) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, userData, checkPassword, userId, isBlocked, _a, accessToken, refreshToken, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        email = loginData.email, password = loginData.password;
                        return [4 /*yield*/, repository.findByEmail(email)];
                    case 1:
                        userData = _b.sent();
                        if (!userData) return [3 /*break*/, 6];
                        return [4 /*yield*/, userData.comparePassword(password)];
                    case 2:
                        checkPassword = _b.sent();
                        if (!checkPassword) return [3 /*break*/, 4];
                        userId = userData._id;
                        return [4 /*yield*/, repository.isBlocked(userId)];
                    case 3:
                        isBlocked = _b.sent();
                        if (isBlocked) {
                            return [2 /*return*/, { success: false, message: 'isBlocked' }];
                        }
                        _a = (0, Activation_token_1.default)(userData), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                        return [2 /*return*/, { success: true, message: "User login successful.", userData: userData, accessToken: accessToken, refreshToken: refreshToken, userId: userId }];
                    case 4: return [2 /*return*/, { success: false, message: "Invalid password." }];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, { success: false, message: "This Email is not registered." }];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_1 = _b.sent();
                        return [2 /*return*/, { success: false, message: "An error occured while loggin in." }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUserById = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, userData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = data.userId;
                        return [4 /*yield*/, repository.findByUserId(userId)];
                    case 1:
                        userData = _a.sent();
                        if (userData) {
                            return [2 /*return*/, { success: true, status: Enums_1.StatusCode.OK, message: "Fetched user details successfuly", userData: userData }];
                        }
                        return [2 /*return*/, { success: false, status: Enums_1.StatusCode.NotFound, message: "Failed to fetch user details." }];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2, "error from service");
                        return [2 /*return*/, { success: false, message: "An error occured while fetching user details" }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.blockUnblock = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log(data.userId, 'from use case');
                        return [4 /*yield*/, repository.blockUnblock(data.userId)];
                    case 1:
                        response = _a.sent();
                        if (!response.success) {
                            return [2 /*return*/, { success: false, message: "Error finding user." }];
                        }
                        return [2 /*return*/, { success: true, message: response.message }];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, { success: false, message: "an error occured." }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.fetchStudents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var students, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, repository.getAllUsers()];
                    case 1:
                        students = _a.sent();
                        console.log(students, 'students');
                        if (students) {
                            return [2 /*return*/, { success: true, students: students }];
                        }
                        else {
                            return [2 /*return*/, { success: false }];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        return [2 /*return*/, { success: false }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.addToCart = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log(data, 'data form use ncase');
                        return [4 /*yield*/, repository.toggleCourseInCart(data.userId, data.courseId)];
                    case 1:
                        response = _a.sent();
                        if (response.success) {
                            return [2 /*return*/, { success: true, message: "course added to cart", inCart: response.inCart }];
                        }
                        else {
                            return [2 /*return*/, { success: false }];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        return [2 /*return*/, { success: false }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.isInCart = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('trig');
                        return [4 /*yield*/, repository.CheckIfInCart(data.userId, data.courseId)];
                    case 1:
                        response = _a.sent();
                        console.log(response, 'response from servcie');
                        return [2 /*return*/, { inCart: response.inCart, success: true }];
                    case 2:
                        err_4 = _a.sent();
                        return [2 /*return*/, { success: false }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.addToPurchaseList = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, courseId, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 7]);
                        console.log(orderData, "order data form addpurchase list service");
                        userId = orderData.userId, courseId = orderData.courseId;
                        return [4 /*yield*/, repository.addToPurchaseList(userId, courseId)];
                    case 1:
                        response = _a.sent();
                        console.log(response);
                        if (!response.success) return [3 /*break*/, 3];
                        return [4 /*yield*/, Kafka_config_1.kafkaConfig.sendMessage('user.response', {
                                success: true,
                                service: 'user-service',
                                status: 'COMPLETED',
                                transactionId: orderData.transactionId
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error(" response success is not true.");
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        error_5 = _a.sent();
                        console.log(error_5);
                        return [4 /*yield*/, Kafka_config_1.kafkaConfig.sendMessage('user.response', __assign(__assign({}, orderData), { service: 'user-service', status: 'FAILED', error: error_5.message }))];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.deleteFromPurchaseList = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, courseId, response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        userId = orderData.userId, courseId = orderData.courseId;
                        console.log(orderData);
                        return [4 /*yield*/, repository.removeFromPurchaseList(userId, courseId)];
                    case 1:
                        response = _a.sent();
                        if (!response.success) return [3 /*break*/, 3];
                        return [4 /*yield*/, Kafka_config_1.kafkaConfig.sendMessage('rollback-completed', {
                                transactionId: orderData.transactionId,
                                service: 'user-service'
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error("Error in role back");
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_6 = _a.sent();
                        throw new Error("delet course from purchase list failed");
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.checkCourseStatus = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, repository.CourseStatus(data.userId, data.courseId)];
                    case 1:
                        response = _a.sent();
                        console.log(response);
                        return [2 /*return*/, { inCart: response.inCart, inPurchase: response.inPurchase, inWishlist: response.inWishlist }];
                    case 2:
                        error_7 = _a.sent();
                        console.log(error_7);
                        throw new Error('Failed to check user course status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getCartItems = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, repository.getCartItems(data.userId)];
                    case 1:
                        response = _a.sent();
                        console.log(response, 'response in userCase');
                        if (!response) {
                            return [2 /*return*/, { success: false }]; // Return false if no items are found or the user doesn't exist
                        }
                        // Map the cart items (if they exist) to a string array (e.g., courseId strings)
                        return [2 /*return*/, { cart: response, success: true }];
                    case 2:
                        error_8 = _a.sent();
                        console.error("Error getting cart items:", error_8);
                        return [2 /*return*/, { success: false }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.checkIsBlocked = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, repository.isBlocked(data.userId)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, { isBlocked: response }];
                    case 2:
                        error_9 = _a.sent();
                        return [2 /*return*/, { isBlocked: true }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.resetPassword = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, password, response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = data.userId, password = data.password;
                        return [4 /*yield*/, repository.passwordChange(userId, password)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_10 = _a.sent();
                        return [2 /*return*/, { message: 'error occured in service while changing password', success: false, status: Enums_1.StatusCode.NotModified }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.sendEmailOtp = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var email, emailExists, otp, otpId, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        email = data.email;
                        return [4 /*yield*/, repository.findByEmail(email)];
                    case 1:
                        emailExists = _a.sent();
                        if (!emailExists) {
                            console.log("email not found triggered");
                            return [2 /*return*/, { success: false, message: "Email not found", status: Enums_1.StatusCode.NotFound }];
                        }
                        otp = (0, Generate_OTP_1.generateOTP)();
                        console.log("OTP : [ ".concat(otp, " ]"));
                        return [4 /*yield*/, (0, Send_email_1.SendVerificationMail)(email, otp)];
                    case 2:
                        _a.sent();
                        console.log('1');
                        return [4 /*yield*/, repository.storeOTP(email, otp)];
                    case 3:
                        otpId = _a.sent();
                        console.log('2');
                        return [2 /*return*/, { message: 'An OTP has send to your email address.', success: true, status: Enums_1.StatusCode.Found, email: email, otpId: otpId, userId: emailExists._id }];
                    case 4:
                        error_11 = _a.sent();
                        return [2 /*return*/, { message: 'error occured in sending OTP.', success: false, status: Enums_1.StatusCode.Conflict }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.resendEmailOtp = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var email, otpId, otp, updateStoredOTP, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log('trig resend');
                        email = data.email, otpId = data.otpId;
                        otp = (0, Generate_OTP_1.generateOTP)();
                        console.log("OTP : [ ".concat(otp, " ]"));
                        return [4 /*yield*/, (0, Send_email_1.SendVerificationMail)(email, otp)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, repository.updateStoredOTP(otpId, otp)];
                    case 2:
                        updateStoredOTP = _a.sent();
                        if (!updateStoredOTP) {
                            return [2 /*return*/, { success: false, status: Enums_1.StatusCode.NotFound, message: "Time expired. try again later." }];
                        }
                        console.log(updateStoredOTP, 'stored otp');
                        return [2 /*return*/, { success: true, status: Enums_1.StatusCode.Accepted, message: "OTP has resend" }];
                    case 3:
                        error_12 = _a.sent();
                        console.log(error_12, "error");
                        return [2 /*return*/, { success: false, status: Enums_1.StatusCode.Conflict, message: "Error occured while resending OTP." }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.resetPasswordVerifyOTP = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var email, enteredOTP, response, user, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        email = data.email, enteredOTP = data.enteredOTP;
                        return [4 /*yield*/, repository.verifyOTP(email, enteredOTP)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, repository.findByEmail(email)];
                    case 2:
                        user = _a.sent();
                        if (response && user) {
                            return [2 /*return*/, { success: true, message: 'Email has been verified successfuly.', status: Enums_1.StatusCode.Accepted, email: email, userId: user._id }];
                        }
                        return [2 /*return*/, { success: false, message: 'Entered wrong OTP.', status: Enums_1.StatusCode.NotAcceptable, email: email }];
                    case 3:
                        error_13 = _a.sent();
                        return [2 /*return*/, { success: false, message: "Something went wrong.", status: Enums_1.StatusCode.FailedDependency, email: data.email }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.attachReviewById = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedData, error_14;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all(data.reviewData.map(function (review) { return __awaiter(_this, void 0, void 0, function () {
                                var userId, name;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            userId = review.userId;
                                            return [4 /*yield*/, repository.getNameById(userId)];
                                        case 1:
                                            name = _a.sent();
                                            return [2 /*return*/, __assign(__assign({}, review), { name: name })];
                                    }
                                });
                            }); }))];
                    case 1:
                        updatedData = _a.sent();
                        return [2 /*return*/, updatedData];
                    case 2:
                        error_14 = _a.sent();
                        console.error('Error while fetching names by user ID:', error_14);
                        throw new Error('Could not attach names to reviews.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.updateUserDetails = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var datatoUpdate, response, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        datatoUpdate = data.formData;
                        return [4 /*yield*/, repository.updateUser(datatoUpdate)];
                    case 1:
                        response = _a.sent();
                        console.log(response);
                        if (!response) {
                            return [2 /*return*/, { success: false, status: Enums_1.StatusCode.Conflict, message: "No response. Error occured while updating tutor details." }];
                        }
                        return [2 /*return*/, { success: true, status: Enums_1.StatusCode.Accepted, message: "Tutor details updated successfuly." }];
                    case 2:
                        error_15 = _a.sent();
                        return [2 /*return*/, { success: false, status: Enums_1.StatusCode.Conflict, message: "Error occured while updating tutor details." }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.attachMessageById = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedData, error_16;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log(data, 'ata from service');
                        return [4 /*yield*/, Promise.all(data.messages.map(function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                var userId, name;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            userId = msg.userId;
                                            return [4 /*yield*/, repository.getNameById(userId)];
                                        case 1:
                                            name = _a.sent();
                                            return [2 /*return*/, __assign(__assign({}, msg), { name: name })];
                                    }
                                });
                            }); }))];
                    case 1:
                        updatedData = _a.sent();
                        return [2 /*return*/, updatedData];
                    case 2:
                        error_16 = _a.sent();
                        console.error('Error while fetching names by user ID:', error_16);
                        throw new Error('Could not attach names to reviews.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.fetchUsersByIds = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var studentIds, users, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        studentIds = data.studentIds;
                        return [4 /*yield*/, repository.getUsersByIds(studentIds)];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, users];
                    case 2:
                        error_17 = _a.sent();
                        console.error('Error while fetching users by ids', error_17);
                        throw new Error('Could not attach names to reviews.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
