const express = require('express');
const router = express.Router();

const hdb = require('hdb');

const databaseConfig = require('../config/database');

const {
    NotasReforma,
    CentroOficina,
    Rastreio
} = require('../models');

/*
|--------------------------------------------------------------------------
| SINCRONIZAR NOTAS HANA -> MYSQL
|--------------------------------------------------------------------------
*/
router.get('/', async (req, res) => {

    try {

        const rastreios = await Rastreio.findAll({
            attributes: ['identificador']
        });

        const equipamentos = [
            ...new Set(
                rastreios
                    .map(x => String(x.identificador || '').trim())
                    .filter(Boolean)
                    .map(x => x.padStart(18, '0'))
            )
        ];

        if (equipamentos.length === 0) {

            return res.json({
                totalEquipamentos: 0,
                totalRegistros: 0
            });

        }

        const equipamentosIn = equipamentos
            .map(x => `'${x.replace(/'/g, "''")}'`)
            .join(',');

        const sql = `
            SELECT *
FROM (

    SELECT

        "TIPO_NOTA",
        "EQUIPAMENTO",
        "NOTA",
        "PRIORIDADE",
        "ORDEM",
        "CENTRO_TRABALHO_RESPONS",
        "TXT_BREVE_NOTA",
        "LOCAL_INSTALACAO",
        "DATA_CRIACAO",
        "STATUS_SISTEMA",
        "STATUS_USUARIO",
        "DATA_MODIFICACAO",
        "CENTRO_CT" AS CENTRO_LOCALIZACAO,
        "DT_INICIO_DESEJADO",
        "DT_CONCLUSAO_DESEJADO",

        ROW_NUMBER() OVER (
            PARTITION BY "EQUIPAMENTO"
            ORDER BY "ORDEM" DESC
        ) AS RN

    FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001"

    WHERE "TIPO_NOTA" = 'YA'
      AND "EQUIPAMENTO" IN (${equipamentosIn})
      AND "CENTRO_TRABALHO_RESPONS" NOT IN (
          'GESCOSUP')

) T

WHERE RN = 1

ORDER BY "ORDEM" DESC;
        `;

        const client = hdb.createClient(databaseConfig);

        client.connect(function (err) {

            if (err) {

                return res.status(500).json(err);

            }

            client.exec(sql, async function (err, rows) {

                client.end();

                if (err) {

                    return res.status(500).json(err);

                }

                await NotasReforma.destroy({
                    where: {},
                    truncate: true
                });

                const dados = [];

                for (const item of rows) {

                    const oficinaEncontrada =
                        await CentroOficina.findOne({

                            where: {

                                CENTRO_TRABALHO:
                                    item.CENTRO_TRABALHO_RESPONS,

                                CENTRO_LOCALIZACAO:
                                    item.CENTRO_LOCALIZACAO

                            }

                        });

                    dados.push({

                        equipamento:
                            item.EQUIPAMENTO,

                        tipo_nota:
                            item.TIPO_NOTA,

                        nota:
                            item.NOTA,

                        prioridade:
                            item.PRIORIDADE,

                        ordem_numero:
                            item.ORDEM,

                        centro_trabalho_respons:
                            item.CENTRO_TRABALHO_RESPONS,

                        centro_localizacao:
                            item.CENTRO_LOCALIZACAO,

                        oficina:
                            oficinaEncontrada
                                ? oficinaEncontrada.OFICINA
                                : 'Não informado',

                        txt_breve_nota:
                            item.TXT_BREVE_NOTA,

                        local_instalacao:
                            item.LOCAL_INSTALACAO,

                        status_sistema:
                            item.STATUS_SISTEMA,

                        status_usuario:
                            item.STATUS_USUARIO,

                        data_criacao:
                            item.DATA_CRIACAO,

                        data_modificacao:
                            item.DATA_MODIFICACAO,

                        dt_inicio_desejado:
                            item.DT_INICIO_DESEJADO,

                        dt_conclusao_desejado:
                            item.DT_CONCLUSAO_DESEJADO

                    });

                }

                if (dados.length > 0) {

                    await NotasReforma.bulkCreate(dados);

                }

                return res.json({

                    totalEquipamentos:
                        equipamentos.length,

                    totalRegistros:
                        dados.length

                });

            });

        });

    } catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }

});

/*
|--------------------------------------------------------------------------
| LISTAR DADOS DA TABELA
|--------------------------------------------------------------------------
*/
router.get('/listar', async (req, res) => {

    try {

        const dados = await NotasReforma.findAll({

            order: [
                ['data_modificacao', 'DESC']
            ]

        });

        return res.json(dados);

    } catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }

});

module.exports = app =>
    app.use('/SincronizarNotasReforma', router);