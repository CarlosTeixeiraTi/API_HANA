module.exports = (sequelize, DataTypes) => {
    const OrdensRastreio = sequelize.define('OrdensRastreio', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        equipamento: {
            type: DataTypes.STRING(50)
        },

        ordem: {
            type: DataTypes.STRING(50)
        },

        centro_trab_resp: {
            type: DataTypes.STRING(50)
        },

        nota: {
            type: DataTypes.STRING(50)
        },

        status_sistema_om: {
            type: DataTypes.STRING(255)
        },

        status_usuario_om: {
            type: DataTypes.STRING(255)
        },

        data_criacao: {
            type: DataTypes.STRING(30)
        },

        centro_centro_trabalho: {
            type: DataTypes.STRING(50)
        },

        texto_breve_om: {
            type: DataTypes.STRING(500)
        },

        local_instalacao: {
            type: DataTypes.STRING(255)
        }

    }, {
        tableName: 'OrdensRastreio',
        timestamps: false
    });

    return OrdensRastreio;
};
