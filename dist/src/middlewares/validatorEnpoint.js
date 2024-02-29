"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnpoint = void 0;
const express_validator_1 = require("express-validator");
const example_1 = require("../interface/example");
const validateEnpoint = (req, res, next) => {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const data = error.mapped();
        return res
            .status(example_1.StatusCode.BadRequest)
            .json({ status: example_1.StatusValue.Failed, data: { error: data } });
    }
    next();
};
exports.validateEnpoint = validateEnpoint;
//# sourceMappingURL=validatorEnpoint.js.map