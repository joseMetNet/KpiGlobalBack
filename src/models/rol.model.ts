import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';

export class Rol extends Model {
  declare id: number;
  declare role: string;
}

Rol.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  tableName: 'TB_Rol',
  timestamps: false
});
