const express = require('express');
const axios = require('axios');

const router = express.Router();
const { Op } = require('sequelize');
const { Equipamentos } = require('../models');

router.get("/", async (req, res) => {

    try {

        const data = await Equipamentos.findAll();

        return res.json(data);

    } catch (err) {

        console.log(err);

        return res.status(400).send({
            error: "Erro tente novamente"
        });

    }

});

router.get("/atualizar", async (req, res) => {

    try {

        console.log("Buscando equipamentos no HANA...");

        const response = await axios.get(
            "http://127.0.0.1:4000/hana/equipamentoSudeste",
            {
                timeout: 10 * 60 * 1000
            }
        );

        const equipamentos = response.data || [];

        console.log(
            `Registros encontrados: ${equipamentos.length}`
        );

        await Equipamentos.destroy({
            where: {},
            truncate: true
        });

        console.log(
            "Tabela Equipamentos limpa."
        );

        await Equipamentos.bulkCreate(
            equipamentos
        );

        console.log(
            "Tabela Equipamentos atualizada."
        );

        return res.json({
            sucesso: true,
            quantidade: equipamentos.length
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            erro: err.message
        });

    }

});

router.get("/todos/:local", async (req, res) => {

    try {

        const equipamentos = await Equipamentos.findAll({

            where: {

                LOCAL_INSTALACAO: {
                    [Op.like]: `%${req.params.local}%`
                }

            },

            order: [
                ["DESC_EQUIPAMENTO", "ASC"]
            ]

        });

        return res.json(equipamentos);

    } catch (err) {

        console.log(err);

        return res.status(400).send({
            error: "Erro tente novamente"
        });

    }

});


router.get("/local/:local", async (req, res) => {

    try {

        const equipamentos = await Equipamentos.findAll({

            where: {

                LOCAL_INSTALACAO: {
                    [Op.like]: `%${req.params.local}%`
                }

            }

        });

        const resumo = {};

        equipamentos.forEach(item => {

            const desc =
                (item.DESC_EQUIPAMENTO || "")
                    .toUpperCase();

            let familia = null;

            if (desc.startsWith("COMANDO FINAL")) {
                familia = "COMANDO FINAL";
            } else if (desc.startsWith("CONVERSOR TORQUE")) {
                familia = "CONVERSOR DE TORQUE";
            } else if (desc.startsWith("DIFERENCIAL")) {
                familia = "DIFERENCIAL";
            } else if (desc.startsWith("MOTOR")) {
                familia = "MOTOR";
            } else if (desc.startsWith("TRANSMISSAO")) {
                familia = "TRANSMISSAO";
            }

            if (familia) {
                resumo[familia] =
                    (resumo[familia] || 0) + 1;
            }

        });

        return res.json(resumo);

    } catch (err) {

        console.log(err);

        return res.status(400).send({
            error: "Erro tente novamente"
        });

    }

});
router.get("/:equipamento", async (req, res) => {

    try {

        const data = await Equipamentos.findOne({
            where: {
                EQUIPAMENTO: req.params.equipamento
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

        return res.status(400).send({
            error: "Erro tente novamente"
        });

    }

});

module.exports = app =>
    app.use('/Equipamentos', router);
