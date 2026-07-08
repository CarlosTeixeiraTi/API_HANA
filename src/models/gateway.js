module.exports = (sequelize, DataTypes) => {

    const Gateway = sequelize.define("Gateway", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        identificador: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        gatewayId: {
            type: DataTypes.STRING(30),
            allowNull: false
        },

        localidade: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        condicao: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        latitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false
        },

        longitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false
        }

    });

    return Gateway;
};