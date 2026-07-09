
/*
-> Body - JSON (POST, PUT)
-> Query - Direto na URL
-> Parametro - depois do /
*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const requestify = require("requestify")
//acrescentei em 19-8
const { Connection, Request } = require("tedious");

const moment = require('moment');
//const dateStr = moment().utc().format();
const dia =moment().format('DD');   
const mes =moment().format('MM');   
const ano =moment().format('YYYY');  
const hora =moment().format('hh');
const minuto =moment().format('mm');
const segundo =moment().format('ss');

const fs = require('fs'); 
const hdb = require('hdb')
const databaseConfig = require('../config/database')
const express = require('express')
const SQLDB = require("./SQLDB");
const { DateTime, Date, Time, Int } = require("mssql");
const router = express.Router()
router.get('/', (request, response) => {
    try {
        const client = hdb.createClient(databaseConfig)
        client.connect()
        client.exec('SELECT TOP 5 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001"',
            (err, rows) => {
                client.end()
                if (err)
                    throw err
                return response.json(rows)
            })
    } catch (error) {
        return response.status(400).send(error)
    }

})

// //acrescentei em 19-8
// router.post("/InserirMovimento22/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:datagravatag/:desmontar/:statussync", async (req, res) => {
//     // Create connection to database
//   //router.post("/InserirMovimento2/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:prefixocomponente/:seqcomponente/:localinstala5nivel/:localinstala6nivel/:datagravatag/:desmontar", (req, res) => {
//     try
//     {
//         const config = {
//         authentication: {
//           options: {
//             userName: "PJRFID", 
//             //PRD
//             //password: "AwAvIXCj4n7Wwa" 
//             //QA
//             password: "cTg3NcTskEp4hT" 
//           },
//           type: "default"
//         },
//         //PRD
//         //server: "rdb-rfid-prd.database.windows.net", 
//         //QA
//         server: "rfid-db-qa.database.windows.net", 
//         options: {
//           //QA
//           database: "rfid-db", 
//           //PRD
//           //database: "BDRFID_PRD", 
//           encrypt: true
//         }
//       };
//     var dataRegisto = req.params.dtregistro.replace("\"", "");
//     var horaGreistro = req.params.hrregistro.replace("\"", "");
//     var origemInfo = req.params.origem.replace("\"", "");
//     var usuarioAutenticado = req.params.usuario.replace("\"", "");
//     var local = req.params.localidade.replace("\"", "");
//     var tag = req.params.codtag.replace("\"", "");
//     var locDesintala = req.params.localdesintala.replace("\"", "");
//     var prefixoComp = '';
//     var seqComp = 0;
//     var localEquipPai = '';
//     var localEquipFilho = '';
//     var dataTag = req.params.datagravatag.replace("\"", "");
//    var desmontarEquip = req.params.desmontar.replace("\"", "");
//    var statusreq = req.params.statussync.replace("\"", "");
//     //console.log("desmontar:" + desmontarEquip);
//     /* 
//         //Use Azure VM Managed Identity to connect to the SQL database
//         const connection = new Connection({
//         server: process.env["db_server"],
//         authentication: {
//             type: 'azure-active-directory-msi-vm',
//         },
//         options: {
//             database: process.env["db_database"],
//             encrypt: true,
//             port: 1433
//         }
//     });
//         //Use Azure App Service Managed Identity to connect to the SQL database
//         const connection = new Connection({
//         server: process.env["db_server"],
//         authentication: {
//             type: 'azure-active-directory-msi-app-service',
//         },
//         options: {
//             database: process.env["db_database"],
//             encrypt: true,
//             port: 1433
//         }
//     });
    
//     */
    
//     const connection = new Connection(config);
    
//     // Attempt to connect and execute queries if connection goes through
//     await connection.on("connect", err => {
//       if (err) {
//         console.error(err.message);
//         return res.status(500).send(err)
//       } else {
//         queryDatabase();
//       }
//     });
    
//     await connection.connect();
    
//     function queryDatabase() {
//       console.log("Recording rows from the Table...");
    
//       // Read all rows from table
//       const request = new Request(
//    //     `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR) VALUES (${dataRegisto},${horaGreistro}, ${origemInfo}, ${usuarioAutenticado}, ${local}, ${tag}, ${locDesintala}, ${prefixoComp}, ${seqComp}, ${localEquipPai} , ${localEquipFilho} , ${dataTag}, ${desmontarEquip}) `,
//         `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR, OTAA_STATUS_SINC ) VALUES ('${dataRegisto}','${horaGreistro}', '${origemInfo}', '${usuarioAutenticado}', '${local}', '${tag}', '${locDesintala}', '${prefixoComp}', ${seqComp}, '${localEquipPai}' , '${localEquipFilho}' , '${dataTag}','${desmontarEquip}','${statusreq}') `,
        
//         (err, rowCount) => {
//           if (err) {
//             console.error(err.message);
//           } else {
//             console.log(`${rowCount} row(s) returned`);
//           }
//         }
//       );
//     const data = []
//       request.on("row", columns => {
//         columns.forEach(column => {
//           console.log("%s\t%s", column.metadata.colName, column.value);
//           data.push(column)
//         });
        
//       });
    
//       connection.execSql(request);
//       return res.send(data)
//     }
//     //connection.close();
//   }
//   catch (error)
//   {
//       return res.status(500).send(error)
//   }
//   })

