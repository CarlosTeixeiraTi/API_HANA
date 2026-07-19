const express = require("express");
const router = express.Router();

router.get("/listar", async (req, res) => {

    try {

        const resultado = [];

        const responseVeiculos =
            await fetch(
                "http://localhost:4000/Veiculo"
            );

        const veiculos =
            await responseVeiculos.json();

        const veiculosUnicos = [
            ...new Map(
                veiculos.map(v => [
                    v.Veiculo,
                    v
                ])
            ).values()
        ];

        const responseRastreio =
            await fetch(
                "http://localhost:4004/odata/v4/smart-pcm/Rastreio"
            );
        const rastreio =
            await responseRastreio.json();

        const dadosFiltrados =
            (rastreio.value || []).filter(
                item =>
                    item.grupoAtual &&
                    item.grupoAtual.startsWith(
                        "Instalado no "
                    )
            );

        for (const veiculo of veiculosUnicos) {

            const responseSap =
                await fetch(
                    `http://localhost:4000/equipamentos/todos/${encodeURIComponent(
                        veiculo.Veiculo
                    )}`
                );

            const equipamentosSap =
                await responseSap.json();

            const equipamentosSapFiltrados =
                equipamentosSap.filter(item => {

                    const desc =
                        (item.DESC_EQUIPAMENTO || "")
                            .toUpperCase();

                    return (
                        desc.includes("COMANDO FINAL") ||
                        desc.includes("CONVERSOR") ||
                        desc.includes("DIFERENCIAL") ||
                        desc.includes("MOTOR") ||
                        desc.includes("TRANSMISSAO")
                    );

                });


            const equipamentosRastreados =
                dadosFiltrados.filter(
                    item =>
                        item.grupoAtual ===
                        `Instalado no ${veiculo.Veiculo}`
                );
            const rastreadosSet =
                new Set(
                    equipamentosRastreados.map(
                        x =>
                            String(
                                x.identificador
                            ).replace(/^0+/, "")
                    )
                );

            const sapSet =
                new Set(
                    equipamentosSapFiltrados.map(
                        x =>
                            String(
                                x.EQUIPAMENTO
                            )
                                .replace(/^0+/, "")
                    )
                );
            // SAP x RFID

            equipamentosSapFiltrados.forEach(item => {

                const equipamento =
                    String(item.EQUIPAMENTO)
                        .replace(/^0+/, "");

                const tipo =
                    item.DESC_EQUIPAMENTO;

                resultado.push({

                    tagVeiculo:
                        veiculo.Veiculo,

                    tipo,

                    equipamentoSap:
                        equipamento,

                    categoria:
                        rastreadosSet.has(
                            equipamento
                        )
                            ? "Encontrado nos rastreadores"
                            : "Existente no SAP sem rastreador"

                });

            });

            // RFID sem SAP

            equipamentosRastreados.forEach(item => {

                const equipamento =
                    String(
                        item.identificador
                    ).replace(/^0+/, "");

                if (
                    !sapSet.has(
                        equipamento
                    )
                ) {

                    resultado.push({

                        tagVeiculo:
                            veiculo.Veiculo,

                        tipo:
                            item.descEquipamento,

                        equipamentoSap:
                            equipamento,

                        categoria:
                            "Rastreador sem correspondência SAP"

                    });

                }

            });
        }

        return res.json(resultado);

    } catch (err) {

        console.log("ERRO DETALHADO:");
        console.log(err);

        return res.status(500).json({
            error: err.message
        });

    }

});

module.exports = app =>
    app.use(
        "/ConferenciaComponentesDetalhado",
        router
    );