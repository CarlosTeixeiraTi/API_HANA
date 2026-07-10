const express = require('express');
const router = express.Router();

const { CentroOficina } = require('../models');

/*
|--------------------------------------------------------------------------
| LISTAR
|--------------------------------------------------------------------------
*/
router.get('/listar', async (req, res) => {

    try {

        const dados = await CentroOficina.findAll({

            order: [
                ['OFICINA', 'ASC']
            ]

        });

        return res.json(dados);

    } catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }

});

/*
|--------------------------------------------------------------------------
| INSERIR
|--------------------------------------------------------------------------
*/
router.post('/inserir', async (req, res) => {

    try {

        const {
            CENTRO_TRABALHO,
            CENTRO_LOCALIZACAO,
            OFICINA
        } = req.body;

        const registro = await CentroOficina.create({

            CENTRO_TRABALHO,
            CENTRO_LOCALIZACAO,
            OFICINA

        });

        return res.json(registro);

    } catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }

});

module.exports = app =>
    app.use('/CentroOficina', router);