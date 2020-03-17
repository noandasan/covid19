module.exports = function(sequelize, DataTypes){
	const Locations = sequelize.define('tbllocations', {
		location_id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		location: {
			type: DataTypes.STRING
		},
		latitude: {
			type: DataTypes.DECIMAL
		},
		longitude: {
			type: DataTypes.DECIMAL
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
