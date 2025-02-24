"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPService = void 0;
var OTPService = /** @class */ (function () {
    function OTPService() {
    }
    OTPService.prototype.generateOTP = function () {
        var otp = Math.floor(1000 + Math.random() * 9000).toString();
        return otp;
    };
    ;
    return OTPService;
}());
exports.OTPService = OTPService;
