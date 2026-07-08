//estrutura básica do arquivo
//const express = require('express')
//const router = express.Router()
//module.exports = app => app.use('/iam', router)    

const hdb = require('hdb')
const databaseConfig = require('../config/database')
const express = require('express')
const router = express.Router()
const fs = require('fs')
router.post('/login2', async (req, res) => {
    try {
        const { id } = req.body.valeId;
	const valeId = req.body.valeId;
console.log("inciou");
    //const { valeId, password } = req.body;
console.log("valeId: " + valeId);

        console.log(`Searching1 for id: ${valeId}`)
        const fileStream = fs.createReadStream('/home/adminvale/API_Hana/src/files/Usuarios_ToJson.csv');

const headers = 'cn;locationCountry;mail;FirstName;groupMembership'.split(';')
        const data = await new Promise((resolve, reject) => {
            const r = []
    
fileStream.on('data', (chunk) => {
                const line = chunk.toString().split('\n')
                line.map(l => {
                    if (l.includes(valeId.toString())) {
                        const obj = {}
                        const lineSplit = l.split(';')
                        headers.map((h, i) => {
                            obj[h] = lineSplit[i]
                        })
                        r.push(obj)
                    }
                })
            })
            fileStream.on('error', (err) => {
                reject(err)
            })

            fileStream.on('end', () => {
                resolve(r)
            })
        })

        fileStream.close();


        return res.send(data);
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
})
router.post("/login3", async (req, res) => {


    try {
        const { valeId, password } = req.body;
        console.log(valeId, password)
        if (!valeId || !password) {
            return res.status(400).send({ error: "Favor enviar email e senha" })
        }
        console.log('1 - Login recebido para ' + valeId);
        requestify.request("https://dsjwtssoauth.api.valeglobal.net/v2/.auth/token", {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            dataType: 'form-url-encoded',
            body: {
                username: valeId,
                password: password,
                grant_type: 'password',
                client_id: '00cdebc9-332c-4b85-beb4-5e295ce8bcc5',
            }

        }).then(async response => {
            body = JSON.parse(response.body)
            console.log(response.body)
            return res.send(body);
        }).catch(err => {
            return res.status(400).send(err.body)
            console.log(res.status(400).send(err.body))
        })
        console.log('2 - Login realizadao para ' + valeId);
    } catch (err) {
        res.status(400).send({ error: "Erro tente novamente" });
    }
});


router.post('/iamloginAtivos', async (req, res) => {
    try {
        const { valeId, field = 'cn' } = req.body;
        console.log(`Searching for ${valeId} in ${field}`)
        const fileStream = fs.createReadStream('/home/adminvale/API_Hana/src/files/Usuarios_ToJson.csv');
        const divider = ';'
        const headers = 'cn;mail;FirstName;groupMembership;locationCountry'.split(divider)

        if (field !== '*' && !headers.includes(field)) {
            return res.status(400).send('Invalid field')
        }

        const data = await new Promise((resolve, reject) => {
            const r = []

            fileStream.on('data', (chunk) => {
                const line = chunk.toString().split('\n')
                line.map(l => {
                    if (l.includes(valeId.toString())) {
                        const obj = {}
                        const lineSplit = l.split(divider)
                        headers.map((h, i) => {
                            obj[h] = lineSplit[i]
                        })
                        r.push(obj)
                    }
                })
            })
            fileStream.on('error', (err) => {
                reject(err)
            })

            fileStream.on('end', () => {
                resolve(r)
            })
        })

        fileStream.close();

        let dataToReturn = data
        
        if(field !== '*') {
            dataToReturn = data.filter(d => d[field] === valeId.toString())
        }
const  json = JSON.stringify(dataToReturn).replace('[','').replace(']','');
        return res.send(json);
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
})
//Rota de autenticação do usuário
router.post("/iamloginAtivos2", async (req, res) => {
    //Cecebo o email e senha enviados pelo usuario na requisição
    const { valeId, password } = req.body;
    console.log(valeId, password)
    console.log('1 - Login recebido para ' + valeId);
    var valeAuth = new ClientOAuth2({
        clientId: "adbbb016-24d8-4b91-892d-62ae90e15e66",
        clientSecret:
            "ICi5w3CrgsJduZpQus33lctgRKNy0dS_sNPyiWqR4OIjBcktViUFQPW--RBb_MjUruujcDLVVxw4G0AYeWpPXg",
        accessTokenUri: "https://ids-prd.valeglobal.net/nidp/oauth/nam/token",
        //authorizationUri: 'https://github.com/login/oauth/authorize',
        //redirectUri: 'https://ids-prd.valeglobal.net/nidp/oauth/nam/userinfo',
        scopes: ["VejaVejo"]
    });

    try {
        valeAuth.owner
            .getToken(`${valeId}`, password)
            .then(function (user) {
                console.log("2 - Gerando token");
                token = user.sign({
                    //    method: 'get',
                    //    url: 'https://ids-prd.valeglobal.net/nidp/oauth/nam/userinfo'
                });

                console.log("3 - Login no sistema");

                requestify
                    .request("https://ids-prd.valeglobal.net/nidp/oauth/nam/userinfo", {
                        method: "GET",
                        headers: {
                            authorization: token.headers.Authorization
                        } /*
                      auth: user.sign({
                          method: 'get',
                          url: 'https://ids-prd.valeglobal.net/nidp/oauth/nam/userinfo'
                      }),
              */,
                        dataType: "json"
                    })
                    .then(async function (response) {
                        console.log("4 - Retorno do IAM");

                        if (response.getCode() == 200) {
                            var body = response.getBody();
                            console.log(body)

                            return res.send(body);

                        } else {
                            return res.status(400).send({ error: "Invalid credentials" });
                        }
                    });
            })
            .catch(err => {
                console.log("Login Inválido");
                console.log(err);
                return res.status(400).send({
                    error: "Login Inválido, verifique os campos e tente novamente",
                    code: "ERRAPI01",
                    message: err.body
                });
            });
    } catch (err) {
        return res.status(400).send({
            error: "Erro na geração do token, tente novamente mais tarde",
            code: "ERRAPI02",
            message: err.body
        });
    }
});


module.exports = app => app.use('/iam', router)
