module.exports = (sequelize, DataTypes) => {
    const LoggUsuarios = sequelize.define('LoggUsuarios', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        user: {

            type: DataTypes.STRING
        },
        localidade: {

            type: DataTypes.STRING
        },
        data: {

            type: DataTypes.STRING
        },
    }, {
        // define the table's name
        tableName: 'LoggUsuarios'
    });

    return LoggUsuarios
}