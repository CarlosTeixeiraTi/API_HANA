module.exports = (sequelize, DataTypes) => {

    const LocalizacaoAtual = sequelize.define('LocalizacaoAtual', {

        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },

        identificador: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        ordem: {
            type: DataTypes.STRING(30)
        },
        localInstalacao: {
            type: DataTypes.STRING(255)
        },

        centro_trab_resp: {
            type: DataTypes.STRING(30)
        },

        centro_localizacao: {
            type: DataTypes.STRING(20)
        },

        oficina: {
            type: DataTypes.STRING(100)
        },

        descEquipamento: {
            type: DataTypes.STRING(255)
        },

        grupoAtual: {
            type: DataTypes.STRING(100)
        },

        grupoAnterior: {
            type: DataTypes.STRING(100)
        },

        confianca: {
            type: DataTypes.INTEGER
        },

        tipoDominante: {
            type: DataTypes.STRING(20)
        },

        amostrasAnalisadas: {
            type: DataTypes.INTEGER
        },

        ultimaPosicaoAnalisada: {
            type: DataTypes.STRING(30)
        },

        justificativa: {
            type: DataTypes.TEXT
        }

    }, {

        tableName: 'LocalizacaoAtuals'

    });

    return LocalizacaoAtual;
};