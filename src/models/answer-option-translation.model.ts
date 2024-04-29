import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';

export class AnswerOptionTranslation extends Model {
  declare id: number;
  declare languageId: number;
  declare answerOption: string;
}

AnswerOptionTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  languageId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  answerOptionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  answerOption: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'TB_AnswerOptionTranslation',
  timestamps: false
});
