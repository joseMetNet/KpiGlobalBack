import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { AnswerOption } from './answer-option.model';
import { QuestionTranslation } from './question-translation.model';
import { QuestionType } from './question-type.model';

export class Question extends Model {
  declare id: number;
  declare profileId: number;
  declare categoryId: number;
  declare questionTypeId: number;
  declare questionNumber: number;
  declare questionTranslationId: number;
}

Question.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  categoryId: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  questionNumber: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  questionTypeId: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'TB_Question',
  timestamps: false
});

Question.hasMany(AnswerOption, {
  sourceKey: 'id',
  foreignKey: 'questionId'
});

Question.hasOne(QuestionTranslation, {
  sourceKey: 'id',
  foreignKey: 'questionId'
});

Question.hasOne(QuestionType, {
  sourceKey: 'questionTypeId',
  foreignKey: 'id'
});
