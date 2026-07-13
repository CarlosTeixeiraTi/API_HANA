const express = require('express');
const router = express.Router();

const { sequelize } = require('../models');

router.get('/listar', async (req, res) => {

    try {

        const response = await fetch(
            'http://localhost:4000/EquipamentosEstrutura?status=Reformado'
        );

        const reformados = await response.json();

        const [oficinas] = await sequelize.query(`
    SELECT
        equipamento,
        oficina     
    FROM NotasReforma
    WHERE oficina IS NOT NULL
`);

        const mapaOficinas = {};

        oficinas.forEach(item => {

            mapaOficinas[
                String(item.equipamento)
                    .replace(/^0+/, '')
            ] = item.oficina;

        });

        const resumo = {};

        reformados.forEach(item => {

    const oficina =
        mapaOficinas[
            String(item.equipamento)
                .replace(/^0+/, '')
        ];

    if (!oficina) {
        return;
    }

    const chave =
        `${oficina}|${item.tipo}`;

    resumo[chave] =
        (resumo[chave] || 0) + 1;   

});
        const resultado =
            Object.keys(resumo).map(chave => {

                const [
                    oficina,
                    tipo
                ] = chave.split('|');

                return {

                    oficina,

                    tipo,

                    quantidade:
                        resumo[chave]

                };

            });

        resultado.sort((a, b) => {

            if (a.oficina < b.oficina) {
                return -1;
            }

            if (a.oficina > b.oficina) {
                return 1;
            }

            return 0;

        });
        return res.json(resultado.slice(0, 3));

        return res.json(resultado);

    } catch (err) {

        return res.status(500).json({

            error: err.message

        });

    }

});

module.exports = app =>
    app.use(
        '/ReformadosPorOficina',
        router
    );