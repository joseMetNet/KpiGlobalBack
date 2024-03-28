import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

export class ProfileQuestionAnswer extends Model {
	declare id: number;
	declare profile_id: number;
	declare question_id: number;
	declare answer_option_id: number;
}

ProfileQuestionAnswer.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
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
	tableName: 'TB_Profile_Question_Answer',
	timestamps: false
});
