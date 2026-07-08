module.exports = (sequelize, DataTypes) => {
    const DeParaTags = sequelize.define('DeParaTags', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        local: {

            type: DataTypes.STRING
        },
        tag: {

            type: DataTypes.STRING
        },
        cosSAP: {

            type: DataTypes.STRING
        },
    }, {
        // define the table's name
        tableName: 'DeParaTags'
    });

    return DeParaTags
}