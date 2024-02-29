"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = exports.StatusValue = void 0;
var StatusValue;
(function (StatusValue) {
    StatusValue["Failed"] = "FAILED";
    StatusValue["Success"] = "SUCCESS";
})(StatusValue || (exports.StatusValue = StatusValue = {}));
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["Ok"] = 200] = "Ok";
    StatusCode[StatusCode["ResourceCreated"] = 201] = "ResourceCreated";
    StatusCode[StatusCode["BadRequest"] = 400] = "BadRequest";
    StatusCode[StatusCode["Unauthorized"] = 401] = "Unauthorized";
    StatusCode[StatusCode["Forbidden"] = 403] = "Forbidden";
    StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
    StatusCode[StatusCode["Conflict"] = 409] = "Conflict";
    StatusCode[StatusCode["ResourceExhausted"] = 429] = "ResourceExhausted";
    StatusCode[StatusCode["InternalErrorServer"] = 500] = "InternalErrorServer";
    StatusCode[StatusCode["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    StatusCode[StatusCode["GatewayTimeout"] = 504] = "GatewayTimeout"; // Deadline exceeded (retry your request).
})(StatusCode || (exports.StatusCode = StatusCode = {}));
//# sourceMappingURL=example.js.map