import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';

export class UserAnswer extends Model {
  declare id: number;
  declare userId: number;
  declare questionId: number;
  declare answerOptionId: number;
  declare openAnswerText: string;
}

UserAnswer.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  answerOptionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  openAnswerText: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'TB_UserAnswer',
  timestamps: false
});

UserAnswer.removeAttribute('id');
