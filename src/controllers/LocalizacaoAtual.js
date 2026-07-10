const express = require('express');

const router = express.Router();

const {
    Rastreio,
    Equipamentos,
    LocalizacaoAtual,
    NotasReforma
} = require('../models');

router.get('/', async (req, res) => {

    try {

        const data = await LocalizacaoAtual.findAll();

        return res.json(data);

    } catch (err) {

        return res.status(500).json({
            erro: err.message
        });
    }

});

router.get('/processar', async (req, res) => {

    try {

        const identificadores = await Rastreio.findAll({
            attributes: ['identificador'],
            group: ['identificador']
        });

        const resultado = [];

        for (const item of identificadores) {

            const identificador = item.identificador;

            const historico = await Rastreio.findAll({
                where: {
                    identificador
                },
                order: [['createdAt', 'DESC']]
            });

            const ultimoRegistro = historico[0];

            if (!ultimoRegistro) {
                continue;
            }
            let latitudeFinal = null;
            let longitudeFinal = null;

            const lat = parseFloat(ultimoRegistro.latitude);
            const lng = parseFloat(ultimoRegistro.longitude);

            const coordenadaValida =
                !isNaN(lat) &&
                !isNaN(lng) &&
                lat < -19 &&
                lat > -20 &&
                lng < -43 &&
                lng > -44;

            if (coordenadaValida) {

                latitudeFinal = ultimoRegistro.latitude;
                longitudeFinal = ultimoRegistro.longitude;

            }

            const centrosPorGrupo = {

                "Oficina": {
                    latitude: -19.60182048,
                    longitude: -43.21429436
                },

                "Oficina de Caminhões": {
                    latitude: -19.60110240,
                    longitude: -43.21471940
                },

                "Portaria Valer": {
                    latitude: -19.60218475,
                    longitude: -43.21439675
                },

                "Portaria Principal": {
                    latitude: -19.60161000,
                    longitude: -43.21403700
                },

                "Fora de zona": {
                    latitude: -19.61795290,
                    longitude: -43.23839410
                }

            };

            let ultimoGrupoValido = null;

            for (const registro of historico) {

                if (
                    registro.grupo &&
                    registro.grupo !== 'Tags Digitais desatualizadas' &&
                    registro.grupo !== 'Tags Digitais Não Habilitadas' &&
                    registro.grupo !== 'N/A'
                ) {
                    ultimoGrupoValido = registro.grupo;
                    break;
                }

            }

            const equipamento = await Equipamentos.findOne({
                where: {
                    EQUIPAMENTO: identificador
                        .toString()
                        .padStart(18, "0")
                }
            });
            const equipamentoSAP = identificador
                .toString()
                .padStart(18, "0");

            let centroTrabResp = null;
            let centroLocalizacao = null;
            let oficina = null;
            let nota = null;

            const notaReforma = await NotasReforma.findOne({

                where: {
                    equipamento: equipamentoSAP
                },

                order: [
                    ['ordem_numero', 'DESC']
                ]

            });

            if (notaReforma) {

                nota =
                    notaReforma.nota;

                centroTrabResp =
                    notaReforma.centro_trabalho_respons;

                centroLocalizacao =
                    notaReforma.centro_localizacao;

                oficina =
                    notaReforma.oficina;

            }


            if (!equipamento) {
                console.log(
                    "Equipamento não encontrado:",
                    identificador
                );
            }

            let localizacaoCalculada = ultimoRegistro.grupo;

            if (
                equipamento &&
                equipamento.LOCAL_INSTALACAO &&
                equipamento.LOCAL_INSTALACAO
                    .toUpperCase()
                    .split("-")[1] === "MIN"
            ) {

                const partes =
                    equipamento.LOCAL_INSTALACAO.split("-");

                const quintaParte =
                    partes.length >= 5
                        ? partes[4]
                        : equipamento.LOCAL_INSTALACAO;

                localizacaoCalculada =
                    "Instalado no " + quintaParte;

            } else {

                const ultimoEhPortaria =
                    ultimoGrupoValido &&
                    ultimoGrupoValido
                        .toLowerCase()
                        .includes("portaria");

                const atualDesconhecido =
                    ultimoRegistro.grupo &&
                    ultimoRegistro.grupo.toLowerCase() ===
                    "desconhecido";

                if (
                    ultimoEhPortaria &&
                    atualDesconhecido
                ) {
                    localizacaoCalculada =
                        "Tags Digitais desatualizadas";
                }
            }

            if (
                latitudeFinal === null &&
                centrosPorGrupo[localizacaoCalculada]
            ) {

                latitudeFinal =
                    centrosPorGrupo[
                        localizacaoCalculada
                    ].latitude;

                longitudeFinal =
                    centrosPorGrupo[
                        localizacaoCalculada
                    ].longitude;
            }

            let confiancaTexto = 'BAIXA';
            let confiancaNumerica = 30;

            if (ultimoRegistro.tipoComunicacao === 'LR') {

                confiancaTexto = 'ALTA';

            } else if (
                ultimoRegistro.tipoComunicacao === 'BT'
            ) {

                confiancaTexto = 'MEDIA';
                confiancaNumerica = 70;

            }

            const totalBT = historico.filter(
                r => r.tipoComunicacao === 'BT'
            ).length;

            const totalLR = historico.filter(
                r => r.tipoComunicacao === 'LR'
            ).length;


            console.log({
                identificador,
                centroTrabResp,
                centroLocalizacao,
                oficina
            });
            await LocalizacaoAtual.upsert({

                identificador,

                nota: nota,

                centro_trab_resp: centroTrabResp,

                centro_localizacao: centroLocalizacao,

                oficina: oficina,

                localInstalacao:
                    equipamento?.LOCAL_INSTALACAO || '',

                descEquipamento:
                    equipamento?.DESC_EQUIPAMENTO || '',

                grupoAtual: localizacaoCalculada,

                grupoAnterior: ultimoGrupoValido,

                confianca: confiancaNumerica,

                tipoDominante:
                    ultimoRegistro.tipoComunicacao,

                amostrasAnalisadas:
                    historico.length,

                ultimaPosicaoAnalisada:
                    ultimoRegistro.ultimaPosicao,

                justificativa:
                    `Último registro encontrado via ${ultimoRegistro.tipoComunicacao}`

            });
            console.log("DADOS MAPA", {
                identificador,
                nota,
                centroTrabResp,
                centroLocalizacao,
                oficina
            });
            resultado.push({

                identificador,

                nota: nota,

                centro_trab_resp: centroTrabResp,

                centro_localizacao: centroLocalizacao,

                oficina: oficina,

                descEquipamento:
                    equipamento
                        ? equipamento.DESC_EQUIPAMENTO
                        : '',

                localInstalacao:
                    equipamento
                        ? equipamento.LOCAL_INSTALACAO
                        : '',

                descLocalInstalacao:
                    equipamento
                        ? equipamento.DESC_LOCAL_INSTALACAO
                        : '',

                grupoOriginal: ultimoRegistro.grupo,

                grupoAtual: localizacaoCalculada,

                ultimoGrupoValido,

                tipoComunicacao:
                    ultimoRegistro.tipoComunicacao,

                ultimaPosicao:
                    ultimoRegistro.ultimaPosicao,

                gateway:
                    ultimoRegistro.gateway,

                confianca: confiancaTexto,

                latitude: latitudeFinal,

                longitude: longitudeFinal,

                totalBT,

                totalLR,

                totalRegistros:
                    historico.length

            });
        }

        console.log(
            resultado[resultado.length - 1]
        );

        return res.json(resultado);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = app => app.use('/LocalizacaoAtual', router);