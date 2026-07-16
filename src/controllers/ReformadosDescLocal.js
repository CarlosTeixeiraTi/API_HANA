const express = require('express');
const router = express.Router();

const { sequelize } = require('../models');

router.get('/listar', async (req, res) => {

    try {

        const response = await fetch(
            'http://localhost:4000/EquipamentosEstrutura?status=Reformado'
        );

        const reformados = await response.json();

        const [equipamentos] = await sequelize.query(`
            SELECT
                EQUIPAMENTO,
                DESC_LOCAL_INSTALACAO
            FROM Equipamentos
            WHERE DESC_LOCAL_INSTALACAO IS NOT NULL
        `);

        const mapaLocais = {};

        equipamentos.forEach(item => {

            mapaLocais[
                String(item.EQUIPAMENTO)
                    .replace(/^0+/, '')
            ] = item.DESC_LOCAL_INSTALACAO;

        });

        const resumo = {};

        reformados.forEach(item => {

            const descLocalInstalacao =
                mapaLocais[
                String(item.equipamento)
                    .replace(/^0+/, '')
                ];

            if (!descLocalInstalacao) {
                return;
            }

            const chave =
                `${descLocalInstalacao}|${item.tipo}`;

            resumo[chave] =
                (resumo[chave] || 0) + 1;

        });

        const resultado =
            Object.keys(resumo).map(chave => {

                const [
                    descLocalInstalacao,
                    tipo
                ] = chave.split('|');

                return {

                    descLocalInstalacao,

                    tipo,

                    quantidade:
                        resumo[chave]

                };

            });

        resultado.sort((a, b) => {

            if (a.descLocalInstalacao < b.descLocalInstalacao) {
                return -1;
            }

            if (a.descLocalInstalacao > b.descLocalInstalacao) {
                return 1;
            }

            return 0;

        });

        return res.json(resultado);

    } catch (err) {

        return res.status(500).json({

            error: err.message

        });

    }

});

module.exports = app =>
    app.use(
        '/ReformadosDescLocal',
        router
    );