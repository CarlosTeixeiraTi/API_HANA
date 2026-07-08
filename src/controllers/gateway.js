const express = require('express');

const router = express.Router();

const { Gateway } = require('../models');

router.get('/', async (req, res) => {

    try {

        const data = await Gateway.findAll({
            order: [['identificador', 'ASC']]
        });

        return res.json(data);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            erro: err.message
        });
    }
});

router.get('/:gatewayId', async (req, res) => {

    try {

        const data = await Gateway.findOne({
            where: {
                gatewayId: req.params.gatewayId
            }
        });

        if (!data) {
            return res.status(404).json({
                erro: 'Gateway não encontrado'
            });
        }

        return res.json(data);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            erro: err.message
        });
    }
});

router.post('/', async (req, res) => {

    try {

        const data = await Gateway.create({

            identificador: req.body.identificador,
            gatewayId: req.body.gatewayId,
            localidade: req.body.localidade,
            condicao: req.body.condicao,
            latitude: req.body.latitude,
            longitude: req.body.longitude

        });

        return res.status(201).json(data);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            erro: err.message
        });
    }
});

router.put('/:gatewayId', async (req, res) => {

    try {

        const data = await Gateway.findOne({
            where: {
                gatewayId: req.params.gatewayId
            }
        });

        if (!data) {
            return res.status(404).json({
                erro: 'Gateway não encontrado'
            });
        }

        await data.update({

            identificador: req.body.identificador,
            localidade: req.body.localidade,
            condicao: req.body.condicao,
            latitude: req.body.latitude,
            longitude: req.body.longitude

        });

        return res.json(data);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            erro: err.message
        });
    }
});

router.delete('/:gatewayId', async (req, res) => {

    try {

        const data = await Gateway.findOne({
            where: {
                gatewayId: req.params.gatewayId
            }
        });

        if (!data) {
            return res.status(404).json({
                erro: 'Gateway não encontrado'
            });
        }

        await data.destroy();

        return res.json({
            mensagem: 'Gateway removido com sucesso'
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = app => app.use('/Gateway', router);