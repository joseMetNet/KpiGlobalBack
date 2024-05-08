import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

export class User extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phone: string | null;
  declare age: string | null;
  declare photoUrl: string | null;
  declare roleId: number;
  declare profileId: number;
  declare isRegistrationCompleted: number;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING
  },
  age: {
    type: DataTypes.STRING
  },
  photoUrl: {
    type: DataTypes.STRING
  },
  roleId: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 1,
  },
  profileId: {
    type: DataTypes.NUMBER,
  },
  isRegistrationCompleted: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize,
  tableName: 'TB_User',
  timestamps: true
});
