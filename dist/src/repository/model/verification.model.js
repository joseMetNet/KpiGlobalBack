"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationStatus = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../../DB/config");
const user_model_1 = require("../user/user.model");
class VerificationStatus extends sequelize_1.Model {
}
exports.VerificationStatus = VerificationStatus;
VerificationStatus.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        references: {
            model: user_model_1.User,
            key: 'email'
        }
    },
}, {
    sequelize: config_1.sequelize,
    tableName: 'TB_VerificationStatus',
    timestamps: true
});
VerificationStatus.removeAttribute('id');
//# sourceMappingURL=verification.model.js.map