module.exports = function(sequelize, DataTypes){
	const Locations = sequelize.define('tblpersons', {
		person_id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING
		},
		location_id: {
			type: DataTypes.INTEGER
		},
		country_id: {
			type: DataTypes.INTEGER
		},
		status: {
			type: DataTypes.STRING
		},
		age: {
			type: DataTypes.INTEGER,
		},
		created: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		}
	},{
			timestamps: false
	});
	return Locations;
}
