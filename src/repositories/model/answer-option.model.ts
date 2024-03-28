import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

export class AnswerOption extends Model {
	declare id: number;
	declare question_id: number;
	declare answer_option: string;
}

AnswerOption.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	question_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	answer_option: {
		type: DataTypes.STRING,
		allowNull: false
	},
}, {
	sequelize,
	tableName: 'TB_Answer_Option',
	timestamps: false
});
