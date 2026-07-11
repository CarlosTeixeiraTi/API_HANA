const express = require('express');
const router = express.Router();

const {
    LocalizacaoAtual
} = require('../models');

function determinarStatus(localInstalacao) {

    if (!localInstalacao) {
        return 'Não definido';
    }

    if (localInstalacao.includes('EMREF_EXT')) {
        return 'Em reforma externa';
    }

    if (
        localInstalacao.includes('EMREF') ||
        localInstalacao.includes('OFIND')
    ) {
        return 'Em reforma interna';
    }

    if (localInstalacao.includes('AREF')) {
        return 'A reformar';
    }

    if (localInstalacao.includes('REFO')) {
        return 'Reformado';
    }

    const partes = localInstalacao.split('-');

    if (
        partes.length >= 5 &&
        partes[1] === 'MIN'
    ) {
        return `Instalado no ${partes[4]}`;
    }

    return 'Não definido';
}
router.get("/veiculo", async (req, res) => {

    try {

        const local = req.query.local;

        if (!local) {

            return res.status(400).json({
                error: "Parâmetro local não informado"
            });

        }

        const data = await LocalizacaoAtual.findAll({

            attributes: [
                "identificador",
                "descEquipamento",
                "localInstalacao"
            ]

        });

        const resultado = data
            .filter(item =>
                item.localInstalacao &&
                item.localInstalacao.includes(local)
            )
            .map(item => ({

                status: determinarStatus(
                    item.localInstalacao
                ),

                equipamento:
                    item.identificador,

                descricao:
                    item.descEquipamento,

                localInstalacao:
                    item.localInstalacao

            }));

        return res.json(resultado);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Erro ao consultar componentes"
        });

    }

});
router.get("/", async (req, res) => {

    try {

        const data = await LocalizacaoAtual.findAll({

            attributes: [
                'identificador',
                'descEquipamento',
                'localInstalacao'
            ]

        });

        const resultado = data.map(item => ({

            status: determinarStatus(
                item.localInstalacao
            ),

            equipamento:
                item.identificador,

            descricao:
                item.descEquipamento,

            localInstalacao:
                item.localInstalacao

        }));
        return res.json(resultado);

    } catch (err) {

        console.log(err);

        res.status(400).send({
            error: "Erro tente novamente"
        });

    }

});

module.exports =
    app => app.use(
        '/StatusComponentes',
        router
    );