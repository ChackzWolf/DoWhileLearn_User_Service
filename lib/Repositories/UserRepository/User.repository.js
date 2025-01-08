"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var User_schema_1 = __importStar(require("../../Schemas/User.schema"));
var Base_repository_1 = require("../BaseRepository/Base.repository");
var mongodb_1 = require("mongodb");
var Enums_1 = require("../../Interfaces/Enums/Enums");
var userRepository = /** @class */ (function (_super) {
    __extends(userRepository, _super);
    function userRepository() {
        return _super.call(this, User_schema_1.default) || this;
    }
    userRepository.prototype.findByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error finding user by email: ".concat(error_1));
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.getUsersByIds = function (studentIds) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_schema_1.default.find({ _id: { $in: studentIds } })];
                    case 1: return [2 /*return*/, _a.sent()]; // Assuming `User` is your Mongoose model
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error in getUsersByIds:', error_2.message);
                        throw new Error('Failed to fetch users by IDs');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.findByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.findOne({ email: email })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                    case 2:
                        err_1 = _a.sent();
                        console.error("Error finding user by email: ".concat(err_1));
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.createTempUser = function (tempUserData) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, otp, createdAt, createdTempData, savedUser, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userData = tempUserData.userData, otp = tempUserData.otp, createdAt = tempUserData.createdAt;
                        createdTempData = new User_schema_1.TempUser({
                            userData: userData,
                            otp: otp,
                            createdAt: createdAt || new Date()
                        });
                        return [4 /*yield*/, createdTempData.save()];
                    case 1:
                        savedUser = _a.sent();
                        return [2 /*return*/, savedUser];
                    case 2:
                        err_2 = _a.sent();
                        console.error("Error creating temporary user data", err_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.updateUser = function (dataToUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_schema_1.default.findByIdAndUpdate(dataToUpdate._id, {
                                $set: {
                                    firstName: dataToUpdate.firstName,
                                    lastName: dataToUpdate.lastName,
                                    email: dataToUpdate.email,
                                    phoneNumber: dataToUpdate.phoneNumber,
                                    bio: dataToUpdate.bio,
                                    profilePicture: dataToUpdate.profilePicture,
                                },
                            }, { new: true, runValidators: true } // Returns updated document & applies schema validations
                            )];
                    case 1:
                        updatedUser = _a.sent();
                        if (!updatedUser) {
                            throw new Error('user not found');
                        }
                        return [2 /*return*/, updatedUser];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error updating tutor:", error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var firstName, lastName, email, password, savedUser, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        firstName = userData.firstName, lastName = userData.lastName, email = userData.email, password = userData.password;
                        return [4 /*yield*/, this.create({
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                password: password,
                                //defaults
                                profilePicture: "",
                                phoneNumber: "",
                                bio: "",
                                isblocked: false,
                                purchasedCourses: [],
                                cart: [],
                                wishlist: []
                            })];
                    case 1:
                        savedUser = _a.sent();
                        return [2 /*return*/, savedUser];
                    case 2:
                        err_3 = _a.sent();
                        console.error("Error creating user:", err_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.blockUnblock = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, { success: false, message: "User not found." }];
                        }
                        // await user.toggleBlockStatus();
                        user.isblocked = !user.isblocked;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: "User ".concat(user.isblocked ? 'blocked' : "Unblocked", " successfully") }];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error toggling user block status:', error_4);
                        return [2 /*return*/, { success: false, message: 'An error occurred' }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.findAll()];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, users];
                    case 2:
                        err_4 = _a.sent();
                        console.error("error getting users: ", err_4);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.toggleCourseInCart = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, courseObjId_1, courseInCart, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 6];
                        courseObjId_1 = new mongodb_1.ObjectId(courseId);
                        courseInCart = user.cart.includes(courseObjId_1);
                        console.log(user.cart, ': user cart');
                        console.log(courseId, ": course id");
                        if (!courseInCart) return [3 /*break*/, 3];
                        console.log('includes in cart');
                        user.cart = user.cart.filter(function (id) { return !id.equals(courseObjId_1); });
                        console.log(user.cart, 'cart after changes removing');
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: courseInCart ? 'Course removed from cart' : 'Course added to cart', inCart: user.cart.includes(courseObjId_1), success: true }];
                    case 3:
                        console.log('not include incart');
                        user.cart.push(courseObjId_1);
                        return [4 /*yield*/, user.save()];
                    case 4:
                        _a.sent();
                        console.log(user.cart, 'cart after changes adding');
                        return [2 /*return*/, { message: courseInCart ? 'Course removed from cart' : 'Course added to cart', inCart: user.cart.includes(courseObjId_1), success: true }];
                    case 5: return [3 /*break*/, 7];
                    case 6: throw new Error('Failed to find user');
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_5 = _a.sent();
                        console.error('Error toggling course in cart:', error_5);
                        throw new Error('Failed to update cart');
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.CheckIfInCart = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, courseObjectId, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('trigg');
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('User not found');
                        }
                        console.log(user.cart, 'user cart');
                        courseObjectId = new mongodb_1.ObjectId(courseId);
                        return [2 /*return*/, { inCart: user.cart.includes(courseObjectId) }]; // Return true if user is found, false otherwise
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error checking if course is in cart:', error_6);
                        throw new Error('Failed to check cart status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.addToPurchaseList = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var courseObjectId, user, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        courseObjectId = new mongodb_1.ObjectId(courseId);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        console.log('user', user, 'userdata while adding');
                        if (!user) return [3 /*break*/, 5];
                        console.log('user found while adding.');
                        if (!!user.purchasedCourses.includes(courseObjectId)) return [3 /*break*/, 3];
                        user.purchasedCourses.push(courseObjectId);
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Course added to Purchase List', success: true }];
                    case 3: return [2 /*return*/, { message: 'Course already in purchase list', success: true }];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.log('user no tofund while adding purchase list');
                        return [2 /*return*/, { message: 'User not found.', success: false }];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_7 = _a.sent();
                        console.error('Error toggling course in cart:', error_7);
                        throw new Error('Failed to update cart');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.removeFromPurchaseList = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var courseObjectId_1, user, courseIndex, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        courseObjectId_1 = new mongodb_1.ObjectId(courseId);
                        console.log(userId, 'userId');
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        console.log(user, 'user');
                        if (!user) return [3 /*break*/, 5];
                        console.log('User found:', user);
                        courseIndex = user.purchasedCourses.findIndex(function (course) { return course.equals(courseObjectId_1); });
                        if (!(courseIndex === -1)) return [3 /*break*/, 2];
                        // Course not in list, so add it
                        console.log('Purchased course is empty.');
                        return [2 /*return*/, { message: 'Purchased course is empty.', success: false }];
                    case 2:
                        // Course is in the list, so remove it
                        console.log('Course already in user purchase list. Removing course.');
                        user.purchasedCourses.splice(courseIndex, 1);
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: 'Course removed from Purchase List', success: true }];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.log('user not found');
                        return [2 /*return*/, { message: 'User not found.', success: false }];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_8 = _a.sent();
                        console.error('Error updating purchase list:', error_8);
                        throw new Error('Failed to update purchase list');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.CourseStatus = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var courseObjectId, user, cart, purchaseList, wishlist, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        courseObjectId = new mongodb_1.ObjectId(courseId);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('User not found');
                        }
                        console.log(user.cart, "user cart");
                        console.log(courseId, 'course Id');
                        cart = user.cart.includes(courseObjectId);
                        console.log(cart, 'cart status');
                        purchaseList = user.purchasedCourses.includes(courseObjectId);
                        wishlist = user.wishlist.includes(courseObjectId);
                        return [2 /*return*/, { inCart: !!cart, inPurchase: !!purchaseList, inWishlist: !!wishlist }];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error checking if course is in cart:', error_9);
                        throw new Error('Failed to check user course status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.getCartItems = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, cartItems, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('User not found');
                        }
                        return [4 /*yield*/, User_schema_1.default.findById(userId).select('cart').lean()];
                    case 2:
                        cartItems = _a.sent();
                        console.log(user.cart, "user cart");
                        if (!cartItems) {
                            throw new Error("User not found");
                        }
                        console.log(cartItems.cart, 'cart items');
                        return [2 /*return*/, cartItems.cart || []];
                    case 3:
                        error_10 = _a.sent();
                        console.error("Error fetching cart items:", error_10);
                        throw new Error('Failed to retrieve cart items');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.isBlocked = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_schema_1.default.findById(userId)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user === null || user === void 0 ? void 0 : user.isblocked];
                    case 2:
                        error_11 = _a.sent();
                        throw new Error("User not found");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.passwordChange = function (userId, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, { message: 'User not found!', success: false, status: Enums_1.StatusCode.NotFound }];
                        }
                        // Ensure password is hashed before saving (if necessary)
                        user.password = newPassword;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent(); // Save the updated user with the new password
                        return [2 /*return*/, { message: 'Password updated successfully!', success: true, status: Enums_1.StatusCode.OK }];
                    case 3:
                        error_12 = _a.sent();
                        throw new Error("User not found");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.storeOTP = function (email, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var expiresAt, otpEntry, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        expiresAt = new Date(Date.now() + 5 * 60 * 1000);
                        return [4 /*yield*/, User_schema_1.Otp.findOneAndUpdate({ email: email }, // Find the entry with the same email
                            { otp: otp, expiresAt: expiresAt }, // Update the OTP and expiration time
                            { new: true, upsert: true } // Options: return the updated document and create if it doesn't exist
                            )];
                    case 1:
                        otpEntry = _a.sent();
                        console.log(otpEntry, 'otpentry');
                        return [2 /*return*/, otpEntry._id];
                    case 2:
                        error_13 = _a.sent();
                        throw new Error("User not found");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.updateStoredOTP = function (otpId, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var otpEntry, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_schema_1.Otp.findOneAndUpdate({ _id: otpId }, // Find by otpId
                            { otp: otp }, // Update the OTP and expiration time
                            { new: true, upsert: true } // Return updated doc, create if not exists
                            )];
                    case 1:
                        otpEntry = _a.sent();
                        if (!otpEntry) {
                            throw new Error('Failed to update or create OTP entry.');
                        }
                        return [2 /*return*/, otpEntry];
                    case 2:
                        error_14 = _a.sent();
                        console.error('Error updating OTP entry:', error_14);
                        throw error_14; // Optionally rethrow the error for higher-level handling
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    userRepository.prototype.verifyOTP = function (email, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var otpEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_schema_1.Otp.findOne({ email: email, otp: otp, expiresAt: { $gt: new Date() } })];
                    case 1:
                        otpEntry = _a.sent();
                        return [2 /*return*/, otpEntry !== null];
                }
            });
        });
    };
    userRepository.prototype.getNameById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, name, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            console.log("User not found with ID: ".concat(userId));
                            return [2 /*return*/, "Unknown User"];
                        }
                        name = "".concat(user.firstName, " ").concat(user.lastName);
                        console.log(name, 'retrieved user name');
                        return [2 /*return*/, name];
                    case 2:
                        error_15 = _a.sent();
                        console.error('Error fetching user by ID:', error_15);
                        return [2 /*return*/, "Unknown User"];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return userRepository;
}(Base_repository_1.BaseRepository));
;
exports.default = userRepository;
