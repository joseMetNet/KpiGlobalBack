"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./src/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
require("colors");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const routes_1 = require("./src/routes");
const i18n_1 = __importDefault(require("./src/config/i18n"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
class Server {
    app;
    port;
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.config.APP_PORT;
        this.initializeSwagger();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.static('public'));
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, express_fileupload_1.default)({
            useTempFiles: true,
            tempFileDir: './tmp/',
            createParentPath: true,
        }));
        this.app.use(i18n_1.default.init);
        this.app.disable('x-powered-by');
    }
    initializeSwagger() {
        const configSwagger = (0, swagger_jsdoc_1.default)(config_1.swaggerOptions);
        this.app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(configSwagger));
    }
    routes() {
        (0, routes_1.authRoutes)(this.app);
    }
    listen() {
        console.clear();
        this.app.listen(this.port, () => {
            console.log(` 🔥 Server in port ${this.port}`.bold);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map