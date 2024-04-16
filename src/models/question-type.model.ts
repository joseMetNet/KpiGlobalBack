import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';

export class QuestionType extends Model {
  declare id: number;
  declare type: string;
  declare multiple: string;
}

QuestionType.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  multiple: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'TB_QuestionType',
  timestamps: false
});
