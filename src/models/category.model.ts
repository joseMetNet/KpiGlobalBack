import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { CategoryTranslation } from './category-translation.model';
import { Question } from './question.model';

export class Category extends Model {
  declare id: number;
  declare categoryTranslationId: number;
}

Category.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
}, {
  sequelize,
  tableName: 'TB_Category',
  timestamps: false
});

Category.hasMany(CategoryTranslation, {
  sourceKey: 'id',
  foreignKey: 'categoryId'
});

Category.hasMany(Question, {
  sourceKey: 'id',
  foreignKey: 'categoryId'
});
