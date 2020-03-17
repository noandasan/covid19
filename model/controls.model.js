module.exports = function(sequelize, DataTypes){
	const Controls = sequelize.define('tblcontrols', {
		control_id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		controlname: {
			type: DataTypes.STRING
		},
		module_id: {
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
	return Controls;
}
