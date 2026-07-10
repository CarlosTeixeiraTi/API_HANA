module.exports = (sequelize, DataTypes) => {

    const NotasReforma = sequelize.define('NotasReforma', {

        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        equipamento: {
            type: DataTypes.STRING(18)
        },
        tipo_nota: DataTypes.STRING(10),

        nota: {
            type: DataTypes.STRING(30),
            unique: true
        },

        prioridade: DataTypes.STRING(20),

        ordem_numero: DataTypes.STRING(30),

        centro_trabalho_respons: DataTypes.STRING(30),

        centro_localizacao: DataTypes.STRING(20),

        oficina: DataTypes.STRING(100),

        txt_breve_nota: DataTypes.STRING(500),

        local_instalacao: DataTypes.STRING(255),

        status_sistema: DataTypes.STRING(255),

        status_usuario: DataTypes.STRING(255),

        data_criacao: {
            type: DataTypes.STRING(30)
        },

        data_modificacao: {
            type: DataTypes.STRING(30)
        },

        dt_inicio_desejado: {
            type: DataTypes.STRING(30)
        },

        dt_conclusao_desejado: {
            type: DataTypes.STRING(30)
        },

    }, {

        tableName: 'NotasReforma',
        timestamps: true

    });

    return NotasReforma;

};