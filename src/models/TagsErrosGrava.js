module.exports = (sequelize, DataTypes) => {
    const TagsErrosGrava = sequelize.define('TagsErrosGrava', {
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
        tag: {

            type: DataTypes.STRING
        },
        data: {

            type: DataTypes.STRING
        },
    }, {
        // define the table's name
        tableName: 'TagsErrosGrava'
    });

    return TagsErrosGrava
}