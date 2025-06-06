"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var ENV_configs_1 = require("../Configs/ENV_configs/ENV.configs");
dotenv_1.default.config();
var JWT_SECRET = ENV_configs_1.configs.JWT_SECRET;
var REFRESH_TOKEN_SECRET = ENV_configs_1.configs.REFRESH_TOKEN_SECRET;
if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environmental variables. ");
}
var JWT = /** @class */ (function () {
    function JWT() {
    }
    JWT.prototype.createToken = function (user) {
        var accessToken = jsonwebtoken_1.default.sign({
            id: user._id,
            role: "USER",
            email: user.email,
        }, JWT_SECRET, { expiresIn: ENV_configs_1.configs.JWT_EXPIRATION_TIME });
        var refreshToken = jsonwebtoken_1.default.sign({
            id: user._id,
            role: "USER",
            email: user.email,
        }, REFRESH_TOKEN_SECRET, { expiresIn: ENV_configs_1.configs.REFRESH_TOKEN_EXPIRATION_TIME });
        return { accessToken: accessToken, refreshToken: refreshToken };
    };
    return JWT;
}());
exports.JWT = JWT;
