import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

export class Category extends Model {
	declare id: number;
	declare category: string;
}

Category.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	category: {
		type: DataTypes.STRING,
		allowNull: false
	},
}, {
	sequelize,
	tableName: 'TB_Category',
	timestamps: false
});
