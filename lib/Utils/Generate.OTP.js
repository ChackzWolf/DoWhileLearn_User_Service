"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
var generateOTP = function () {
    var otp = Math.floor(1000 + Math.random() * 9000).toString();
    return otp;
};
exports.generateOTP = generateOTP;
