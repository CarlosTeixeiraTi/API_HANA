const express = require('express');
const router = express.Router();

const { Veiculo } = require('../models');

router.get("/", async (req, res) => {

    try {

        const data = await Veiculo.findAll();

        return res.json(data);

    } catch (err) {

        console.log(err);

        res.status(400).send({
            error: "Erro tente novamente"
        });

    }

});

router.get("/:localInstalacao", async (req, res) => {

    try {

        const data = await Veiculo.findOne({
            where: {
                LOCAL_INSTALACAO:
                    req.params.localInstalacao
            }
        });

        if (!data) {

            return res.status(404).send({
                error: "Não encontrado"
            });

        }

        return res.json(data);

    } catch (err) {

        console.log(err);

        res.status(400).send({
            error: "Erro tente novamente"
        });

    }

});

module.exports = app =>
    app.use('/Veiculo', router);