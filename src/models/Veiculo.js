module.exports = (sequelize, DataTypes) => {

    const Veiculo = sequelize.define('Veiculo', {

        LOCAL_INSTALACAO: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false
        },

        Veiculo: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        DataAtualizacao: {
            type: DataTypes.DATE,
            allowNull: false
        },

        Latitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: true
        },

        Longitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: true
        }

    }, {
        tableName: 'Veiculo',
        timestamps: false
    });

    return Veiculo;

};