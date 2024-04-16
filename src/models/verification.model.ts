import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';

export class VerificationStatus extends Model {
  declare id: number;
  declare code: string;
  declare email: string;
}

VerificationStatus.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  tableName: 'TB_VerificationStatus',
  timestamps: true
});

VerificationStatus.removeAttribute('id');
