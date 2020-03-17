module.exports = function(sequelize, DataTypes){
	const Roles = sequelize.define('tblroles', {
		role_id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		rolename: {
			type: DataTypes.STRING
		},
		status: {
			type: DataTypes.INTEGER
		},
		created: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		}
	},{
			timestamps: false
	});
	return Roles;
}
