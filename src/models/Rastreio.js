module.exports = (sequelize, DataTypes) => {
    const Rastreio = sequelize.define('Rastreio', {

        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },

        grupo: {
            type: DataTypes.STRING
        },

        idNodo: {
            type: DataTypes.STRING
        },

        identificador: {
            type: DataTypes.STRING
        },

        gateway: {
            type: DataTypes.STRING
        },

        gatewayZona: {
            type: DataTypes.STRING
        },

        tipoComunicacao: {
            type: DataTypes.STRING
        },

        recebidoEm: {
            type: DataTypes.STRING
        },

        ultimaPosicao: {
            type: DataTypes.STRING
        },

        latitude: {
            type: DataTypes.STRING
        },

        longitude: {
            type: DataTypes.STRING
        }

    }, {
        tableName: 'Rastreio'
    });

    return Rastreio;
}
