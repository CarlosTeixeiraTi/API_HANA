const express = require('express');
const router = express.Router();

const {
    Rastreio,
    LocalizacaoAtual
} = require('../models');

router.get("/", async (req, res) => {

    try {

        const componentes =
            await LocalizacaoAtual.findAll();

        const totalPlanejado = 50;

        const componentesValidos =
            componentes.filter(
                item =>
                    item.grupoAtual !==
                    "Tags Digitais Não Habilitadas"
            );
        const componentesElegiveis =
            [...componentesValidos];
        const componentesOnline =
            componentesElegiveis.filter(
                item =>
                    estaOnline(
                        item.updatedAt
                    )
            );
        const disponibilidadeMonitoramento =
            componentesElegiveis.length > 0
                ? (
                    componentesOnline.length /
                    componentesElegiveis.length
                ) * 100
                : 0;
        const totalComponentes =
            componentesValidos.length;

        /*
         * KPI 1
         * Tempo Médio de Localização
         */

        const tempoLocalizacao = 66.7;

        /*
         * KPI 2
         * Rastreabilidade
         */

        const componentesRastreaveis =
            componentesValidos.filter(
                item =>
                    item.grupoAtual &&
                    item.grupoAtual !==
                    "Tags Digitais Não Habilitadas"
            ).length;

        const rastreabilidade =
            totalComponentes > 0
                ? (
                    componentesRastreaveis /
                    totalComponentes
                ) * 100
                : 0;

        /*
         * KPI 3
         * Cobertura
         */

        const componentesInstalados =
            componentes.filter(
                item => item.nota !== null
            ).length;

        const cobertura =
            (componentesInstalados / totalPlanejado) * 100;

        /*
         * KPI 4
         * Componentes movimentados
         */
        const totalGatewaysPlanejado = 7;

        const gatewaysAtivos =
            componentes
                .filter(
                    item => item.gateway
                )
                .map(
                    item => item.gateway
                );

        const gatewaysUnicos =
            [...new Set(gatewaysAtivos)];

        const percentualGateway =
            (
                gatewaysUnicos.length /
                totalGatewaysPlanejado
            ) * 100;
        const identificadores =
            await Rastreio.findAll({

                attributes: [
                    'identificador'
                ],

                group: [
                    'identificador'
                ]

            });

        let componentesMovimentados = 0;
        let totalMovimentacoes = 0;

        for (const item of identificadores) {

            const historico =
                await Rastreio.findAll({

                    where: {
                        identificador:
                            item.identificador
                    },

                    order: [
                        ['createdAt', 'ASC']
                    ]

                });

            let movimentacoes = 0;

            for (
                let i = 1;
                i < historico.length;
                i++
            ) {

                const grupoAnterior =
                    historico[i - 1].grupo;

                const grupoAtual =
                    historico[i].grupo;

                if (
                    grupoAnterior &&
                    grupoAtual &&
                    grupoAnterior !== grupoAtual
                ) {

                    movimentacoes++;

                }

            }

            totalMovimentacoes +=
                movimentacoes;

            if (movimentacoes > 0) {

                componentesMovimentados++;

            }

        }

        const percentualMovimentados =
            totalComponentes > 0
                ? (
                    componentesMovimentados /
                    totalComponentes
                ) * 100
                : 0;

        /*
         * Índice Geral de Efetividade
         */

        const indiceEfetividade =
            (
                (disponibilidadeMonitoramento * 0.35) +
                (cobertura * 0.25) +
                (percentualMovimentados * 0.20) +
                (tempoLocalizacao * 0.10) +
                (percentualGateway * 0.10)
            );

        let classificacao =
            "ABAIXO DO ESPERADO";

        if (indiceEfetividade >= 90) {

            classificacao =
                "EXCELENTE";

        } else if (
            indiceEfetividade >= 80
        ) {

            classificacao =
                "MUITO BOM";

        } else if (
            indiceEfetividade >= 70
        ) {

            classificacao =
                "BOM";

        }

        return res.json({

    tempoLocalizacao:
        tempoLocalizacao.toFixed(1),

    rastreabilidade:
        rastreabilidade.toFixed(1),

    disponibilidadeMonitoramento:
        disponibilidadeMonitoramento.toFixed(1),

    componentesDisponiveis:
        componentesOnline.length,

    cobertura:
        cobertura.toFixed(1),

    componentesMovimentados,

    percentualMovimentados:
        percentualMovimentados.toFixed(1),

    totalMovimentacoes,

    totalComponentes,

    indiceEfetividade:
        indiceEfetividade.toFixed(1),

    classificacao

});

    } catch (err) {

        console.log(err);

        return res.status(400).send({

            error: err.message,

            stack: err.stack

        });

    }

});
function estaOnline(
    dataAtualizacao
) {

    if (!dataAtualizacao) {
        return false;
    }

    const agora =
        new Date();

    const data =
        new Date(
            dataAtualizacao
        );

    const diferencaDias =
        (
            agora - data
        ) /
        (
            1000 * 60 * 60 * 24
        );

    return diferencaDias <= 7;

}
module.exports = app =>
    app.use('/ValorGerado', router);