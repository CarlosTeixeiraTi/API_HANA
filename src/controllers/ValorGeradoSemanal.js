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

        const historico =
            await Rastreio.findAll({
                order: [
                    ['createdAt', 'ASC']
                ]
            });



        const semanas = {};

        historico.forEach(item => {

            const infoSemana =
                obterSemanaAno(
                    item.createdAt
                );

            const chave =
                `${infoSemana.ano}-${infoSemana.semana}`;

            if (!semanas[chave]) {

                semanas[chave] = [];

            }

            semanas[chave].push(item);

        });

        const resultado = [];
        let acumuladoGeral = 0;


        for (const chave of Object.keys(semanas)) {

            const registrosSemana =
                semanas[chave];


            const identificadoresSemana =
                [
                    ...new Set(
                        registrosSemana.map(
                            x => x.identificador
                        )
                    )
                ];

            let componentesMovimentados = 0;
            let acumuladoMovimentacoes = 0;

            identificadoresSemana.forEach(
                identificador => {

                    const historicoComponente =
                        registrosSemana
                            .filter(
                                x =>
                                    x.identificador ===
                                    identificador
                            )
                            .sort(
                                (a, b) =>
                                    new Date(a.createdAt) -
                                    new Date(b.createdAt)
                            );

                    let movimentacoes = 0;

                    for (
                        let i = 1;
                        i < historicoComponente.length;
                        i++
                    ) {

                        const grupoAnterior =
                            historicoComponente[i - 1].grupo;

                        const grupoAtual =
                            historicoComponente[i].grupo;

                        if (
                            grupoAnterior &&
                            grupoAtual &&
                            grupoAnterior !== grupoAtual
                        ) {

                            movimentacoes++;

                        }

                    }

                    acumuladoMovimentacoes +=
                        movimentacoes;

                    if (movimentacoes > 0) {

                        componentesMovimentados++;

                    }

                }
            );
            acumuladoGeral +=
                acumuladoMovimentacoes;
            const totalComponentesSemana =
                identificadoresSemana.length;

            const percentualMovimentados =
                totalComponentesSemana > 0
                    ? (
                        componentesMovimentados /
                        totalComponentesSemana
                    ) * 100
                    : 0;

            const tempoLocalizacao = 66.7;



            const cobertura = 78.0;

            const rastreabilidade = 100.0;


            const indiceEfetividade =
                (
                    (tempoLocalizacao * 0.30) + 
                    (rastreabilidade * 0.40) +
                    (percentualMovimentados * 0.20) +
                    (cobertura * 0.10)
                );
            let classificacao =
                "ABAIXO DO ESPERADO";

            if (indiceEfetividade >= 90) {

                classificacao =
                    "EXCELENTE";

            }
            else if (
                indiceEfetividade >= 80
            ) {

                classificacao =
                    "MUITO BOM";

            }
            else if (
                indiceEfetividade >= 70
            ) {

                classificacao =
                    "BOM";

            }
            const movimentacoesSemana =
                acumuladoMovimentacoes;
            resultado.push({

                semana:
                    Number(
                        chave.split("-")[1]
                    ),

                ano:
                    Number(
                        chave.split("-")[0]
                    ),

                descricaoSemana:
                    `S${Number(
                        chave.split("-")[1]
                    )}`,



                componentesMovimentados,

                movimentacoesSemana,

                acumuladoMovimentacoes:
                    acumuladoGeral,

                percentualMovimentados:
                    percentualMovimentados.toFixed(1),

                indiceEfetividade:
                    indiceEfetividade.toFixed(1),

                classificacao

            });

        }

        resultado.sort((a, b) => {

            if (a.ano !== b.ano) {
                return a.ano - b.ano;
            }

            return a.semana - b.semana;

        });


        resultado.sort((a, b) => {

            if (a.ano !== b.ano) {
                return a.ano - b.ano;
            }

            return a.semana - b.semana;

        });

        return res.json(resultado);

    } catch (err) {

        console.log(err);

        return res.status(400).send({
            error: err.message,
            stack: err.stack
        });

    }

});
function obterSemanaAno(data) {

    const d = new Date(data);

    const primeiroDiaAno =
        new Date(
            d.getFullYear(),
            0,
            1
        );

    const dias =
        Math.floor(
            (d - primeiroDiaAno) /
            (24 * 60 * 60 * 1000)
        );

    const semana =
        Math.ceil(
            (dias + primeiroDiaAno.getDay() + 1) / 7
        );

    return {
        ano: d.getFullYear(),
        semana
    };

}



module.exports = app =>
    app.use('/ValorGeradoSemanal', router);
