module.exports = (sequelize, DataTypes) => {
    const IP30 = sequelize.define('IP30', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        user: {

            type: DataTypes.STRING
        },
        readerIP30: {

            type: DataTypes.STRING
        },
    }, {
        // define the table's name
        tableName: 'IP30'
    });

    return IP30
}