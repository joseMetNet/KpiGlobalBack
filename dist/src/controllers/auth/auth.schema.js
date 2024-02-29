"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserSchema = exports.authSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string(),
    password: zod_1.z.string()
});
exports.authSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.verifyUserSchema = zod_1.z.object({
    code: zod_1.z.string().length(8),
    email: zod_1.z.string()
});
//# sourceMappingURL=auth.schema.js.map