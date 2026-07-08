module.exports = (sequelize, DataTypes) => {
    const LocInst = sequelize.define('LocInst', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        user: {

            type: DataTypes.STRING
        },
        LocInst: {

            type: DataTypes.STRING
        },
    }, {
        // define the table's name
        tableName: 'LocInst'
    });

    return LocInst
}