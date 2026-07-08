const express = require('express');
const axios = require('axios');

const router = express.Router();

const { Rastreio } = require('../models');

/*
 * Atualiza a tabela Rastreio a partir do CSV
 */
router.get("/", async (req, res) => {

    try {

        const response = await axios.get(
            'https://lrma.smetro.io/api/reports/geofence-snapshot.csv',
            {
                timeout: 60000,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {
                    Cookie: 'app_session_id=eyJ1c2VybmFtZSI6ImNhcmxvcyIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxODEzNjcyNTM2MjEwfQ.Y7mccaR4_4eGjpUpJsHI7uuhxCEvw2zibz6tZve9FbA'
                }
            }
        );

        const linhas = response.data.trim().split('\n');

        const registros = [];

        for (let i = 1; i < linhas.length; i++) {

            const campos = linhas[i]
                .replace(/"/g, '')
                .split(';');

            if (campos.length < 10) continue;

            registros.push({
                grupo: campos[0],
                idNodo: campos[1],
                identificador: campos[2],
                gateway: campos[3],
                gatewayZona: campos[4],
                tipoComunicacao: campos[5],
                recebidoEm: campos[6],
                ultimaPosicao: campos[7],
                latitude: campos[8],
                longitude: campos[9]
            });
        }

        await Rastreio.bulkCreate(registros);

        return res.json({
            sucesso: true,
            registrosImportados: registros.length
        });

    } catch (err) {

        console.log('STATUS:', err.response ? err.response.status : null);
        console.log('DATA:', err.response ? err.response.data : null);
        console.log('ERRO COMPLETO:', err);

        return res.status(500).json({
            status: err.response ? err.response.status : null,
            data: err.response ? err.response.data : null,
            erro: err.message
        });

    }

});

/*
 * Retorna os dados já gravados na tabela
 */
router.get("/dados", async (req, res) => {

    try {

        const data = await Rastreio.findAll({
            order: [['id', 'ASC']]
        });

        return res.json(data);

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            erro: err.message
        });

    }

});

module.exports = app => app.use('/Rastreio', router);
