import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../DB/config';
import { Rol } from '../model/rol.model';

export class User extends Model {
	declare id: number;
	declare firstName: string;
	declare lastName: string;
	declare email: string;
	declare isEmailVerified: boolean;
	declare roleId: number;
	declare phone: string | null;
	declare age: string | null;
}

User.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	firstName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	isEmailVerified: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	roleId: {
		type: DataTypes.NUMBER,
		allowNull: false,
		defaultValue: 1,
		references: {
			model: Rol,
			key: 'id'
		}
	},
	phone: DataTypes.STRING,
	age: DataTypes.STRING,
}, {
	sequelize,
	tableName: 'TB_USER',
	timestamps: true
});