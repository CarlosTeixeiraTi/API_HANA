module.exports = (sequelize, DataTypes) => {

    const CentroOficina = sequelize.define('CentroOficina', {

        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },

        CENTRO_TRABALHO: {
            type: DataTypes.STRING
        },

        CENTRO_LOCALIZACAO: {
            type: DataTypes.STRING
        },

        OFICINA: {
            type: DataTypes.STRING
        }

    }, {

        tableName: 'CentroOficina'

    });

    return CentroOficina;

};