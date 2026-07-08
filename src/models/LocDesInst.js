module.exports = (sequelize, DataTypes) => {
    const LocDesinst = sequelize.define('LocDesinst', {
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
        tableName: 'LocDesinst'
    });
    
    return LocDesinst
}