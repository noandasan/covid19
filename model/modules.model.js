module.exports = function(sequelize, DataTypes){
	const Modules = sequelize.define('tblmodules', {
		module_id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		modulename: {
			type: DataTypes.STRING
		},
		path: {
			type: DataTypes.STRING
		},
		parent: {
			type: DataTypes.INTEGER
		},
		icon: {
			type: DataTypes.STRING
		},
		position: {
			type: DataTypes.INTEGER
		},
		assignable:{
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
	return Modules;
}
