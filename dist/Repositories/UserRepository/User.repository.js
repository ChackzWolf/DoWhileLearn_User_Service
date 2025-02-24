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
// import { ObjectId } from 'mongoose';
var mongodb_1 = require("mongodb");
var Enums_1 = require("../../Interfaces/Enums/Enums");
var UserRepository = /** @class */ (function (_super) {
    __extends(UserRepository, _super);
    function UserRepository() {
        return _super.call(this, User_schema_1.default) || this;
    }
    UserRepository.prototype.findByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            console.error("User not found with id: ".concat(userId));
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, user];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error finding user by id: ".concat(error_1));
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.getUsersByIds = function (studentIds) {
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
    UserRepository.prototype.findByEmail = function (email) {
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
    UserRepository.prototype.createTempUser = function (tempUserData) {
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
    UserRepository.prototype.updateProfilePicById = function (userId, profilePic) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_schema_1.default.findByIdAndUpdate(userId, { $set: { profilePicture: profilePic } }, { new: true, runValidators: true })];
                    case 1:
                        updatedUser = _a.sent();
                        if (!updatedUser) {
                            throw new Error('user not found');
                        }
                        console.log(updatedUser, 'this is updated user from repo');
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
    UserRepository.prototype.updateUser = function (dataToUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser, error_4;
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
                        error_4 = _a.sent();
                        console.error("Error updating tutor:", error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.createUser = function (userData) {
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
                                profilePicture: userData.photoUrl || "",
                                phoneNumber: '',
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
    UserRepository.prototype.blockUnblock = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_5;
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
                        user.isblocked = !user.isblocked;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: "User ".concat(user.isblocked ? 'blocked' : "Unblocked", " successfully") }];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error toggling user block status:', error_5);
                        return [2 /*return*/, { success: false, message: 'An error occurred' }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.getAllUsers = function () {
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
    UserRepository.prototype.toggleCourseInCart = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, courseObjId_1, courseInCart, error_6;
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
                        error_6 = _a.sent();
                        console.error('Error toggling course in cart:', error_6);
                        throw new Error('Failed to update cart');
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.CheckIfInCart = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, courseObjectId, error_7;
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
                        error_7 = _a.sent();
                        console.error('Error checking if course is in cart:', error_7);
                        throw new Error('Failed to check cart status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.addToPurchaseList = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var courseObjectId_1, user, courseExists, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        courseObjectId_1 = new mongodb_1.ObjectId(courseId);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        console.log('User data while adding:', user);
                        if (!user) {
                            console.log('User not found while adding purchase list');
                            return [2 /*return*/, { message: 'User not found.', success: false }];
                        }
                        courseExists = user.purchasedCourses.some(function (course) { return course.courseId.equals(courseObjectId_1); });
                        if (!!courseExists) return [3 /*break*/, 3];
                        user.purchasedCourses.push({
                            courseId: courseObjectId_1,
                            progress: 0,
                            currentLesson: { module: 0, lesson: 0 },
                            completedLessons: [],
                            completed: false,
                            lastAccessed: new Date()
                        });
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Course added to Purchase List', success: true }];
                    case 3: return [2 /*return*/, { message: 'Course already in purchase list', success: true }];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_8 = _a.sent();
                        console.error('Error adding course to purchase list:', error_8);
                        throw new Error('Failed to update purchase list');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.removeFromPurchaseList = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var courseObjectId_2, user, courseIndex, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        courseObjectId_2 = new mongodb_1.ObjectId(courseId);
                        console.log(userId, 'userId');
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        console.log(user, 'user');
                        if (!user) {
                            console.log('User not found');
                            return [2 /*return*/, { message: 'User not found.', success: false }];
                        }
                        courseIndex = user.purchasedCourses.findIndex(function (course) { return course.courseId.equals(courseObjectId_2); });
                        if (courseIndex === -1) {
                            console.log('Course not found in purchase list.');
                            return [2 /*return*/, { message: 'Course not found in purchase list.', success: false }];
                        }
                        // Remove the course from purchasedCourses
                        console.log('Course found. Removing course.');
                        user.purchasedCourses.splice(courseIndex, 1);
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Course removed from Purchase List', success: true }];
                    case 3:
                        error_9 = _a.sent();
                        console.error('Error removing course from purchase list:', error_9);
                        throw new Error('Failed to update purchase list');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.CourseStatus = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var courseObjectId_3, user, inCart, inPurchase, purchasedCourseStatus, inWishlist, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        courseObjectId_3 = new mongodb_1.ObjectId(courseId);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('User not found');
                        }
                        console.log(user.cart, "user cart");
                        console.log(courseId, 'course Id');
                        inCart = user.cart.includes(courseObjectId_3);
                        console.log(inCart, 'cart status');
                        console.log(user.purchasedCourses, 'purchasedCourses');
                        inPurchase = false;
                        purchasedCourseStatus = null;
                        if (user.purchasedCourses.length > 0) {
                            purchasedCourseStatus = user.purchasedCourses.find(function (course) { return course.courseId.equals(courseObjectId_3); }) || null;
                            inPurchase = !!purchasedCourseStatus;
                        }
                        inWishlist = user.wishlist.includes(courseObjectId_3);
                        console.log(purchasedCourseStatus, '/////////////////////////////// purchased course status');
                        return [2 /*return*/, { inCart: inCart, inPurchase: inPurchase, inWishlist: inWishlist, purchasedCourseStatus: purchasedCourseStatus }];
                    case 2:
                        error_10 = _a.sent();
                        console.error('Error checking if course is in cart:', error_10);
                        throw new Error('Failed to check user course status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.updateCurrentLesson = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, courseId_1, lessonIndex, moduleIndex, user, purchasedCourse, currentLesson, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        userId = data.userId, courseId_1 = data.courseId, lessonIndex = data.lessonIndex, moduleIndex = data.moduleIndex;
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error('User not found');
                        purchasedCourse = user.purchasedCourses.find(function (course) { return course.courseId.equals(new mongodb_1.ObjectId(courseId_1)); });
                        if (!purchasedCourse)
                            throw new Error('Course not found in purchasedCourses');
                        purchasedCourse.currentLesson = { module: moduleIndex + 1, lesson: lessonIndex + 1 };
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        currentLesson = purchasedCourse.currentLesson;
                        return [2 /*return*/, currentLesson];
                    case 3:
                        error_11 = _a.sent();
                        console.log(error_11);
                        throw new Error("error updating current lesson");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.updateCompletedLesson = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, courseId_2, lessonIndex_1, moduleIndex_1, totalLessons, user, purchasedCourse, isLessonCompleted, progress, progress, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        userId = data.userId, courseId_2 = data.courseId, lessonIndex_1 = data.lessonIndex, moduleIndex_1 = data.moduleIndex, totalLessons = data.totalLessons;
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error('User not found');
                        purchasedCourse = user.purchasedCourses.find(function (course) { return course.courseId.equals(new mongodb_1.ObjectId(courseId_2)); });
                        if (!purchasedCourse)
                            throw new Error('Course not found in purchasedCourses');
                        isLessonCompleted = purchasedCourse.completedLessons.some(function (lesson) {
                            return lesson.module === moduleIndex_1 + 1 && lesson.lesson === lessonIndex_1 + 1;
                        });
                        if (!!isLessonCompleted) return [3 /*break*/, 3];
                        // Push new completed lesson
                        purchasedCourse.completedLessons.push({
                            module: moduleIndex_1 + 1,
                            lesson: lessonIndex_1 + 1,
                            noTest: false,
                            testCompleted: false,
                        });
                        progress = Math.round((purchasedCourse.completedLessons.length / totalLessons) * 100);
                        purchasedCourse.progress = progress;
                        purchasedCourse.completed = purchasedCourse.completedLessons.length >= totalLessons;
                        if (purchasedCourse.completed)
                            purchasedCourse.progress = 100;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        console.log("Lesson ".concat(lessonIndex_1, " in module ").concat(moduleIndex_1, " marked as completed."));
                        return [2 /*return*/, purchasedCourse];
                    case 3:
                        progress = Math.round((purchasedCourse.completedLessons.length / totalLessons) * 100);
                        purchasedCourse.progress = progress;
                        if (purchasedCourse.completed)
                            purchasedCourse.progress = 100;
                        return [4 /*yield*/, user.save()];
                    case 4:
                        _a.sent();
                        console.log("Lesson ".concat(lessonIndex_1, " in module ").concat(moduleIndex_1, " is already marked as completed."));
                        return [2 /*return*/, purchasedCourse];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_12 = _a.sent();
                        console.log(error_12);
                        throw new Error("error updating current lesson");
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.getCertificate = function (userId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, courseObjectId_4, certificate, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error('User not found');
                        courseObjectId_4 = new mongodb_1.ObjectId(courseId);
                        certificate = user.certifications.find(function (cert) {
                            return new mongodb_1.ObjectId(cert.courseId).equals(courseObjectId_4);
                        });
                        if (!certificate) {
                            return [2 /*return*/, { success: false }];
                        }
                        return [2 /*return*/, { certificate: certificate, success: true }];
                    case 2:
                        error_13 = _a.sent();
                        console.error('Error fetching certificate:', error_13);
                        throw new Error('Failed to get certificate');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.addCertification = function (userId, certificationData) {
        return __awaiter(this, void 0, void 0, function () {
            var courseId, title, certificateUrl, user, courseObjectId_5, existingCertificate, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        courseId = certificationData.courseId, title = certificationData.title, certificateUrl = certificationData.certificateUrl;
                        return [4 /*yield*/, this.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error('User not found');
                        courseObjectId_5 = new mongodb_1.ObjectId(courseId);
                        existingCertificate = user.certifications.find(function (cert) {
                            return new mongodb_1.ObjectId(cert.courseId).equals(courseObjectId_5);
                        });
                        if (existingCertificate)
                            throw new Error('Certificate already exists for this course');
                        // Add new certification
                        user.certifications.push({
                            courseId: courseObjectId_5,
                            title: title,
                            certificateUrl: certificateUrl,
                            issueDate: new Date()
                        });
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Certification added successfully', certification: user.certifications }];
                    case 3:
                        error_14 = _a.sent();
                        console.error('Error adding certification:', error_14);
                        throw new Error('Failed to add certification');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.getCartItems = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, cartItems, error_15;
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
                        error_15 = _a.sent();
                        console.error("Error fetching cart items:", error_15);
                        throw new Error('Failed to retrieve cart items');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.isBlocked = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_schema_1.default.findById(userId)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user === null || user === void 0 ? void 0 : user.isblocked];
                    case 2:
                        error_16 = _a.sent();
                        throw new Error("User not found");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.passwordChange = function (userId, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_17;
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
                        error_17 = _a.sent();
                        throw new Error("User not found");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.storeOTP = function (email, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var expiresAt, otpEntry, error_18;
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
                        error_18 = _a.sent();
                        throw new Error("User not found");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.updateStoredOTP = function (otpId, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var otpEntry, error_19;
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
                        error_19 = _a.sent();
                        console.error('Error updating OTP entry:', error_19);
                        throw error_19; // Optionally rethrow the error for higher-level handling
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.verifyOTP = function (email, otp) {
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
    UserRepository.prototype.getNameById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, name, error_20;
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
                        error_20 = _a.sent();
                        console.error('Error fetching user by ID:', error_20);
                        return [2 /*return*/, "Unknown User"];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserRepository;
}(Base_repository_1.BaseRepository));
;
exports.default = UserRepository;
