import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';
import { Language } from './language.model';

export class ProfileTranslation extends Model {
  declare id: number;
  declare languageId: number;
  declare profile: string;
  declare description: string;
  declare videoUrl: string;
}

ProfileTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  languageId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  profile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'TB_ProfileTranslation',
  timestamps: false
});

ProfileTranslation.hasOne(Language, {
  sourceKey: 'languageId',
  foreignKey: 'id'
});