router.get("/Saneamentoknexmassa", async (req, res) => {
    //router.get("/tratarlocalsaneamento3/:local/:qtdregistros/:maiorque", async (req, res) => {
    try {
        console.log("passo1");

        let codSanear = [
'10710033',
'10711402',
'10714135',
'10717008',
'10718348',
'10725595',
'10727452',
'10733096',
'10738957',
'10747078',
'10748701',
'10750406',
'10750965',
'10752402',
'10766103',
'10766232',
'10766280',
'10766301',
'10766315',
'10766325',
'10766372',
'10766425',
'10766442',
'10766446',
'10766473',
'10766474',
'10766527',
'10766740',
'10766831',
'10766838',
'10766839',
'10766893',
'10766930',
'10766958',
'10767047',
'10767050',
'10767089',
'10767095',
'10767167',
'10767206',
'10767243',
'10767297',
'10767325',
'10767357',
'10767409',
'10767411',
'10767455',
'10767462',
'10767533',
'10767538',
'10767539',
'10767543',
'10767572',
'10767584',
'10767604',
'10767609',
'10767614',
'10767632',
'10767651',
'10767684',
'10767796',
'10767804',
'10767811',
'10767835',
'10767845',
'10767855',
'10767928',
'10767935',
'10767956',
'10767957',
'10767963',
'10768008',
'10768018',
'10768033',
'10768055',
'10768093',
'10768100',
'10768127',
'10768129',
'10768164',
'10768208',
'10768227',
'10768249',
'10768332',
'10768382',
'10768391',
'10768439',
'10768466',
'10768478',
'10768518',
'10768550',
'10768587',
'10768592',
'10768626',
'10768702',
'10768725',
'10768732',
'10768737',
'10768738',
'10768751',
'10768782',
'10768888',
'10768961',
'10768966',
'10768989',
'10769026',
'10769044',
'10769050',
'10769062',
'10769066',
'10769074',
'10769099',
'10769182',
'10769242',
'10769297',
'10769302',
'10769320',
'10769335',
'10769338',
'10769360',
'10769403',
'10769409',
'10769435',
'10769466',
'10769467',
'10769509',
'10769597',
'10769609',
'10769653',
'10769674',
'10769689',
'10769711',
'10769742',
'10769770',
'10769781',
'10769798',
'10769800',
'10769805',
'10769833',
'10769836',
'10769864',
'10769869',
'10769919',
'10769940',
'10769980',
'10769989',
'10770006',
'10770022',
'10770056',
'10770076',
'10770083',
'10770219',
'10770266',
'10770282',
'10770284',
'10770336',
'10770340',
'10770399',
'10770410',
'10770425',
'10770451',
'10770459',
'10770462',
'10770474',
'10770530',
'10770531',
'10770574',
'10770576',
'10770632',
'10770633',
'10770663',
'10770676',
'10770690',
'10770692',
'10770704',
'10770750',
'10770772',
'10770793',
'10770801',
'10770816',
'10770835',
'10770848',
'10770858',
'10770875',
'10770876',
'10770917',
'10770938',
'10770974',
'10770995',
'10771004',
'10771024',
'10771034',
'10771041',
'10771056',
'10771152',
'10771200',
'10771216',
'10771266',
'10771275',
'10771285',
'10771308',
'10771323',
'10771338',
'10771390',
'10771395',
'10771431',
'10771574',
'10771620',
'10771628',
'10771646',
'10771772',
'10771777',
'10771892',
'10771900',
'10771905',
'10771988',
'10771997',
'10772020',
'10772033',
'10772043',
'10772047',
'10772062',
'10772146',
'10772158',
'10772237',
'10772247',
'10772282',
'10772295',
'10772329',
'10772397',
'10772475',
'10772499',
'10772539',
'10772540',
'10772560',
'10772577',
'10772605',
'10772661',
'10772700',
'10772729',
'10772786',
'10772802',
'10772812',
'10772834',
'10772843',
'10772852',
'10772896',
'10772904',
'10772910',
'10772912',
'10772917',
'10772952',
'10773001',
'10773012',
'10773032',
'10773066',
'10773098',
'10773112',
'10773163',
'10773167',
'10773206',
'10773209',
'10773259',
'10773304',
'10773327',
'10773349',
'10773368',
'10773374',
'10773402',
'10773461',
'10773527',
'10773539',
'10773545',
'10773560',
'10773590',
'10773630',
'10773659',
'10773678',
'10773700',
'10773730',
'10773737',
'10773756',
'10773790',
'10773799',
'10773815',
'10773825',
'10773840',
'10773853',
'10773899',
'10773922',
'10773952',
'10773957',
'10774045',
'10774164',
'10774169',
'10774181',
'10774182',
'10774193',
'10774225',
'10774237',
'10774260',
'10774297',
'10774334',
'10774336',
'10774376',
'10774396',
'10774404',
'10774457',
'10774460',
'10774489',
'10774515',
'10774584',
'10774594',
'10774642',
'10774643',
'10774679',
'10774722',
'10774772',
'10774775',
'10774820',
'10774841',
'10774864',
'10774869',
'10774902',
'10774919',
'10774964',
'10774990',
'10775026',
'10775127',
'10775133',
'10775139',
'10775203',
'10775204',
'10775215',
'10775228',
'10775272',
'10775276',
'10775336',
'10775416',
'10802602',
'11167697',
'11167722',
'11168908',
'11171302',
'11173049',
'11183261',
'11183292',
'11183399',
'11202032',
'11202037',
'11202063',
'11202111',
'11212588',
'11212606',
'11218731',
'11226137',
'11259835',
'11279576',
'11290737',
'11291046',
'11291570',
'11293101',
'11293317',
'11293403',
'11293442',
'11293523',
'11294511',
'11296111',
'11298694',
'11299042',
'11299812',
'11300180',
'11302742',
'11305596',
'11399443',
'11470801',
'11618073',
'11707609',
'11707761',
'11707776',
'11707780',
'11707783',
'11707808',
'11707813',
'11707828',
'11707881',
'11707884',
'11707912',
'11707914',
'11707931',
'11707936',
'11707951',
'11707955',
'11707956',
'11707988',
'11707989',
'11707995',
'11707998',
'11708011',
'11708018',
'11708349',
'11708350',
'11708361',
'11708447',
'11708457',
'11708458',
'11708724',
'11708727',
'11708874',
'11708881',
'11708993',
'11708999',
'11709020',
'11709296',
'11710726',
'11710727',
'11711362',
'11711467',
'11711468',
'11711669',
'11711685',
'11711694',
'11711703',
'11711732',
'11711988',
'11712073',
'11714353',
'11733730',
'11733744',
'11763082',
'11833112'

        ]
    codSanear.forEach(function(item, index, array) {
           console.log(item)
         
  

var dataRegisto = ano+mes+dia;
var horaGreistro = hora+minuto+segundo;
var origemInfo = "APP";
var usuarioAutenticado = "01175828";
var local = "EFCJ-MTR";
//var tag = codigotag;
var locDesintala = "EFCJ-MTR-MVC-EIXNV";
var prefixoComp = '';
var seqComp = 0;
var localEquipPai = '';
var localEquipFilho = '';
var dataTag = "20211129";
var desmontarEquip = "N";
var statusreq = "N";
var tagativo = item;

//inicia
  

 const  knex  = require ('knex')({
   
//const knex = Knex({
    client: 'mssql',
    connection: {
      server: "rdb-rfid-prd.database.windows.net",
      user: 'PJRFID',
      password: 'AwAvIXCj4n7Wwa',
      connectTimeout: 6000000,
      requestTimeout: 6000000,

      options: {
        database: 'BDRFID_PRD',
        encrypt: true
      }

     

 // options: {
//             userName: "PJRFID", 
//             //PRD
//             //password: "AwAvIXCj4n7Wwa" 
//             //QA
//             password: "cTg3NcTskEp4hT" 
//           },
//           type: "default"
//         },
//         //PRD
//         //server: "rdb-rfid-prd.database.windows.net", 
//         //QA
//         server: "rfid-db-qa.database.windows.net", 
//         options: {
//           //QA
//           database: "rfid-db", 
//           //PRD
//           //database: "BDRFID_PRD", 
//           encrypt: true
//         }


     
    }
  })
//fim knex

const inserir = async function()
{
    console.log("passo2");
  try {
   //   var codigoTag ='${rows[i].EQUIPAMENTO.toString().substr(10,18)}';
    const trx =  await knex.transaction()
     const data =  await trx.insert({ OTAA_DT_REGISTRO: `${dataRegisto}`, OTAA_HR_REGISTRO: `${horaGreistro}`, OTAA_IND_ORIGEM: `${origemInfo}`,OTAA_AUTENTICADOR_APLIC: `${usuarioAutenticado}`,OTAA_SIGLA_PREFIXO_INST: `${local}`, OTAA_COD_TAG: `${tagativo}` ,OTAA_COD_LOCAL_DESINSTALACAO: `${locDesintala}`, OTAA_SIGLA_PREFIXO_COMPONENTE: `${prefixoComp}`, OTAA_NUM_SEQ_ORDEM_RODA:`${seqComp}`, OTAA_COD_EQTO_PAI:`${localEquipPai}` , OTAA_COD_LOCAL_NOVO_INST:`${localEquipFilho}`, OTAA_DT_PRIMEIRA_GRAV_TAG:`${dataTag}`, OTAA_IND_DESMONTAR: `${desmontarEquip}`, OTAA_STATUS_SINC: `${statusreq}`  }).into('OTAAT_LEITURA_RFID')
     await trx.commit()
     await  knex.destroy()
   // return data
  
  } catch (error) {
    console.log("passo3");
    knex.destroy()
    console.error(error)
  }
}
// Start function
const start = async function(a, b) {
    const result = await inserir();
    
    console.log(result);
  }
  
  // Call start
  start();
})
  //console.log("Reg>" + i.toString);
  res.status(200).send({ message: "Dados atualizados!" });

//fim
 //fim do for
        //}
    //    console.log("6");
                // client.end();
                // if (err) {
                //     return console.error('Execute error:', err);
                // }
                // console.log("contar linhas: " + rows.length);
                // return res.json(rows);
//fim do client.exec(               
        // });

//fim client.exec(
        // });
       
        //fim do try
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
 //fim rotina   
});

router.post('/exemplo/:id', (request, response) => {
    try {
        console.log('DADOS ENVIADOS PELO BODY')
        console.log(request.body)
        console.log('DADOS ENVIADOS PELA QUERY')
        console.log(request.query)
        console.log('DADOS ENVIADOS COMO PARAMETRO')
        console.log(request.params)
        return response.send({ message: 'ok' })
    } catch (error) {
        return response.status(400).send(error)
    }
})

//passando parametros pelo body
router.post('/movimenta', async (request, response) => {
    try {
        const res = await requestify.request(" https://xp0kc2228f55.ca1.hana.ondemand.com/SCP_APPS/RFIDMNT/api/api_mobile.xsodata/EquipmentMovimentSet", {
          //  const res = await requestify.request(" https://xp0kc2228f55.ca1.hana.ondemand.com/SCP_APPS/RFIDMNT/api/api_mobile.xsodata/EquipmentMovimentSet", {
            method: "POST",
            auth: {
                // username: "C0605310",
                // password: "Seidor@12345"
                username: "RFIDMNTUSER",
                password: "V@le2017@@"
            },
            headers: {
                "Content-Type": "application/json"
            },
            body: request.body
        })
        return response.status(res.getCode()).send(res.body)
    } catch (error) {
        console.log(error)
        return response.status(400).send(error)
    }
})
//passando parametros pelo body
router.post('/notes', (request, response) => {
    try {
        const { local_instalacao } = request.body
        if (!local_instalacao)
            return response.status(400).send({ error: "Favor enviar um local_instalacao" })
        console.log(local_instalacao)
        const client = hdb.createClient(databaseConfig)
        client.connect()
        client.exec(`SELECT DATA_CRIACAO, DT_CONCLUSAO_DESEJADO, NOTA, ORDEM, TXT_BREVE_NOTA, DAYS_BETWEEN (TO_DATE (DATA_CRIACAO, 'dd/MM/yyyy'),CURRENT_DATE) AS DIAS_CARTEIRA, TIPO_NOTA, LOCAL_INSTALACAO ` +
            `FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" ` +
            `WHERE LOCAL_INSTALACAO like '%${local_instalacao}%' AND STATUS_USUARIO NOT LIKE '%REJE%'`,
            (err, rows) => {
                client.end()
                if (err)
                    throw err
                return response.json(rows)
            })
    } catch (error) {
        return response.status(400).send(error)
    }
})

//passando parametros pela query
//insomnia: http://localhost:3000/hana/notes/?local_instalacao=EFVM-MTR-VAG-VGGDE-GDE2012847
router.get('/notes', (request, response) => {
    try {
        const { local_instalacao } = request.query
        if (!local_instalacao)
            return response.status(400).send({ error: "Favor enviar um local_instalacao" })
        console.log(local_instalacao)
        const client = hdb.createClient(databaseConfig)
        client.connect()
        client.exec(`SELECT DATA_CRIACAO, DT_CONCLUSAO_DESEJADO, NOTA, ORDEM, TXT_BREVE_NOTA, DAYS_BETWEEN (TO_DATE (DATA_CRIACAO, 'dd/MM/yyyy'),CURRENT_DATE) AS DIAS_CARTEIRA, TIPO_NOTA, LOCAL_INSTALACAO ` +
            `FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" ` +
            `WHERE LOCAL_INSTALACAO like '%${local_instalacao}%' AND STATUS_USUARIO NOT LIKE '%REJE%'`,
            (err, rows) => {
                client.end()
                if (err)
                    throw err
                return response.json(rows)
            })
    } catch (error) {
        return response.status(400).send(error)
    }
})

router.get('/sincronizar-ordens-rastreio', async (req, res) => {
    let hanaClient;

    try {

        // 1 - Buscar identificadores iniciados por 1
        const rastreios = await Rastreio.findAll({
            attributes: ['identificador'],
            where: {
                identificador: {
                    [Op.like]: '1%'
                }
            }
        });

        const equipamentos = rastreios
            .map(r => r.identificador)
            .filter(Boolean);

        if (equipamentos.length === 0) {
            return res.json([]);
        }

        // 2 - Monta cláusula IN
        const equipamentosIn = equipamentos
            .map(e => `'${e}'`)
            .join(',');

        hanaClient = hdb.createClient(databaseConfig);

        await new Promise((resolve, reject) => {
            hanaClient.connect(err => {
                if (err) reject(err);
                else resolve();
            });
        });

        const sql = `
            SELECT
                EQUIPAMENTO,
                ORDEM,
                CENTRO_TRAB_RESP,
                NOTA,
                STATUS_SISTEMA_OM,
                STATUS_USUARIO_OM,
                DATA_CRIACAO,
                CENTRO_CENTRO_TRABALHO,
                TEXTO_BREVE_OM,
                LOCAL_INSTALACAO
            FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_002"
            WHERE EQUIPAMENTO IN (${equipamentosIn})
              AND TIPO_ORDEM = 'YRR'
            ORDER BY DATA_CRIACAO DESC
        `;

        const rows = await new Promise((resolve, reject) => {
            hanaClient.exec(sql, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        hanaClient.end();

        // 3 - Salvar no MySQL
        if (rows.length > 0) {

            const inserts = rows.map(item => ({
                equipamento: item.EQUIPAMENTO,
                ordem: item.ORDEM,
                centro_trab_resp: item.CENTRO_TRAB_RESP,
                nota: item.NOTA,
                status_sistema_om: item.STATUS_SISTEMA_OM,
                status_usuario_om: item.STATUS_USUARIO_OM,
                data_criacao: item.DATA_CRIACAO,
                centro_centro_trabalho: item.CENTRO_CENTRO_TRABALHO,
                texto_breve_om: item.TEXTO_BREVE_OM,
                local_instalacao: item.LOCAL_INSTALACAO
            }));

            await sequelize.getQueryInterface().bulkInsert(
                'OrdensRastreio',
                inserts
            );
        }

        return res.json(rows);

    } catch (error) {

        if (hanaClient) {
            try {
                hanaClient.end();
            } catch (e) {}
        }

        console.error(error);

        return res.status(500).json({
            erro: error.message
        });
    }
});

//passando parametros por parametros da URL
//insomnia: http://localhost:3000/hana/notes/EFVM-MTR-VAG-VGGDE-GDE2012847
router.get('/notes/:local_instalacao', (request, response) => {
    try {
        const { local_instalacao } = request.params
        if (!local_instalacao)
            return response.status(400).send({ error: "Favor enviar um local_instalacao" })
        console.log(local_instalacao)
        const client = hdb.createClient(databaseConfig)
        client.connect()
        client.exec(`SELECT DATA_CRIACAO, DT_CONCLUSAO_DESEJADO, NOTA, ORDEM, TXT_BREVE_NOTA, DAYS_BETWEEN (TO_DATE (DATA_CRIACAO, 'dd/MM/yyyy'),CURRENT_DATE) AS DIAS_CARTEIRA, TIPO_NOTA, LOCAL_INSTALACAO ` +
            `FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" ` +
            `WHERE LOCAL_INSTALACAO like '%${local_instalacao}%' AND STATUS_USUARIO NOT LIKE '%REJE%'`,
            (err, rows) => {
                client.end()
                if (err)
                    throw err
                return response.json(rows)
            })
    } catch (error) {
        return response.status(400).send(error)
    }
})

router.get("/hana", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        })

        //query de busca
        var sql = `SELECT TOP 5 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005"`;

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });



    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

// router.get("/enviarcsv", async (req, res) => {
//     try {
//         // inicia conexão com o banco
//         const azure = require('azure-storage');
//         const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
//         const accountName = 'account-name';
//         const accountKey = 'account-key';
//         const container = 'container-name';
//         const blobName = 'text.csv';
        
//         const csvStringifier = createCsvStringifier({
//             header: [
//                 {id: 'name', title: 'NAME'},
//                 {id: 'lang', title: 'LANGUAGE'}
//             ]
//         });
//         const records = [
//             {name: 'Bob',  lang: 'French, English'},
//             {name: 'Mary', lang: 'English'}
//         ];
//         const headers = csvStringifier.getHeaderString();
//         const data = csvStringifier.stringifyRecords(records);
//         const blobData = `${headers}${data}`;
        
//         const blobService = azure.createBlobService(accountName, accountKey);
//         const options = {
//             contentSettings: {
//                 contentType: 'text/csv'
//             }
//         }
//         blobService.createBlockBlobFromText(container, blobName, blobData, options, (error, response, result) => {
//             if (error) {
//                 console.log('failed to upload blob');
//                 console.log(error);
//             } else {
//                 console.log('blob uploaded successfully!');
//                 console.log(result);
//             }
//         });


//     } catch (err) {
//         console.log(err);
//         res.status(400).send({ error: "Erro tente novamente" });
//     }
// });

// router.get("tratarlocalsaneamento2:local", async (req, res) => {
//     //ok
//         var client = hdb.createClient(databaseConfig);
//         client.on('error', function (err) {
//             console.log('Network connection error', err);
//             return res.status(400).send({ error: err });
//         });
//         var str = req.params.local.replace("\"", "");
//         var sql = `SELECT TOP 100 EQUIPAMENTO  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52SM52S_CV_005" WHERE LOCAL_INSTALACAO = '${str}' AND (EQUIPAMENTO > 10706740 AND EQUIPAMENTO < 10706850)  ORDER BY EQUIPAMENTO`;
//         console.log("SQL:" + sql);
//         var codigotag = "";
//         client.connect(async function  (err) {
//             if (err) {
//                 console.log(err)
//                 return res.status(400).send({ error: err });
//             }
//             client.exec(sql, async function (err, rows) {
//                 //ok
//                 for(let i = 0; i < rows.length; i = i + 1) {

// //inicio rotina insere
// var dataRegisto = "20210823";
// var horaGreistro = "110125";
// var origemInfo = "APP";
// var usuarioAutenticado = "01175828";
// var local = "EFCJ-MTR";
// var locDesintala = "EFCJ-MTR-MVC-AGSAN-ROD";
// var prefixoComp = '';
// var seqComp = 0;
// var localEquipPai = '';
// var localEquipFilho = '';
// var dataTag = "20210820";
// var desmontarEquip = "N";
// var statusreq = "N";


// const knex = Knex({
//     client: 'mssql',
//     connection: {
//       host: 'rfid-db-qa.database.windows.net',
//       user: 'PJRFID',
//       password: 'cTg3NcTskEp4hT',
//       database: 'rfid-db',
//     }
//   })
//   try {
//     const trx = await knex.transaction()
//     const data = await trx.knex.insert({ OTAA_DT_REGISTRO: '${dataRegisto}', OTAA_HR_REGISTRO: '${horaGreistro}', OTAA_IND_ORIGEM: '${origemInfo}',OTAA_AUTENTICADOR_APLIC: '${usuarioAutenticado}',OTAA_SIGLA_PREFIXO_INST: '${local}', OTAA_COD_TAG: '${rows[i].EQUIPAMENTO.toString().substr(10,18)}',OTAA_COD_LOCAL_DESINSTALACAO: '${locDesintala}', OTAA_SIGLA_PREFIXO_COMPONENTE: '${prefixoComp}', OTAA_NUM_SEQ_ORDEM_RODA:{seqComp}, OTAA_COD_EQTO_PAI:'${localEquipPai}' , OTAA_COD_LOCAL_NOVO_INST:'${localEquipFilho}', OTAA_DT_PRIMEIRA_GRAV_TAG:'${dataTag}', OTAA_IND_DESMONTAR: '${desmontarEquip}', OTAA_STATUS_SINC: '${statusreq}'  }).into('OTAAT_LEITURA_RFID')
//    await trx.commit()
//     await knex.destroy()
//     return data
//   } catch (error) {
//     knex.destroy()
//     console.error(error)
//   }

// };
// });

router.get("/ListarAtivoslocalsaneamento3/:local/:ativos/:numequip", async (req, res) => {
    //router.get("/tratarlocalsaneamento3/:local/:qtdregistros/:maiorque", async (req, res) => {
    try {

        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });
        var str = req.params.local.replace("\"", "");
        var str2 = req.params.ativos.replace("\"", "");
        //var str2 = req.params.qtdregistros.replace("\"", "");
        var str3 = req.params.numequip.replace("\"", "");
       //const cstr2 = parseInt(str2);
       const cstr3 = parseInt(str3);
        //para teste de envio fora da posição de saneamento
        var sql = `SELECT TOP 300 EQUIPAMENTO  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO = '${str}' AND (EQUIPAMENTO > ${cstr3}) AND (EQUIPAMENTO NOT IN ('${str2}'))  ORDER BY EQUIPAMENTO`; 
        console.log("SQL:" + sql);

        client.connect(async function  (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, async function (err, rows) {
                for(let i = 0; i < rows.length; i = i + 1) {
                    //var startTime = new Date(object.date).toISOString();
                   

                    //console.log(dateStr); // => Date in format 'YYYY-MM-DDTHH:mm:ssZ'



  console.log("Reg>" + i.toString);

//fim
 //fim do for
        }
    //    console.log("6");
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                console.log("contar linhas: " + rows.length);
                return res.json(rows);
//fim do client.exec(               
        });

//fim client.exec(
        });
       
        //fim do try
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
 //fim rotina   
});

