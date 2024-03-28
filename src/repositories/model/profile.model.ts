import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

export class Profile extends Model {
	declare id: number;
	declare profile: string;
}

Profile.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	profile: {
		type: DataTypes.STRING,
		allowNull: false
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	photo_url: {
		type: DataTypes.STRING,
		allowNull: false
	},
	video_url: {
		type: DataTypes.STRING,
		allowNull: false
	},
}, {
	sequelize,
	tableName: 'TB_Profile',
	timestamps: false
});
