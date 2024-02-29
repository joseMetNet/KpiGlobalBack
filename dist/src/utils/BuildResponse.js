"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildResponse = void 0;
const example_1 = require("../interface/example");
class BuildResponse {
    status;
    data;
    constructor(status, data) {
        this.status = status;
        this.data = data;
        this.status = status;
        this.data = data;
    }
    static buildSuccessResponse(code, data) {
        return {
            code: code,
            status: example_1.StatusValue.Success,
            data: data,
        };
    }
    static buildErrorResponse(code, data) {
        return {
            code: code,
            status: example_1.StatusValue.Failed,
            data: data,
        };
    }
}
exports.BuildResponse = BuildResponse;
//# sourceMappingURL=BuildResponse.js.map