router.get("/tratarlocalsaneamento3/:local/:ativos/:numequip", async (req, res) => {
    //router.get("/tratarlocalsaneamento3/:local/:qtdregistros/:maiorque", async (req, res) => {
    try {

        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });
        var str = req.params.local.replace("\"", "");
        var str2 = req.params.ativos.replace("\"", "");
        //var str2 = req.params.qtdregistros.replace("\"", "");
        var str3 = req.params.numequip.replace("\"", "");
       //const cstr2 = parseInt(str2);
       const cstr3 = parseInt(str3);
        //para teste de envio fora da posição de saneamento
        var sql = `SELECT top 1000 EQUIPAMENTO  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO = '${str}' AND (EQUIPAMENTO > ${cstr3}) AND (EQUIPAMENTO NOT IN ('${str2}'))  ORDER BY EQUIPAMENTO`; 
        console.log("SQL:" + sql);

        client.connect(async function  (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, async function (err, rows) {
                for(let i = 0; i < rows.length; i = i + 1) {
                    //var startTime = new Date(object.date).toISOString();
                   

                    //console.log(dateStr); // => Date in format 'YYYY-MM-DDTHH:mm:ssZ'

var dataRegisto = ano+mes+dia;
var horaGreistro = hora+minuto+segundo;
var origemInfo = "APP";
var usuarioAutenticado = "01175828";
var local = "EFCJ-MTR";
//var tag = codigotag;
var locDesintala = "EFCJ-MTR-MVC-AGSAN-ROD";
var prefixoComp = '';
var seqComp = 0;
var localEquipPai = '';
var localEquipFilho = '';
var dataTag = "20211129";
var desmontarEquip = "N";
var statusreq = "N";

//inicia
  

const knex = require('knex')({
//const knex = Knex({
    client: 'mssql',
    connection: {
      server: 'rdb-rfid-prd.database.windows.net',
      user: 'PJRFID',
      password: 'AwAvIXCj4n7Wwa',
      options: {
        database: 'BDRFID_PRD',
        encrypt: true
      }

     
    }
  })
//fim knex

  try {
   //   var codigoTag ='${rows[i].EQUIPAMENTO.toString().substr(10,18)}';
    const trx = await knex.transaction()
     const data = await trx.insert({ OTAA_DT_REGISTRO: `${dataRegisto}`, OTAA_HR_REGISTRO: `${horaGreistro}`, OTAA_IND_ORIGEM: `${origemInfo}`,OTAA_AUTENTICADOR_APLIC: `${usuarioAutenticado}`,OTAA_SIGLA_PREFIXO_INST: `${local}`, OTAA_COD_TAG: `${rows[i].EQUIPAMENTO.toString().substr(10,18)}` ,OTAA_COD_LOCAL_DESINSTALACAO: `${locDesintala}`, OTAA_SIGLA_PREFIXO_COMPONENTE: `${prefixoComp}`, OTAA_NUM_SEQ_ORDEM_RODA:`${seqComp}`, OTAA_COD_EQTO_PAI:`${localEquipPai}` , OTAA_COD_LOCAL_NOVO_INST:`${localEquipFilho}`, OTAA_DT_PRIMEIRA_GRAV_TAG:`${dataTag}`, OTAA_IND_DESMONTAR: `${desmontarEquip}`, OTAA_STATUS_SINC: `${statusreq}`  }).into('OTAAT_LEITURA_RFID')
    await trx.commit()
     await knex.destroy()
   // return data
  
  } catch (error) {
    knex.destroy()
    console.error(error)
  }

  console.log("Reg>" + i.toString);

//fim
 //fim do for
        }
    //    console.log("6");
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                console.log("contar linhas: " + rows.length);
                return res.json(rows);
//fim do client.exec(               
        });

//fim client.exec(
        });
       
        //fim do try
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
 //fim rotina   
});

