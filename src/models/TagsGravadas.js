module.exports = (sequelize, DataTypes) => {
    const TagsGravadas = sequelize.define('TagsGravadas', {
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
        equipGravado: {

            type: DataTypes.STRING
        },
        data: {

            type: DataTypes.STRING
        },
    }, {
        // define the table's name
        tableName: 'TagsGravadas'
    });

    return TagsGravadas
}