import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

export class CategoryTranslation extends Model {
  declare id: number;
  declare languageId: number;
  declare category: string;
}

CategoryTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  languageId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'TB_CategoryTranslation',
  timestamps: false
});
