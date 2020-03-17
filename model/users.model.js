module.exports = function(sequelize, DataTypes){
	const Users = sequelize.define('tblusers', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING
		},
		email: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.STRING
		},
		role_id: {
			type: DataTypes.INTEGER
		},
		status: {
			type: DataTypes.INTEGER
		},
		profile: {
			type: DataTypes.STRING
		},
		created: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		}
	},{
			timestamps: false
	});
	return Users;
}
