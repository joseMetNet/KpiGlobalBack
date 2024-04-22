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
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'TB_Profile',
  timestamps: false
});

Profile.hasMany(ProfileTranslation, {
  sourceKey: 'id',
  foreignKey: 'profileId'
});
