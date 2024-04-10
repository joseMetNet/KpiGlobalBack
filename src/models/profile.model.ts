import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { ProfileTranslation } from './profile-translation.model';

export class Profile extends Model {
  declare id: number;
  declare profileTranslationId: number;
  declare photoUrl: string;
}

Profile.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  profileTranslationId: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'TB_Profile',
  timestamps: false
});

Profile.hasOne(ProfileTranslation, {
  sourceKey: 'profileTranslationId',
  foreignKey: 'id'
});