router.get("/tratarlocalsaneamentoQA/:local/:ativos/:numequip", async (req, res) => {
    //router.get("/tratarlocalsaneamento3/:local/:qtdregistros/:maiorque", async (req, res) => {
    try {

        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });
        var str = req.params.local.replace("\"", "");
        var str2 = req.params.ativos.replace("\"", "");
        //var str2 = req.params.qtdregistros.replace("\"", "");
        var str3 = req.params.numequip.replace("\"", "");
       //const cstr2 = parseInt(str2);
       const cstr3 = parseInt(str3);
        //para teste de envio fora da posição de saneamento
        var sql = `SELECT TOP 10 EQUIPAMENTO  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO = '${str}' AND (EQUIPAMENTO > ${cstr3}) AND (EQUIPAMENTO NOT IN ('${str2}'))  ORDER BY EQUIPAMENTO`; 
        console.log("SQL:" + sql);

        client.connect(async function  (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, async function (err, rows) {
                for(let i = 0; i < rows.length; i = i + 1) {
                    //var startTime = new Date(object.date).toISOString();
                   

                    //console.log(dateStr); // => Date in format 'YYYY-MM-DDTHH:mm:ssZ'

//var dataRegisto = ano+mes+dia;
var dataRegisto = "20191015";
var horaGreistro = hora+minuto+segundo;
var origemInfo = "APP";
var usuarioAutenticado = "01175828";
var local = "EFCJ-MTR";
//var tag = codigotag;
var locDesintala = "EFCJ-MTR-MVC-AGSAN-ROD";
var prefixoComp = '';
var seqComp = 0;
var localEquipPai = '';
var localEquipFilho = '';
var dataTag = "20191015";
var desmontarEquip = "N";
var statusreq = "N";

//inicia
  

const knex = require('knex')({
//const knex = Knex({
    client: 'mssql',
    connection: {
      server: 'rfid-db-qa.database.windows.net',
      user: 'PJRFID',
      password: 'cTg3NcTskEp4hT',
      options: {
        database: 'rfid-db',
        encrypt: true
      }

     
    }
  })
//fim knex

  try {
   //   var codigoTag ='${rows[i].EQUIPAMENTO.toString().substr(10,18)}';
    const trx = await knex.transaction()
     const data = await trx.insert({ OTAA_DT_REGISTRO: `${dataRegisto}`, OTAA_HR_REGISTRO: `${horaGreistro}`, OTAA_IND_ORIGEM: `${origemInfo}`,OTAA_AUTENTICADOR_APLIC: `${usuarioAutenticado}`,OTAA_SIGLA_PREFIXO_INST: `${local}`, OTAA_COD_TAG: `${rows[i].EQUIPAMENTO.toString().substr(10,18)}` ,OTAA_COD_LOCAL_DESINSTALACAO: `${locDesintala}`, OTAA_SIGLA_PREFIXO_COMPONENTE: `${prefixoComp}`, OTAA_NUM_SEQ_ORDEM_RODA:`${seqComp}`, OTAA_COD_EQTO_PAI:`${localEquipPai}` , OTAA_COD_LOCAL_NOVO_INST:`${localEquipFilho}`, OTAA_DT_PRIMEIRA_GRAV_TAG:`${dataTag}`, OTAA_IND_DESMONTAR: `${desmontarEquip}`, OTAA_STATUS_SINC: `${statusreq}`  }).into('OTAAT_LEITURA_RFID')
    await trx.commit()
     await knex.destroy()
   // return data
  
  } catch (error) {
    knex.destroy()
    console.error(error)
  }

  console.log("Reg>" + i.toString);

//fim
 //fim do for
        }
    //    console.log("6");
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                console.log("contar linhas: " + rows.length);
                return res.json(rows);
//fim do client.exec(               
        });

//fim client.exec(
        });
       
        //fim do try
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
 //fim rotina   
});
router.get("/tratarlocalsaneamento/:local", async (req, res) => {
    try {
//         let date_ob = new DateTime();
//         let date = ("0" + date_ob.getDate()).slice(-2);

// // current month
// let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// // current year
// let year = date_ob.getFullYear();

// // current hours
// let hours = date_ob.getHours();

// // current minutes
// let minutes = date_ob.getMinutes();

// // current seconds
// let seconds = date_ob.getSeconds();
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });
        var str = req.params.local.replace("\"", "");
       
        //query de busca
        //var sql = `SELECT COUNT(LOCAL_INSTALACAO) AS TOTAL_LOCINST   FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO = '${str}'`;
       //padrão
        // var sql = `SELECT TOP 100 EQUIPAMENTO  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO = '${str}' AND (EQUIPAMENTO > 10706740 AND EQUIPAMENTO < 10706850)  ORDER BY EQUIPAMENTO`;
        //para teste de envio fora da posição de saneamento
        var sql = `SELECT TOP 11 EQUIPAMENTO  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE (LOCAL_INSTALACAO <> '${str}' AND LOCAL_INSTALACAO <> 'EFCJ-MTR-MVC-AGSAN-ROD')AND ( LOCAL_INSTALACAO like 'EFCJ-MTR%') AND (EQUIPAMENTO > 10715365)  ORDER BY EQUIPAMENTO`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT DISTINCT EQUIPAMENTO, LOCAL_INSTALACAO, IDENTIFICACAO_TECNICA FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND IDENTIFICACAO_TECNICA like '%${str}%'`;
        //var sql = `SELECT TOP 5 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001"`;
 
//termina
        console.log("SQL:" + sql);
var codigotag = "";
        client.connect(async function  (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, async function (err, rows) {
                for(let i = 0; i < rows.length; i = i + 1) {
                   
  //                  console.log(rows[i]);
      
                  //codigotag = codigotag.toString().substr(10,18);
//                                        console.log("codtag:" + codigotag);
                   
// //comeca

//   console.debug("connection:" + connection);
// if (connection == null)
// {
//     connection = new Connection(config);
// }
// //termina

//  codigotag = "";
 // codigotag = rows[i].EQUIPAMENTO.toString().substr(10,18);
var dataRegisto = "20210823";
var horaGreistro = "115825";
var origemInfo = "APP";
var usuarioAutenticado = "01175828";
var local = "EFCJ-MTR";
//var tag = codigotag;
var locDesintala = "EFCJ-MTR-MVC-AGSAN-ROD";
var prefixoComp = '';
var seqComp = 0;
var localEquipPai = '';
var localEquipFilho = '';
var dataTag = "20210820";
var desmontarEquip = "N";
var statusreq = "N";

const config = {
    authentication: {
      options: {
        userName: "PJRFID", 
       //PRD
        password: "AwAvIXCj4n7Wwa" 
        //QA
       //password: "cTg3NcTskEp4hT" 
      },
      type: "default"
    },
//     //PRD
//     //server: "rdb-rfid-prd.database.windows.net", 
//     //QA
   server: "rdb-rfid-prd.database.windows.net", 
   options: {
      //QA
     //database: "rfid-db", 
//       //PRD
    database: "BDRFID_PRD", 
     encrypt: true
    }
 };

//  if (connection == null)
//  {
    const connection = new Connection(config);
    console.debug("connection" + connection);
    // connection = new Connection(config);
//  }

// Attempt to connect and execute queries if connection goes through
await connection.on("connect", err => {
//connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
  }
});
await connection.connect();
 //connection.connect();

function queryDatabase() {
  console.log("Recording rows from the Table...");

  // Read all rows from table
  const request = new Request(
//     `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR) VALUES (${dataRegisto},${horaGreistro}, ${origemInfo}, ${usuarioAutenticado}, ${local}, ${tag}, ${locDesintala}, ${prefixoComp}, ${seqComp}, ${localEquipPai} , ${localEquipFilho} , ${dataTag}, ${desmontarEquip}) `,
    `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG,OTAA_IND_DESMONTAR, OTAA_STATUS_SINC ) VALUES ('${dataRegisto}','${horaGreistro}', '${origemInfo}', '${usuarioAutenticado}', '${local}', '${rows[i].EQUIPAMENTO.toString().substr(10,18)}', '${locDesintala}', '${prefixoComp}', ${seqComp}, '${localEquipPai}' , '${localEquipFilho}' , '${dataTag}','${desmontarEquip}','${statusreq}') `,
    
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );
 // console.log("1");
const data = []
  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
      data.push(column)
    });
    
  });
 // console.log("2");
  connection.execSql(request);
 connection.end;
 // console.log("3");
 //return res.send(data)

// connection.close();
}
//

