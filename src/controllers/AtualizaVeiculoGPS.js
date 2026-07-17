const models = require('../models');

console.log('====================');
console.log(Object.keys(models));
console.log('VEICULO=', models.Veiculo);
console.log('====================');

const Veiculo = models.Veiculo;

const express = require('express');
const router = express.Router();

const axios = require('axios');
const sql = require('mssql');
const proj4 = require('proj4');




// SIRGAS 2000 / UTM 23S
proj4.defs(
    "EPSG:31983",
    "+proj=utm +zone=23 +south +ellps=GRS80 +units=m +no_defs"
);

function converterParaGps(posX, posY) {

    const [longitude, latitude] = proj4(
        "EPSG:31983",
        "WGS84",
        [
            Number(posX),
            Number(posY)
        ]
    );

    return {
        latitude,
        longitude
    };
}
const sqlConfig = {
    server: 'sql-siam-002-prd.database.windows.net',
    database: 'sqldb-siam-002-prd',
    user: 'PJVIPMOINHOS',
    password: "sNk#3sRw%xgvt#>HeGj,'SA",
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

router.get("/", async (req, res) => {

    try {

        const statusResponse = await axios.get(
            'http://localhost:4000/StatusComponentes'
        );

        const instalados = statusResponse.data.filter(item =>
            item.status &&
            item.status.includes('Instalado')
        );

        if (instalados.length === 0) {
            return res.json([]);
        }

        const tags = instalados.map(item =>
            item.status
                .replace('Instalado no ', '')
                .trim()
        );

        const locais = {};

        instalados.forEach(item => {

            const tag = item.status
                .replace('Instalado no ', '')
                .trim();

            locais[tag] = item.localInstalacao;
        });

        const listaTags = tags
            .map(tag => `'${tag}'`)
            .join(',');
        console.log("sqlConfig:", sqlConfig);
        
        const pool = await sql.connect(sqlConfig);

        const result = await pool.request().query(`
            WITH CTE AS
            (
                SELECT
                    TAG,
                    PosX,
                    PosY,
                    Data_Leitura,
                    ROW_NUMBER() OVER
                    (
                        PARTITION BY TAG
                        ORDER BY Data_Leitura DESC
                    ) AS RN
                FROM dbo.GPS_Equipamentos_Moveis
                WHERE Id_Localidade = 5
                  AND Data_Leitura >= DATEADD(DAY,-7,GETDATE())
                  AND TAG IN (${listaTags})
            )
            SELECT
                TAG,
                PosX,
                PosY,
                Data_Leitura
            FROM CTE
            WHERE RN = 1
        `);

        const retorno = [];

        for (const gps of result.recordset) {

            const coordenadas = converterParaGps(
                gps.PosX,
                gps.PosY
            );

            const localOriginal =
                locais[gps.TAG] || "";

            const partes =
                localOriginal.split("-");

            const localInstalacao =
                partes.length >= 5
                    ? partes.slice(0, 5).join("-")
                    : localOriginal;

            const registro = {

                LOCAL_INSTALACAO:
                    localInstalacao,

                Veiculo:
                    gps.TAG,

                Latitude:
                    Number(
                        coordenadas.latitude.toFixed(6)
                    ),

                Longitude:
                    Number(
                        coordenadas.longitude.toFixed(6)
                    ),

                DataAtualizacao:
                    new Date()
            };

            await Veiculo.upsert(registro);

            retorno.push(registro);
        }
        return res.json(retorno);

    } catch (err) {

        console.log(err);

        return res.status(400).send({
            error: "Erro tente novamente"
        });
    }
});

module.exports = app =>
    app.use('/AtualizaVeiculoGPS', router);