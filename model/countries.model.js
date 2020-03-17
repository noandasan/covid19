module.exports = function(sequelize, DataTypes){
	const Countries = sequelize.define('tblcountries', {
		country_id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		country: {
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
	return Countries;
}
