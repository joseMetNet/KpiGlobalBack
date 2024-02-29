"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../../DB/config");
const rol_model_1 = require("../model/rol.model");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    isEmailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    roleId: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 1,
        references: {
            model: rol_model_1.Rol,
            key: 'id'
        }
    },
    phone: sequelize_1.DataTypes.STRING,
    age: sequelize_1.DataTypes.STRING,
}, {
    sequelize: config_1.sequelize,
    tableName: 'TB_USER',
    timestamps: true
});
//# sourceMappingURL=user.model.js.map