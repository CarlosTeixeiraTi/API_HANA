const express = require("express");
const bodyparser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyparser.json());

app.use(
    bodyparser.urlencoded({
        extended: true,
    })
);

app.use(function (req, res, next) {

    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();

});

require("./routes/routes")(app);

const port = 4000;

async function atualizarDados() {

    try {

        console.log(
            "========================================"
        );

        console.log(
            "Iniciando atualização:",
            new Date()
        );

        console.log(
            "Atualizando equipamentos..."
        );

        await axios.get(
            "http://127.0.0.1:4000/Equipamentos/atualizar",
            {
                timeout: 10 * 60 * 1000
            }
        );

        console.log(
            "Equipamentos atualizados com sucesso."
        );

        console.log(
            "Atualizando rastreio..."
        );

        await axios.get(
            "http://127.0.0.1:4000/Rastreio",
            {
                timeout: 10 * 60 * 1000
            }
        );

        console.log(
            "Rastreio atualizado com sucesso."
        );

        console.log(
            "Atualizando OrdensRastreio..."
        );

        await axios.get(
            "http://127.0.0.1:4000/SincronizarNotasReforma",
            {
                timeout: 10 * 60 * 1000
            }
        );

        console.log(
            "OrdensRastreio atualizada com sucesso."
        );

        console.log(
            "Processando LocalizacaoAtual..."
        );
        console.log(
            "Atualizando GPS dos veículos..."
        );

        await axios.get(
            "http://127.0.0.1:4000/AtualizaVeiculoGPS",
            {
                timeout: 10 * 60 * 1000
            }
        );

        console.log(
            "GPS dos veículos atualizado com sucesso."
        );
        await axios.get(
            "http://127.0.0.1:4000/LocalizacaoAtual/processar",
            {
                timeout: 10 * 60 * 1000
            }
        );

        console.log(
            "LocalizacaoAtual processada com sucesso."
        );

        console.log(
            "Finalizado:",
            new Date()
        );

    } catch (err) {

        console.error(
            "Erro na atualização:",
            err.message
        );

    }

}

// Executa ao iniciar
// atualizarDados();

// Executa a cada 12 horas
setInterval(
    atualizarDados,
    12 * 60 * 60 * 1000
);

app.listen(port);

console.log(
    "Servidor rodando na porta " + port
);