module.exports = function(sequelize, DataTypes) {
    const Roleassignments = sequelize.define('tblroleassignments', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        role_id: {
            type: DataTypes.INTEGER
        },
        module_id: {
            type: DataTypes.INTEGER
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    });
    return Roleassignments;
}