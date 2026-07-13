const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const response = await fetch(
            "http://localhost:4000/StatusComponentes"
        );

        const data = await response.json();

        let resultado = data.map(item => {

            const descricao =
                (item.descricao || "")
                    .toUpperCase()
                    .trim();

            let tipo = "OUTROS";

            if (descricao.startsWith("COMANDO FINAL")) {

                tipo = "COMANDO FINAL";

            } else if (
                descricao.startsWith("TRANSMISSAO")
            ) {

                tipo = "TRANSMISSAO";

            } else if (
                descricao.startsWith("CONVERSOR TORQUE")
            ) {

                tipo = "CONVERSOR DE TORQUE";

            } else if (
                descricao.startsWith("DIFERENCIAL")
            ) {

                tipo = "DIFERENCIAL";

            } else if (
                descricao.startsWith("MOTOR COMBUSTAO")
            ) {

                tipo = "MOTOR";

            }

            const palavras = descricao.split(" ");

            const fornecedor =
                palavras.length >= 2
                    ? palavras[palavras.length - 2]
                    : "";

            const frota =
                palavras.length >= 1
                    ? palavras[palavras.length - 1]
                    : "";

            return {

                fornecedor,

                frota,

                tipo,

                equipamento: item.equipamento,

                descricao: item.descricao,

                status: item.status,

                localInstalacao: item.localInstalacao

            };

        });

        if (req.query.fornecedor) {

            resultado = resultado.filter(
                x =>
                    x.fornecedor ===
                    req.query.fornecedor.toUpperCase()
            );

        }

        if (req.query.frota) {

            resultado = resultado.filter(
                x =>
                    x.frota ===
                    req.query.frota.toUpperCase()
            );

        }

        if (req.query.tipo) {

            resultado = resultado.filter(
                x =>
                    x.tipo ===
                    req.query.tipo.toUpperCase()
            );

        }

        if (req.query.equipamento) {

            resultado = resultado.filter(
                x =>
                    x.equipamento ===
                    req.query.equipamento
            );

        }

        if (req.query.status) {

            resultado = resultado.filter(
                x =>
                    x.status
                        .toUpperCase()
                        .includes(
                            req.query.status.toUpperCase()
                        )
            );

        }

        return res.json(resultado);

    } catch (err) {

        console.log(err);

        return res.status(400).send({
            error: err.message,
            stack: err.stack
        });

    }

});

module.exports = app =>
    app.use('/EquipamentosEstrutura', router);