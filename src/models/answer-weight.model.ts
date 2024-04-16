import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';

export class AnswerWeight extends Model {
  declare id: number;
  declare questionId: number;
  declare answerOptionId: number;
  declare weight: number;
  declare value: number;
}

AnswerWeight.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  answerOptionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'TB_Weights',
  timestamps: false
});
