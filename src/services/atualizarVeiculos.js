const axios = require('axios');
const db = require('../models');

const Veiculo = db.Veiculo;
async function obterLocalizacaoAtual() {

    const response = await axios.get(
        'http://10.44.32.193:4000/LocalizacaoAtual'
    );

    return response.data;
}
function agruparVeiculos(dados) {

    const veiculos = {};

    for (const item of dados) {

        if (!item.grupoAtual)
            continue;

        if (!item.grupoAtual.startsWith('Instalado no '))
            continue;

        const veiculo = item.grupoAtuaal
            .replace('Instalado no ', '')
            .trim();

        if (!veiculos[veiculo]) {
            veiculos[veiculo] = [];
        }

        veiculos[veiculo].push(item);
    }

    return veiculos;
}
function montarEquipamentos(equipamentos) {

    return equipamentos.map(item => ({

        equipamento:
            item.identificador,

        descricao:
            item.descEquipamento || '',

        dataUltimaLocalizacao:
            item.ultimaPosicaoAnalisada || ''

    }));

}
await Veiculo.destroy({
    where: {},
    truncate: true
});
async function atualizarVeiculos() {

    try {

        console.log('Iniciando carga de veículos...');

        const dados = await obterLocalizacaoAtual();

        const veiculosAgrupados =
            agruparVeiculos(dados);

        // Limpa tabela
        await Veiculo.destroy({
            where: {},
            truncate: true
        });

        // PASSO 10 - INSERÇÃO
        for (const veiculo of Object.keys(veiculosAgrupados)) {

            await Veiculo.create({

                veiculo: veiculo,

                veiculoEquipamentos:
                    montarEquipamentos(
                        veiculosAgrupados[veiculo]
                    ),

                dataAtualizacao:
                    new Date()

            });
        }

        console.log('Carga concluída.');

    } catch (erro) {

        console.error(
            'Erro ao atualizar veículos:',
            erro
        );
    }
}