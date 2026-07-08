module.exports = (sequelize, DataTypes) => {

    const Equipamentos = sequelize.define("Equipamentos", {

        EQUIPAMENTO: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },

        DESC_EQUIPAMENTO: {
            type: DataTypes.STRING
        },

        CENTRO_LOCALIZACAO: {
            type: DataTypes.STRING
        },

        IDENTIFICACAO_TECNICA: {
            type: DataTypes.STRING
        },

        LOCAL_INSTALACAO: {
            type: DataTypes.STRING
        },

        DESC_LOCAL_INSTALACAO: {
            type: DataTypes.STRING
        }

    });

    return Equipamentos;

};