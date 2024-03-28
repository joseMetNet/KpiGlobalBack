import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

export class Answer extends Model {
	declare id: number;
	declare user_id: number;
	declare question_id: number;
	declare answer_question_id: number;
	declare profile_id: number;
}

Answer.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	profile_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	question_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	answer_option_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
}, {
	sequelize,
	tableName: 'TB_User_Answer',
	timestamps: false
});
