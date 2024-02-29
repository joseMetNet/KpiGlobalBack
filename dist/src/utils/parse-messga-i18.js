"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessageI18n = void 0;
const parseMessageI18n = (message, req) => {
    //validate message is object
    if (typeof message === 'object') {
        const { translationKey, translationParams } = message;
        return req.__(translationKey, translationParams);
    }
    return req.__(message);
};
exports.parseMessageI18n = parseMessageI18n;
//# sourceMappingURL=parse-messga-i18.js.map