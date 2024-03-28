import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';
import { Profile } from './profile.model';
import { AnswerOption } from './answer-option.model';
import { Category } from './category.model';
import { Language } from './language.model';

export class Question extends Model {
	declare id: number;
	declare profile_id: number;
	declare category_id: number;
	declare question_number: number;
	declare question: string;
}

Question.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	profile_id: {
		type: DataTypes.NUMBER,
		allowNull: false,
	},
	category_id: {
		type: DataTypes.NUMBER,
		allowNull: false,
	},
	language_id: {
		type: DataTypes.NUMBER,
		allowNull: false,
	},
	question_number: {
		type: DataTypes.NUMBER,
		allowNull: false,
	},
	question: {
		type: DataTypes.STRING,
		allowNull: false
	},
}, {
	sequelize,
	tableName: 'TB_Question',
	timestamps: false
});

Question.hasOne(Profile, {
	sourceKey: 'profile_id',
	foreignKey: 'id'
});

Question.hasMany(AnswerOption, {
	sourceKey: 'id',
	foreignKey: 'question_id'
});

Question.hasOne(Category, {
	sourceKey: 'category_id',
	foreignKey: 'id'
});

Question.hasOne(Language, {
	sourceKey: 'language_id',
	foreignKey: 'id'
});
