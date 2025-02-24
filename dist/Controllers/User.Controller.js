"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var Kafka_config_1 = require("../Configs/Kafka.configs/Kafka.config");
var UserController = /** @class */ (function () {
    function UserController(userService) {
        this.userService = userService;
    }
    UserController.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var topics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        topics = [
                            'user.update',
                            'user-service.rollback'
                        ];
                        return [4 /*yield*/, Kafka_config_1.kafkaConfig.consumeMessages('user-service-group', topics, this.routeMessage.bind(this))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.routeMessage = function (_topics, message, topic) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = topic;
                        switch (_a) {
                            case 'user.update': return [3 /*break*/, 1];
                            case 'user-service.rollback': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.handleMessage(message)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.handleRollback(message)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        console.warn("Unhandled topic: ".concat(topic));
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _b.sent();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // checking order  success or fail
    UserController.prototype.handleMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentEvent, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        paymentEvent = JSON.parse(((_a = message.value) === null || _a === void 0 ? void 0 : _a.toString()) || '');
                        console.log('START', paymentEvent, 'MESAGe haaha');
                        return [4 /*yield*/, this.userService.addToPurchaseList(paymentEvent)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Error processing message:', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // checking order  success or fail
    UserController.prototype.handleRollback = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentEvent, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        paymentEvent = JSON.parse(((_a = message.value) === null || _a === void 0 ? void 0 : _a.toString()) || '');
                        console.log('ROLE BACK KICKED', paymentEvent, 'MESAGe haaha');
                        return [4 /*yield*/, this.userService.deleteFromPurchaseList(paymentEvent.data)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Error processing message:', error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.googleAuth = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('auth request from controller', call.request);
                        data = call.request;
                        console.log(data);
                        return [4 /*yield*/, this.userService.googleAuthentication(data)];
                    case 1:
                        response = _a.sent();
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        callback(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.signup = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userData = call.request;
                        return [4 /*yield*/, this.userService.userRegister(userData)];
                    case 1:
                        response = _a.sent();
                        if (response.success) {
                            callback(null, { success: true, msg: "OTP sent", tempId: response.tempId, email: response.email });
                        }
                        else {
                            callback(null, { success: false, msg: "Email already exists." });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        callback(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.verifyOtp = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = call.request;
                        return [4 /*yield*/, this.userService.VerifyOtp(data)];
                    case 1:
                        response = _a.sent();
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        callback(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.resendOtp = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = call.request;
                        return [4 /*yield*/, this.userService.ResendOTP(data)];
                    case 1:
                        response = _a.sent();
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        callback(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.userLogin = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('trig', call.request);
                        data = call.request;
                        return [4 /*yield*/, this.userService.userLogin(data)];
                    case 1:
                        response = _a.sent();
                        console.log(response, 'response from controller ');
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        callback(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.blockUnblock = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = call.request;
                        console.log(userId, 'controller');
                        return [4 /*yield*/, this.userService.blockUnblock(userId)];
                    case 1:
                        response = _a.sent();
                        callback(null, response); // Pass response to callback
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        callback(error_7); // Pass error to callback
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.fetchUserById = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = call.request;
                        console.log('trig fetchdata by userId form contoller', data);
                        return [4 /*yield*/, this.userService.getUserById(data)];
                    case 1:
                        response = _a.sent();
                        console.log(response, 'response from controller (fetchUserById)');
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        callback(error_8); // Pass error to callback
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.fetchStudents = function (_call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('triggerd');
                        return [4 /*yield*/, this.userService.fetchStudents()];
                    case 1:
                        response = _a.sent();
                        console.log(response, 'response from controller');
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        callback(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateUserDetails = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('triggered user details update.', call.request);
                        data = call.request;
                        return [4 /*yield*/, this.userService.updateUserDetails(data)];
                    case 1:
                        response = _a.sent();
                        console.log(response, "response from controller.");
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        throw new Error("error from controller fetching tutor details");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.addToCart = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = call.request;
                        return [4 /*yield*/, this.userService.addToCart(data)];
                    case 1:
                        response = _a.sent();
                        console.log(response, 'response from controller');
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        callback(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.isInCart = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = call.request;
                        return [4 /*yield*/, this.userService.isInCart(data)];
                    case 1:
                        response = _a.sent();
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.courseStatus = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = call.request;
                        return [4 /*yield*/, this.userService.checkCourseStatus(data)];
                    case 1:
                        response = _a.sent();
                        console.log(response, 'response form checking course status');
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        callback(error_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.getCartItems = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('trug');
                        data = call.request;
                        console.log(data, 'data form controller');
                        return [4 /*yield*/, this.userService.getCartItems(data)];
                    case 1:
                        response = _a.sent();
                        console.log(response);
                        callback(null, { success: response.success, courseIds: response.cart });
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        callback(error_11);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.isBlocked = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('isBlocked trig');
                        data = call.request;
                        console.log(data);
                        return [4 /*yield*/, this.userService.checkIsBlocked(data)];
                    case 1:
                        response = _a.sent();
                        console.log(response, 'response from controller');
                        callback(null, { isBlocked: response.isBlocked });
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        callback(error_12);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.resetPassword = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('trig respassword controller');
                        data = call.request;
                        return [4 /*yield*/, this.userService.resetPassword(data)];
                    case 1:
                        response = _a.sent();
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        callback(error_13);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.sendOtpToEmail = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('trig to otp email send controller ', call.request);
                        data = call.request;
                        return [4 /*yield*/, this.userService.sendEmailOtp(data)];
                    case 1:
                        response = _a.sent();
                        console.log('reseponse from controller', response);
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        callback(error_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.resendOtpToEmail = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('trig to resend otp email send controller ', call.request);
                        data = call.request;
                        return [4 /*yield*/, this.userService.resendEmailOtp(data)];
                    case 1:
                        response = _a.sent();
                        console.log('reseponse from controller', response);
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _a.sent();
                        callback(error_15);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.VerifyEnteredOTP = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('trig', call.request);
                        data = call.request;
                        return [4 /*yield*/, this.userService.resetPasswordVerifyOTP(data)];
                    case 1:
                        response = _a.sent();
                        console.log(response, 'response from controller');
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _a.sent();
                        callback(error_16);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.linkNameToReview = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, reviewData, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("vann");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('trig review fetch', call.request);
                        data = call.request;
                        return [4 /*yield*/, this.userService.attachReviewById(data)];
                    case 2:
                        response = _a.sent();
                        console.log(response, 'this is the response');
                        reviewData = response;
                        callback(null, { reviewData: reviewData });
                        return [3 /*break*/, 4];
                    case 3:
                        error_17 = _a.sent();
                        callback(error_17);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.linkNameToMessages = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, messageData, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("vann");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('trig message fetch', call.request);
                        data = call.request;
                        return [4 /*yield*/, this.userService.attachMessageById(data)];
                    case 2:
                        response = _a.sent();
                        console.log(response, 'this is the response');
                        messageData = {
                            courseId: data.courseId,
                            messages: response,
                        };
                        callback(null, messageData);
                        return [3 /*break*/, 4];
                    case 3:
                        error_18 = _a.sent();
                        callback(error_18);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.fetchUsersByIds = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('triggered fetch users by ids', call.request);
                        data = call.request;
                        return [4 /*yield*/, this.userService.fetchUsersByIds(data)];
                    case 1:
                        response = _a.sent();
                        console.log(response);
                        callback(null, { users: response });
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        callback(error_19);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateCurrentLesson = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = call.request;
                        return [4 /*yield*/, this.userService.updateCurrentLesson(data)];
                    case 1:
                        response = _a.sent();
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_20 = _a.sent();
                        callback(error_20);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateCompletedLesson = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = call.request;
                        return [4 /*yield*/, this.userService.updateCompletedLesson(data)];
                    case 1:
                        response = _a.sent();
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _a.sent();
                        callback(error_21);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.fetchUserCertificate = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = call.request;
                        return [4 /*yield*/, this.userService.getCertificate(data)];
                    case 1:
                        response = _a.sent();
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_22 = _a.sent();
                        callback(error_22);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.test = function (_call, callback) {
        console.log('test');
        callback(null, { success: true });
    };
    return UserController;
}());
exports.UserController = UserController;
