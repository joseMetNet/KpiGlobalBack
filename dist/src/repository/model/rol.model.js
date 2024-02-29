"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rol = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../../DB/config");
class Rol extends sequelize_1.Model {
}
exports.Rol = Rol;
Rol.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize: config_1.sequelize,
    tableName: 'TB_Rol',
    timestamps: false
});
//# sourceMappingURL=rol.model.js.map