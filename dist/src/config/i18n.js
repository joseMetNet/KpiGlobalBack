"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("i18n"));
i18n_1.default.configure({
    locales: ['en', 'es'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    queryParameter: 'lang',
    register: global,
    objectNotation: true, // Access translations using object notation (e.g., __("messages.welcome"))
});
exports.default = i18n_1.default;
//# sourceMappingURL=i18n.js.map