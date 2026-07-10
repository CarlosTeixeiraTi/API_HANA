const express = require('express');
const router = express.Router();

const hdb = require('hdb');
const { Op } = require('sequelize');

const databaseConfig = require('../config/database');

const { Rastreio, OrdensRastreio } = require('../models');

/*
|--------------------------------------------------------------------------
| LISTAR DADOS DA TABELA
|--------------------------------------------------------------------------
*/
router.get('/listar', async (req, res) => {

    try {

        const dados = await OrdensRastreio.findAll({
            order: [
                ['data_criacao', 'DESC']
            ]
        });

        return res.json(dados);

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            error: err.message
        });

    }

});

/*
|--------------------------------------------------------------------------
| SINCRONIZAR DADOS HANA -> MYSQL
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {

    try {

        const rastreios = await Rastreio.findAll({
            attributes: ['identificador'],
            where: {
                identificador: {
                    [Op.like]: '1%'
                }
            }
        });

const equipamentos = [
    ...new Set(
        rastreios
            .map(x => String(x.identificador || '').trim())
            .filter(Boolean)
            .filter(x => x.startsWith('1'))
            .map(x => x.padStart(18, '0'))
    )
];


        if (equipamentos.length === 0) {

            return res.json({
                totalEquipamentos: 0,
                totalOrdens: 0
            });

        }

        const equipamentosIn = equipamentos
            .map(x => `'${x.replace(/'/g, "''")}'`)
            .join(',');

        console.log('TOTAL IDENTIFICADORES:', equipamentos.length);
console.log('EQUIPAMENTOS:', equipamentos);
        const sql = `
            SELECT *
            FROM (

                SELECT
                    "EQUIPAMENTO",
                    "ORDEM",
                    "CENTRO_TRAB_RESP",
                    "NOTA",
                    "STATUS_SISTEMA_OM",
                    "STATUS_USUARIO_OM",
                    "DATA_CRIACAO",
                    "CENTRO_CENTRO_TRABALHO",
                    "TEXTO_BREVE_OM",
                    "LOCAL_INSTALACAO",

                    ROW_NUMBER() OVER (
                        PARTITION BY "EQUIPAMENTO"
                        ORDER BY "DATA_CRIACAO" DESC
                    ) AS RN

                FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_002"

                WHERE "EQUIPAMENTO" IN (${equipamentosIn})
                  AND "EQUIPAMENTO" IS NOT NULL
                  AND "EQUIPAMENTO" <> ''
                  AND "TIPO_ORDEM" = 'YRR'

            ) T

            WHERE RN = 1

            ORDER BY "DATA_CRIACAO" DESC
        `;

        const client = hdb.createClient(databaseConfig);

        client.on('error', function (err) {

            console.log(err);

            return res.status(500).json(err);

        });

        client.connect(async function (err) {

            if (err) {

                console.log(err);

                return res.status(500).json(err);

            }

            client.exec(sql, async function (err, rows) {

                client.end();

                if (err) {

                    console.log(err);

                    return res.status(500).json(err);

                }

                await OrdensRastreio.destroy({
                    where: {},
                    truncate: true
                });

                if (rows.length > 0) {

                    await OrdensRastreio.bulkCreate(

                        rows.map(item => ({

                            equipamento:
                                item.EQUIPAMENTO,

                            ordem:
                                item.ORDEM,

                            centro_trab_resp:
                                item.CENTRO_TRAB_RESP,

                            nota:
                                item.NOTA,

                            status_sistema_om:
                                item.STATUS_SISTEMA_OM,

                            status_usuario_om:
                                item.STATUS_USUARIO_OM,

                            data_criacao:
                                item.DATA_CRIACAO,

                            centro_centro_trabalho:
                                item.CENTRO_CENTRO_TRABALHO,

                            texto_breve_om:
                                item.TEXTO_BREVE_OM,

                            local_instalacao:
                                item.LOCAL_INSTALACAO

                        }))

                    );

                }

                return res.json({

                    totalEquipamentos:
                        equipamentos.length,

                    totalOrdens:
                        rows.length

                });

            });

        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            error: err.message
        });

    }

});

module.exports = app =>
    app.use('/SincronizarOrdensRastreio', router);