import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { AnswerOptionTranslation } from './answer-option-translation.model';

export class AnswerOption extends Model {
  declare id: number;
  declare questionId: number;
  declare answerOptionTranslationId: number;
}

AnswerOption.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'TB_AnswerOption',
  timestamps: false
});

AnswerOption.hasMany(AnswerOptionTranslation, {
  sourceKey: 'id',
  foreignKey: 'answerOptionId'
});
