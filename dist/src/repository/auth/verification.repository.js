"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCode = void 0;
const CustomError_1 = require("../../config/CustomError");
const verification_model_1 = require("../model/verification.model");
async function createCode(email) {
    try {
        const randomCode = generateRandomString();
        const status = await verification_model_1.VerificationStatus.create({
            email: email,
            code: randomCode
        });
        return status.code;
    }
    catch (e) {
        return CustomError_1.CustomError.internalServer(e.message);
    }
}
exports.createCode = createCode;
function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomArray = new Uint8Array(8);
    crypto.getRandomValues(randomArray);
    randomArray.forEach((value) => {
        result += chars[value % chars.length];
    });
    return result;
}
//# sourceMappingURL=verification.repository.js.map