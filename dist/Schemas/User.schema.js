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
exports.TempUser = exports.Otp = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var ENV_configs_1 = require("../Configs/ENV_configs/ENV.configs");
// Create the schema
var UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
    },
    isblocked: {
        type: Boolean,
        default: false
    },
    purchasedCourses: [{
            courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
            progress: { type: Number, default: 0 },
            currentLesson: {
                module: { type: Number },
                lesson: { type: Number },
            },
            completedLessons: [{
                    module: { type: Number },
                    lesson: { type: Number },
                    noTest: { type: Boolean, default: false },
                    testCompleted: { type: Boolean, default: false } // ✅ NEW: Tracks if test was passed
                }],
            completed: { type: Boolean, default: false },
            lastAccessed: { type: Date, default: Date.now }
        }],
    cart: [{
            type: mongoose_1.Schema.Types.ObjectId,
        }],
    wishlist: [{
            type: mongoose_1.Schema.Types.ObjectId,
        }],
    certifications: [{
            courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
            title: { type: String, required: true },
            issueDate: { type: Date, default: Date.now },
            certificateUrl: { type: String, required: true }
        }],
    isVerified: {
        type: Boolean,
        default: true
    },
    badges: [{
            title: { type: String, required: true },
            issueDate: { type: Date, default: Date.now },
            Url: { type: String, required: true }
        }],
    socialLinks: {
        github: { type: String },
        linkedIn: { type: String },
        leetCode: { type: String },
        codeChef: { type: String },
        codeForce: { type: String },
        hackerRank: { type: String },
        stackOverflow: { type: String }
    }
}, {
    timestamps: true
});
var TempUserShcema = new mongoose_1.Schema({
    userData: {
        type: Object,
        require: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900 // expires after 15 minutes
    }
}, {
    timestamps: true,
});
var otpSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});
UserSchema.methods.toggleBlockStatus = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.isblocked = !this.isblocked; // Toggle the blocked status
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent(); // Save the updated document
                    return [2 /*return*/];
            }
        });
    });
};
UserSchema.methods.unblock = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.isblocked = false;
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
UserSchema.methods.block = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.isblocked = true;
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Hash password
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!this.isModified("password")) {
                        next();
                    }
                    _a = this;
                    return [4 /*yield*/, bcryptjs_1.default.hash(this.password || "", 10)];
                case 1:
                    _a.password = _b.sent();
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
// sign access token
UserSchema.methods.SignAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id, role: this.role }, ENV_configs_1.configs.JWT_SECRET, {
        expiresIn: ENV_configs_1.configs.JWT_EXPIRATION_TIME,
    });
};
// sign refresh token
UserSchema.methods.SignRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id, role: this.role }, ENV_configs_1.configs.REFRESH_TOKEN_SECRET, {
        expiresIn: ENV_configs_1.configs.REFRESH_TOKEN_EXPIRATION_TIME,
    });
};
// compare password 
UserSchema.methods.comparePassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcryptjs_1.default.compare(enteredPassword, this.password)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.Otp = mongoose_1.default.model("setOTP", otpSchema);
exports.TempUser = mongoose_1.default.model("TempUserData", TempUserShcema);
var UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
