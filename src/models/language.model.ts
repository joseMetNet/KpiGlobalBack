import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';

export class Language extends Model {
  declare id: number;
  declare language: string;
}

Language.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  tableName: 'TB_Language',
  timestamps: false
});
