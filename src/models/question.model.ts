import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { Profile } from './profile.model';
import { AnswerOption } from './answer-option.model';
import { QuestionTranslation } from './question-translation.model';

export class Question extends Model {
  declare id: number;
  declare profileId: number;
  declare categoryId: number;
  declare questionNumber: number;
  declare questionTranslationId: number;
}

Question.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  profileId: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  questionNumber: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  questionTranslationId: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'TB_Question',
  timestamps: false
});

Question.hasOne(Profile, {
  sourceKey: 'profileId',
  foreignKey: 'id'
});

Question.hasMany(AnswerOption, {
  sourceKey: 'id',
  foreignKey: 'questionId'
});

Question.hasOne(QuestionTranslation, {
  sourceKey: 'questionTranslationId',
  foreignKey: 'id'
});
