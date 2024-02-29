"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const example_1 = require("../interface/example");
class CustomError extends Error {
    statusCode;
    message;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
    static badRequest(message) {
        return new CustomError(example_1.StatusCode.BadRequest, message);
    }
    static unauthorized(message) {
        return new CustomError(example_1.StatusCode.Unauthorized, message);
    }
    static forbidden(message) {
        return new CustomError(example_1.StatusCode.Forbidden, message);
    }
    static notFound(message) {
        return new CustomError(example_1.StatusCode.NotFound, message);
    }
    static conflict(message = 'request could not be completed due to a conflict') {
        return new CustomError(example_1.StatusCode.Conflict, message);
    }
    static internalServer(message = 'Internal error server') {
        return new CustomError(example_1.StatusCode.InternalErrorServer, message);
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=CustomError.js.map