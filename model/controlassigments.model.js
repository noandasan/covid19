module.exports = function(sequelize, DataTypes) {
    const Controlassignments = sequelize.define('tblcontrolassignments', {
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
        control_id: {
            type: DataTypes.INTEGER
        },
        status: {
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
    return Controlassignments;
}