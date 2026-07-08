const axios = require('axios');

async function atualizarRastreio() {

    try {

        console.log('Atualizando rastreio...');

        const response = await axios.get(
            'http://127.0.0.1:4000/Rastreio'
        );

        console.log('Atualização concluída:', response.data);

    } catch (err) {

        console.log('Erro ao atualizar rastreio:', err.message);

    }
}

// Executa ao iniciar o sistema
atualizarRastreio();

// Executa a cada 12 horas
setInterval(
    atualizarRastreio,
    2 * 60 * 1000
);
