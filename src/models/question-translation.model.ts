import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { Language } from './language.model';
import { Profile } from './profile.model';

export class QuestionTranslation extends Model {
  declare id: number;
  declare languageId: number;
  declare question: string;
}

QuestionTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  languageId: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  profileId: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'TB_QuestionTranslation',
  timestamps: false
});

QuestionTranslation.hasOne(Language, {
  sourceKey: 'languageId',
  foreignKey: 'id'
});

QuestionTranslation.hasOne(Profile, {
  sourceKey: 'profileId',
  foreignKey: 'id'
});