//termina


                    
                }
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                console.log("contar linhas: " + rows.length);
                return res.json(rows);
               
            }
            );
        });
        
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.get("/localdesinstala/:id/:local", async (req, res) => {
    try {
        var str = req.params.id.replace("\"", "");
        var str1 = req.params.local.replace("\"", "");
console.log('var: ' + str);
        const equipId = str;
	const field = 'EQUIPAMENTO';


        console.log(`Searching for ${equipId} in ${field}`)
        const fileStream = fs.createReadStream('/home/adminvale/API_Hana/src/files/EQUIPAMENTOS.csv');
        const divider = ';'
															

//        const headers = 'EQUIPAMENTO;DESC_EQUIPAMENTO;LOCAL_INSTALACAO;DESC_LOCAL_INSTALACAO;CENTRO_LOCALIZACAO;SYS_STATUS_EQUIPAMENTO;USER_STATUS_EQUIPAMENTO;SYS_STATUS_LOCAL_INST;USER_STATUS_LOCAL_INST;1ROWCOUNT;ATIVO_CRITICO;TIPO_OBJETO;CAMPO_ORDENACAO;NUMERO_SERIE;PERFIL_CATALOGO;IDENTIFICACAO_TECNICA'.split(divider)
//const headers = 'EQUIPAMENTO';
const headers = 'EQUIPAMENTO'.split(divider);
        if (field !== '*' && !headers.includes(field)) {
            return res.status(400).send('Invalid field')
        }
console.log('1');
        const data = await new Promise((resolve, reject) => {
            const r = []
console.log('2');
            fileStream.on('data', (chunk) => {
                const line = chunk.toString().split('\n')
console.log(line.toString()); 
               line.map(l => {
                    if (l.includes(equipId.toString())) {
console.log('3:' + equipId.toString());               
         const obj = {}
                        const lineSplit = l.split(divider)
                        headers.map((h, i) => {
                            obj[h] = lineSplit[i]
console.log('4: ' + obj[h].toString());
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
console.log('5: ' + dataToReturn.toString());        
        if(field !== '*') {
            dataToReturn = data.filter(d => d[field] === equipId.toString())
        }
const  json = JSON.stringify(dataToReturn).replace('[','').replace(']','');
        return res.send(json);
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }    









try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str1 = req.params.local.replace("\"", "");
        //query de busca
//var sql = `SELECT TOP 10 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005"`;
        var sql = `SELECT DISTINCT LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like '${str1}%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT DISTINCT EQUIPAMENTO, LOCAL_INSTALACAO, IDENTIFICACAO_TECNICA FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND IDENTIFICACAO_TECNICA like '%${str}%'`;
        //var sql = `SELECT TOP 5 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001"`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.get("/localdesinstala2/:id/:local", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str1 = req.params.local.replace("\"", "");
        //query de busca
//var sql = `SELECT TOP 10 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005"`;
        var sql = `SELECT DISTINCT CONCAT(CONCAT(CAST(EQUIPAMENTO as INTEGER) ,';'), LOCAL_INSTALACAO) as LOCAL_INSTALACAO  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like '${str1}%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT DISTINCT EQUIPAMENTO, LOCAL_INSTALACAO, IDENTIFICACAO_TECNICA FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND IDENTIFICACAO_TECNICA like '%${str}%'`;
        //var sql = `SELECT TOP 5 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001"`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.get("/localdesinstala3/:id/:local/:local2", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str1 = req.params.local.replace("\"", "");
	var str2 = req.params.local2.replace("\"", "");

        //query de busca
        var sql = `SELECT DISTINCT CONCAT(CONCAT(CAST(EQUIPAMENTO as INTEGER) ,';'), LOCAL_INSTALACAO) as LOCAL_INSTALACAO  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE (LOCAL_INSTALACAO like '${str1}%' OR LOCAL_INSTALACAO like '${str2}%')  AND LOCAL_INSTALACAO like '%${str}%'`;

       // var sql = `SELECT DISTINCT LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO  like '${str1}%' OR LOCAL_INSTALACAO like '${str2}%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT DISTINCT EQUIPAMENTO, LOCAL_INSTALACAO, IDENTIFICACAO_TECNICA FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND IDENTIFICACAO_TECNICA like '%${str}%'`;
        //var sql = `SELECT TOP 5 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001"`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
  

// //exemplo savio
// //orderId equivale ao EQUIPQAMENTO
// export const checkIfWhatsappOrderExists = async ({ orderId }) => {
//     const knex = Knex({
//       client: 'mssql',
//       connection: {
//         host: '', //ip do banco
//         user: '',
//         password: '',
//         database: '',
//       }
//     })
//     try {
//       const trx = await knex.transaction()
//       const data = await trx //tabela
//         .select('*')
//         .from('order')
//         .where({
//          //campo do banco : variave
//             order_id: orderId
//         })
//       await trx.commit()
//       await knex.destroy()
//       return data
//     } catch (error) {
//       knex.destroy()
//       console.error(error)
//     }
//   }
  
// //SAVIO 2
// export const checkIfWhatsappOrderExists = async ({ orderId }) => {
//     const knex = Knex({
//       client: 'mssql',
//       connection: {
//         host: '',
//         user: '',
//         password: '',
//         database: '',
//       }
//     })
//     try {
//       const trx = await knex.transaction()
//       const data = await trx.withSchema('whatsapp')
//         .select('*')
//         .from('order')
//         .where({
//           order_id: orderId
//         })
//       await trx.commit()
//       await knex.destroy()
//       return data
//     } catch (error) {
//       knex.destroy()
//       console.error(error)
//     }
//   }
  
 

  
//   .whereRaw()
//    surprised 1
//    .where({​​​​​        'od.status': 0,        'op.status': 'ACTIVE'      }​​​​​)
  
//await knex.insert({ EQUIPAMENTO: 1223232, TAG: 2232323, LOCAL: "ESQUINA" }).into('order_warning')
  
  
router.get("/caminhao/:id/:local", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str1 = req.params.local.replace("\"", "");
        //query de busca
        //var sql = `SELECT DISTINCT LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like '${str1}%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        var sql = `SELECT DISTINCT LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like '${str1}%' AND  LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT TOP 5 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001"`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);

                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.get("/vagao/:id/:local", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str1 = req.params.local.replace("\"", "");
        //query de busca
        var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like '${str1}%' AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT DISTINCT EQUIPAMENTO, LOCAL_INSTALACAO, IDENTIFICACAO_TECNICA FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND IDENTIFICACAO_TECNICA like '%${str}%'`;
        //var sql = `SELECT TOP 5 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001"`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);

                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
router.get("/vagao2/:id/:local/:local2", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str1 = req.params.local.replace("\"", "");
	var str2 = req.params.local2.replace("\"", "");
        //query de busca
        var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE (LOCAL_INSTALACAO like '${str1}%' OR LOCAL_INSTALACAO like '${str2}%')  AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT DISTINCT EQUIPAMENTO, LOCAL_INSTALACAO, IDENTIFICACAO_TECNICA FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND IDENTIFICACAO_TECNICA like '%${str}%'`;
        //var sql = `SELECT TOP 5 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001"`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);

                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});


router.get("/rodeiro/:id/:local", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str1 = req.params.local.replace("\"", "");
        //query de busca
        // var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        //var sql = `SELECT DISTINCT EQUIPAMENTO, LOCAL_INSTALACAO, IDENTIFICACAO_TECNICA FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND IDENTIFICACAO_TECNICA like '%${str}%'`;
        var sql = `SELECT DISTINCT EQUIPAMENTO, IDENTIFICACAO_TECNICA, LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like '${str1}%' AND EQUIPAMENTO like '%${str}%'`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
router.get("/consultaSAPouID2/:id/:localidade", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str2 = req.params.localidade.replace("\"", "");
        //query de busca
        // var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        var sql = `SELECT DISTINCT EQUIPAMENTO,LOCAL_INSTALACAO,CENTRO_LOCALIZACAO, '013' AS TIPO_OBJETO,IDENTIFICACAO_TECNICA   FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like '${str2}%' AND (EQUIPAMENTO like '%${str}%' OR IDENTIFICACAO_TECNICA like '%${str}%')`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.get("/consultaSAPouID2Tubarao/:id/:localidade/:localidade2", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str2 = req.params.localidade.replace("\"", "");
 	var str3 = req.params.localidade2.replace("\"", "");
        //query de busca
        // var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        var sql = `SELECT DISTINCT EQUIPAMENTO,LOCAL_INSTALACAO,CENTRO_LOCALIZACAO, '013' AS TIPO_OBJETO,IDENTIFICACAO_TECNICA   FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE (LOCAL_INSTALACAO like '${str2}%' OR LOCAL_INSTALACAO like '${str3}%') AND (EQUIPAMENTO like '%${str}%' OR IDENTIFICACAO_TECNICA like '%${str}%')`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.get("/consultaSAPouID2Mina/:id", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
       // var str2 = req.params.localidade.replace("\"", "");
        //query de busca
        // var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        var sql = `SELECT DISTINCT EQUIPAMENTO,LOCAL_INSTALACAO,CENTRO_LOCALIZACAO, '013' AS TIPO_OBJETO,IDENTIFICACAO_TECNICA   FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE  (EQUIPAMENTO like '%${str}%' OR IDENTIFICACAO_TECNICA like '%${str}%')`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
router.get("/equipamento/:id", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
       // var str2 = req.params.localidade.replace("\"", "");
        //query de busca
        // var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        var sql = `SELECT DISTINCT EQUIPAMENTO,LOCAL_INSTALACAO,CENTRO_LOCALIZACAO, '013' AS TIPO_OBJETO,IDENTIFICACAO_TECNICA   FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE  (EQUIPAMENTO like '%${str}%')`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
router.get("/equipamentoSudeste", async (req, res) => {
    try {
        console.log("CONFIG HANA:");
        console.log(databaseConfig);
        var client = hdb.createClient(databaseConfig);

        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var sql = `SELECT DISTINCT
            "EQUIPAMENTO",
            "DESC_EQUIPAMENTO",
            "CENTRO_LOCALIZACAO",
            "IDENTIFICACAO_TECNICA",
            "LOCAL_INSTALACAO",
            "DESC_LOCAL_INSTALACAO"
        FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005"
        WHERE IDENTIFICACAO_TECNICA IS NOT NULL
          AND IDENTIFICACAO_TECNICA <> ''
          AND "SYS_STATUS_EQUIPAMENTO" NOT LIKE '%INAT%'
          AND "CENTRO_LOCALIZACAO" IN (
              '1081',
              '1103',
              '1083',
              '1070',
              '1095',
              '1079',
              '1116',
              '1072',
              '1077',
              '1076',
              '4264',
              '4143',
              '1106',
              '1074',
              '1110',
              '9041',
              '4144',
              '1284',
              '1118',
              '1111',
              '1165'
          )`;

        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                return res.status(400).send({ error: err });
            }

            client.exec(sql, function (err, rows) {
                client.end();

                if (err) {
                    return res.status(400).send({ error: err });
                }

                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.get("/consultaSAPouIDMina/:id", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        //var str1 = req.params.local.replace("\"", "");
        //query de busca
        // var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        var sql = `SELECT DISTINCT CONCAT(CONCAT(CAST(EQUIPAMENTO as INTEGER) ,'-'), IDENTIFICACAO_TECNICA) as EQPIDTEC  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE  (EQUIPAMENTO like '%${str}%' OR  (IDENTIFICACAO_TECNICA like '%${str}%') AND (IDENTIFICACAO_TECNICA <> '' AND EQUIPAMENTO <> ''))`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});


router.get("/consultaSAPouID/:id/:local", async (req, res) => {
///:local 
   try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str1 = req.params.local.replace("\"", "");
        //query de busca
        // var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        var sql = `SELECT DISTINCT CONCAT(CONCAT(CAST(EQUIPAMENTO as INTEGER) ,'-'), IDENTIFICACAO_TECNICA) as EQPIDTEC  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like '${str1}%'AND IDENTIFICACAO_TECNICA like '51R%' AND (EQUIPAMENTO like '%${str}%' OR  (IDENTIFICACAO_TECNICA like '%${str}%' AND IDENTIFICACAO_TECNICA like '51R%') AND (IDENTIFICACAO_TECNICA <> '' AND EQUIPAMENTO <> ''))`;
        console.log("SQL:" + sql);
console.log('consultaSAPouID');
        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
router.get("/consultaSAPouIDTubarao/:id/:local/:local2", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str1 = req.params.local.replace("\"", "");
	var str2 = req.params.local2.replace("\"", "");
        //query de busca
        // var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        var sql = `SELECT DISTINCT CONCAT(CONCAT(CAST(EQUIPAMENTO as INTEGER) ,'-'), IDENTIFICACAO_TECNICA) as EQPIDTEC  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE (LOCAL_INSTALACAO like '${str1}%' OR LOCAL_INSTALACAO like '${str2}%') AND (IDENTIFICACAO_TECNICA like 'EE%' OR IDENTIFICACAO_TECNICA like 'EK%') AND (IDENTIFICACAO_TECNICA  like '%${str}%') AND (IDENTIFICACAO_TECNICA <> '' AND EQUIPAMENTO <> '')`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});


router.get("/consultaSAPouID2/:id/:local", async (req, res) => {
    try {
        // inicia conexão com o banco
        var client = hdb.createClient(databaseConfig);
        client.on('error', function (err) {
            console.log('Network connection error', err);
            return res.status(400).send({ error: err });
        });

        var str = req.params.id.replace("\"", "");
        var str2 = req.params.local.replace("\"", "");
        //query de busca
        // var sql = `SELECT DISTINCT LEFT(LOCAL_INSTALACAO,29) AS LOCAL_INSTALACAO FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%' AND LENGTH(LOCAL_INSTALACAO)=29`;
        //var sql = `SELECT top  1 * FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_001" WHERE LOCAL_INSTALACAO like 'EFCJ-MTR%' AND LOCAL_INSTALACAO like '%${str}%'`;
        var sql = `SELECT DISTINCT CONCAT(CONCAT(CAST(EQUIPAMENTO as INTEGER) ,'-'), IDENTIFICACAO_TECNICA) as EQPIDTEC  FROM "_SYS_BIC"."HIW_PRD.E.SISTEMAS.M52S/M52S_CV_005" WHERE LOCAL_INSTALACAO like '${str2}%' AND (EQUIPAMENTO like '%${str}%' OR IDENTIFICACAO_TECNICA like '%${str}%')`;
        console.log("SQL:" + sql);

        client.connect(function (err) {
            if (err) {
                console.log(err)
                return res.status(400).send({ error: err });
            }
            client.exec(sql, function (err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                return res.json(rows);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
module.exports = app => app.use('/hana', router)
