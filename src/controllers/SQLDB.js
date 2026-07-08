const { Connection, Request } = require("tedious");
const express = require('express');
const HANA = require("./HANA");
const { columns } = require("mssql");
const router = express.Router()

router.get("/", (req, res) => {
    // Create connection to database
try
{
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
    //PRD
    server: "rdb-rfid-prd.database.windows.net", 
    //QA
    //server: "rfid-db-qa.database.windows.net", 
    options: {
      //PRD
      database: "BDRFID_PRD", 
      //QA
      //database: "rfid-db", 
      encrypt: true
    }
  };
  
   
  const connection = new Connection(config);
  
  // Attempt to connect and execute queries if connection goes through
  connection.on("connect", err => {
    if (err) {
      console.error(err.message);
      return res.status(500).send(err)
    } else {
      queryDatabase();
    }
  });
  
  connection.connect();
  
  function queryDatabase() {
    console.log("Reading rows from the Table...");
  
    // Read all rows from table
    const request = new Request(
      `SELECT * from OTAAT_LEITURA_RFID`,
      (err, rowCount) => {
        if (err) {
          console.error(err.message);
console.log("passei 1");
        } else {
          console.log(`${rowCount} row(s) returned`);
console.log("passei 2");
        }
      }
    );
console.log("passei 4");
  const data = []
    request.on("row", columns => {
console.log("passei 5");
      columns.forEach(column => {
    //    console.log("%s\t%s", column.metadata.colName, column.value);
console.log("passei 6");       
 data.push(column)
console.log("passei 7");
      });
      
    });
  console.log("passei 8");
    connection.execSql(request);
console.log("passei 9");
    return res.send(data)
  }
}
catch (error)
{
    return res.status(500).send(error)
}
})


router.post("/ListarTodosAsync01175828", async (req, res) => {
  // Create connection to database
  try
  {
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
      //PRD
      server: "rdb-rfid-prd.database.windows.net", 
      //QA
      //server: "rfid-db-qa.database.windows.net", 
      options: {
        database: "BDRFID_PRD", 
        encrypt: true
      }
    };

 
const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
await connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
   
  }
});

await connection.connect();

 function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request =  new Request(
    `SELECT * from OTAAT_LEITURA_RFID WHERE OTAA_AUTENTICADOR_APLIC = '01175828' AND OTAA_ID_RFID > 239000`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(error)
      } else {
      console.log(`${rowCount} row(s) returned`)
      return res.json(data);
      //request.on("finish",()=>{return res.send(data)});
      // if (results.length) {
      //   return res.json(results);
      //   }
      }
    }
  );
const data = []
 request.on("row", columns => {
   const aux ={}
     columns.forEach(column => {
       aux[column.metadata.colName]= column.value
 //  console.log("%s\t%s", column.metadata.colName, column.value);
     });
  data.push(aux)
 // data.push(column.metadata.colName,  column.value)
  
  //data.push(column.value)
  });
  
 

   connection.execSql(request);
  
   //return res.json(data)  
 // return res.send(data)
  //return res.json(data);
}
}
catch (error)
{
  return res.status(500).send(error)
}
})
router.post("/ListarTodosAsync", async (req, res) => {
  // Create connection to database
  try
  {
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
      //PRD
      server: "rdb-rfid-prd.database.windows.net", 
      //QA
      //server: "rfid-db-qa.database.windows.net", 
      options: {
        database: "BDRFID_PRD", 
        encrypt: true
      }
    };

 
const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
await connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
   
  }
});

await connection.connect();

 function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request =  new Request(
   // `SELECT *  from OTAAT_LEITURA_RFID WHERE OTAA_AUTENTICADOR_APLIC ='01175828' AND  OTAA_ID_RFID > 14100`,
  `SELECT * from OTAAT_LEITURA_RFID WHERE OTAA_AUTENTICADOR_APLIC <> '01175828' AND OTAA_AUTENTICADOR_APLIC <> 'SCCF01' AND OTAA_ID_RFID > 172633`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(error)
      } else {
      console.log(`${rowCount} row(s) returned`)
      return res.json(data);
      //request.on("finish",()=>{return res.send(data)});
      // if (results.length) {
      //   return res.json(results);
      //   }
      }
    }
  );
const data = []
 request.on("row", columns => {
   const aux ={}
     columns.forEach(column => {
       aux[column.metadata.colName]= column.value
 //  console.log("%s\t%s", column.metadata.colName, column.value);
     });
  data.push(aux)
 // data.push(column.metadata.colName,  column.value)
  
  //data.push(column.value)
  });
  
 

   connection.execSql(request);
  
   //return res.json(data)  
 // return res.send(data)
  //return res.json(data);
}
}
catch (error)
{
  return res.status(500).send(error)
}
})

router.post("/ListarHanaRegistrarAzure", async (req, res) => {
  // Create connection to database
  try
  {
      const config = {
      authentication: {
        options: {
          userName: "PJRFID", 
          //PRD
          //password: "AwAvIXCj4n7Wwa" 
          //QA
          password: "cTg3NcTskEp4hT" 
        },
        type: "default"
      },
      //PRD
      //server: "rdb-rfid-prd.database.windows.net", 
      //QA
      server: "rfid-db-qa.database.windows.net", 
      options: {
        database: "rfid-db",
        //PRD
        //database: "BDRFID_PRD", 
        encrypt: true
      }
    };

 
const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
await connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
   
  }
});

await connection.connect();

 function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request =  new Request(
    `SELECT * FROM  OTAAT_LEITURA_RFID WHERE OTAA_ID_RFID > 61918`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(error)
      } else {
      console.log(`${rowCount} row(s) returned`)
      return res.json(data);
      //request.on("finish",()=>{return res.send(data)});
      // if (results.length) {
      //   return res.json(results);
      //   }
      }
    }
  );
  var resultadoSQL = "";
  var contador =0;
  const ultimaTag ="";
//  const quantidadeLinhas = columns.length;
const data = []
 request.on("row", columns => {
   const aux ={}
     columns.forEach(column => {
      contador = contador + 1;
       aux[column.metadata.colName]= column.value
       if (resultadoSQL =="")
       {
        resultadoSQL = column.value + ',';
       }
       else
       {
         if (quantidadeLinhas == contador )
         {
          resultadoSQL = resultadoSQL + column.value;
          ultimaTag = parseInt(column.value);
         }
         else
         {
          resultadoSQL = resultadoSQL + column.value + ',';
         }
       }
 //  console.log("%s\t%s", column.metadata.colName, column.value);
     });
     console.log("resultadoSQL:" + resultadoSQL);
  data.push(aux)
 // data.push(column.metadata.colName,  column.value)
  
  //data.push(column.value)
  });
  
  connection.execSql(request);
   

  
  
}
}
catch (error)
{
  return res.status(500).send(error)
}
})
router.post("/ListarTodosAsync22", async (req, res) => {
  // Create connection to database
  try
  {
      const config = {
      authentication: {
        options: {
          userName: "PJRFID", 
          //PRD
          //password: "AwAvIXCj4n7Wwa" 
          //QA
          password: "cTg3NcTskEp4hT" 
        },
        type: "default"
      },
      //PRD
      //server: "rdb-rfid-prd.database.windows.net", 
      //QA
      server: "rfid-db-qa.database.windows.net", 
      options: {
        //PRD
        //database: "BDRFID_PRD", 
        //QA
        database: "rfid-db", 
        encrypt: true
      }
    };

 
const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
await connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
   
  }
});

await connection.connect();

 function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request =  new Request(
    `SELECT *  from OTAAT_LEITURA_RFID WHERE OTAA_ID_RFID > 61917`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(error)
      } else {
      console.log(`${rowCount} row(s) returned`)
      return res.json(data);
      //request.on("finish",()=>{return res.send(data)});
      // if (results.length) {
      //   return res.json(results);
      //   }
      }
    }
  );
const data = []
 request.on("row", columns => {
  columns.forEach(column => {
 //  console.log("%s\t%s", column.metadata.colName, column.value);
   //data.push(column)
  data.push(column.metadata.colName,  column.value)
  
  //data.push(column.value)
  });
  
 });

   connection.execSql(request);
  
   //return res.json(data)  
 // return res.send(data)
  //return res.json(data);
}
}
catch (error)
{
  return res.status(500).send(error)
}
})

router.post("/RedimAcessoDBsAsync", async (req, res) => {
  // Create connection to database
  try
  {
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
      //PRD
      server: "rdb-rfid-prd.database.windows.net", 
      //QA
      //server: "rfid-db-qa.database.windows.net", 
      options: {
        database: "BDRFID_PRD", 
        encrypt: true
      }
    };

 
const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
await connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
   
  }
});

await connection.connect();

 function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request =  new Request(
    `ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 4;`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(error)
      } else {
      console.log(`${rowCount} row(s) returned`)
      return res.json(data);
      //request.on("finish",()=>{return res.send(data)});
      // if (results.length) {
      //   return res.json(results);
      //   }
      }
    }
  );
const data = []
 request.on("row", columns => {
  columns.forEach(column => {
 //  console.log("%s\t%s", column.metadata.colName, column.value);
   //data.push(column)
  data.push(column.metadata.colName,  column.value)
  
  //data.push(column.value)
  });
  
 });

   connection.execSql(request);
  
   //return res.json(data)  
 // return res.send(data)
  //return res.json(data);
}
}
catch (error)
{
  return res.status(500).send(error)
}
})


router.post("/RedimAcessoDBsAsyncQA", async (req, res) => {
  // Create connection to database
  try
  {
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
      //PRD
      server: "rdb-rfid-prd.database.windows.net", 
      //QA
      //server: "rfid-db-qa.database.windows.net", 
      options: {
        database: "BDRFID_PRD", 
        //database: "rfid-db", 
        encrypt: true
      }
    };

 
const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
await connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
   
  }
});

await connection.connect();

 function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request =  new Request(
    `ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 4;`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(error)
      } else {
      console.log(`${rowCount} row(s) returned`)
      return res.json(data);
      //request.on("finish",()=>{return res.send(data)});
      // if (results.length) {
      //   return res.json(results);
      //   }
      }
    }
  );
const data = []
 request.on("row", columns => {
  columns.forEach(column => {
 //  console.log("%s\t%s", column.metadata.colName, column.value);
   //data.push(column)
  data.push(column.metadata.colName,  column.value)
  
  //data.push(column.value)
  });
  
 });

   connection.execSql(request);
  
   //return res.json(data)  
 // return res.send(data)
  //return res.json(data);
}
}
catch (error)
{
  return res.status(500).send(error)
}
})
router.get("/UpdateAllYes", (req, res) => {
  // Create connection to database
// try
// {
//   const config = {
//   authentication: {
//     options: {
//       userName: "PJRFID", 
//       password: "cTg3NcTskEp4hT" 
//     },
//     type: "default"
//   },
//   server: "rfid-db-qa.database.windows.net", 
//   options: {
//     database: "rfid-db", 
//     encrypt: true
//   }
// };
try
{
    const config = {
    authentication: {
      options: {
        userName: "PJRFID", 
        //PRD
       // password: "AwAvIXCj4n7Wwa" 
        //QA
        password: "cTg3NcTskEp4hT" 
      },
      type: "default"
    },
    //PRD
   // server: "rdb-rfid-prd.database.windows.net", 
    //QA
    server: "rfid-db-qa.database.windows.net", 
    options: {
      //PRD
     // database: "BDRFID_PRD", 
     //QA
      database: "rfid-db", 
      
      encrypt: true
    }
  };
/* 
    //Use Azure VM Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-vm',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});
    //Use Azure App Service Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-app-service',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});

*/

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
  }
});

connection.connect();

function queryDatabase() {
  console.log("Ajustando acessos simultaneos...");

  // Read all rows from table
  const request = new Request(
   `UPDATE OTAAT_LEITURA_RFID SET OTAA_STATUS_SINC='S' WHERE OTAA_STATUS_SINC='S' AND OTAA_IND_ORIGEM = 'PORTAL'`,
 //  `UPDATE OTAAT_LEITURA_RFID SET OTAA_STATUS_SINC='N' WHERE OTAA_STATUS_SINC='S'`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );
const data = []
  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
      data.push(column)
    });
    
  });

  connection.execSql(request);
  return res.send(data)
}
}
catch (error)
{
  return res.status(500).send(error)
}
})


router.get("/UpdateAllNo", (req, res) => {
  // Create connection to database
  try
  {
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
      //PRD
      server: "rdb-rfid-prd.database.windows.net", 
      //QA
      //server: "rfid-db-qa.database.windows.net", 
      options: {
        database: "BDRFID_PRD", 
         //QA
      //database: "rfid-db", 
        encrypt: true
      }
    };

/* 
    //Use Azure VM Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-vm',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});
    //Use Azure App Service Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-app-service',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});

*/

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
  }
});

connection.connect();

function queryDatabase() {
  console.log("Ajustando acessos simultaneos...");

  // Read all rows from table
  const request = new Request(
   `UPDATE OTAAT_LEITURA_RFID SET OTAA_STATUS_SINC='N'  WHERE OTAA_STATUS_SINC='S'`,
   // `UPDATE OTAAT_LEITURA_RFID SET OTAA_STATUS_SINC='N' WHERE OTAA_STATUS_SINC='S'`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );
const data = []
  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
      data.push(column)
    });
    
  });

  connection.execSql(request);
  return res.send(data)
}
}
catch (error)
{
  return res.status(500).send(error)
}
})

router.get("/DeleteAll", (req, res) => {
  // Create connection to database
  try
  {
      const config = {
      authentication: {
        options: {
          userName: "PJRFID", 
          //PRD
          password: "AwAvIXCj4n7Wwa" 
          //QA
         // password: "cTg3NcTskEp4hT" 
        },
        type: "default"
      },
      //PRD
     server: "rdb-rfid-prd.database.windows.net", 
      //QA
    // server: "rfid-db-qa.database.windows.net", 
//                 connectTimeout: 6000000,
 //                 requestTimeout: 6000000,
                 connectTimeout: 6000000,
                  requestTimeout: 6000000,
      options: {
        database: "BDRFID_PRD", 
 //database: 'rfid-db',
        encrypt: true
      }
    };

/* 
    //Use Azure VM Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-vm',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});
    //Use Azure App Service Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-app-service',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});

*/

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
  }
});

connection.connect();

function queryDatabase() {
  console.log("Ajustando acessos simultaneos...");

  // Read all rows from table
  const request = new Request(
    `DELETE from OTAAT_LEITURA_RFID WHERE OTAA_SIGLA_PREFIXO_INST = 'EFVM'`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );
const data = []
  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
      data.push(column)
    });
    
  });

  connection.execSql(request);
  return res.send(data)
}
}
catch (error)
{
  return res.status(500).send(error)
}
})


router.get("/DeleteAllTrainConsist", (req, res) => {
  // Create connection to database
  try
  {
      const config = {
      authentication: {
        options: {
          userName: "PJRFID", 
          //PRD
          //password: "AwAvIXCj4n7Wwa" 
          //QA
        password: "cTg3NcTskEp4hT" 
        },
        type: "default"
      },
      //PRD
      server: "rfid-db-qa.database.windows.net", 
      //QA
      //server: "rfid-db-qa.database.windows.net", 
      options: {
        database: "rfid-db", 
        encrypt: true
      }
    };

/* 
    //Use Azure VM Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-vm',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});
    //Use Azure App Service Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-app-service',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});

*/

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
  }
});

connection.connect();

function queryDatabase() {
  console.log("Ajustando acessos simultaneos...");

  // Read all rows from table
  const request = new Request(
    `DELETE from OTABT_TRAIN_CONSIST`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );
const data = []
  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
      data.push(column)
    });
    
  });

  connection.execSql(request);
  return res.send(data)
}
}
catch (error)
{
  return res.status(500).send(error)
}
})
router.get("/DeleteAll22", (req, res) => {
  // Create connection to database
  try
  {
      const config = {
      authentication: {
        options: {
          userName: "PJRFID", 
          //PRD
//          password: "AwAvIXCj4n7Wwa" 
          //QA
         password: "cTg3NcTskEp4hT" 
        },
        type: "default"
      },
      //PRD
     // server: "rdb-rfid-prd.database.windows.net", 
      //QA
      server: "rfid-db-qa.database.windows.net", 
                 connectTimeout: 6000000,
                 requestTimeout: 6000000,

      options: {
        //PRD
       // database: "BDRFID_PRD", 
        //QA
        database: "rfid-db", 
        encrypt: true
      }
    };

/* 
    //Use Azure VM Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-vm',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});
    //Use Azure App Service Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-app-service',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});

*/

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    return res.status(500).send(err)
  } else {
    queryDatabase();
  }
});

connection.connect();

function queryDatabase() {
  console.log("Ajustando acessos simultaneos...");

  // Read all rows from table
  const request = new Request(
    `DELETE from OTAAT_LEITURA_RFID`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );
const data = []
  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
      data.push(column)
    });
    
  });

  connection.execSql(request);
  return res.send(data)
}
}
catch (error)
{
  return res.status(500).send(error)
}
})
router.post("/InserirMovimento2/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:prefixocomponente/:seqcomponente/:localinstala5nivel/:localinstala6nivel/:datagravatag/:desmontar/:statussync", async (req, res) => {
//router.post("/InserirMovimento2/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:prefixocomponente/:seqcomponente/:localinstala5nivel/:localinstala6nivel/:datagravatag/:desmontar/:statussync", async (req, res) => {
  // Create connection to database
//router.post("/InserirMovimento2/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:prefixocomponente/:seqcomponente/:localinstala5nivel/:localinstala6nivel/:datagravatag/:desmontar", (req, res) => {
  try
  {
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
      //PRD
      server: "rdb-rfid-prd.database.windows.net", 
      //QA
      //server: "rfid-db-qa.database.windows.net", 
      options: {
        //QA
        //database: "rfid-db",
        //prd
        database: "BDRFID_PRD", 
        
        encrypt: true
      }
    };
  var dataRegisto = req.params.dtregistro.replace("\"", "");
  var horaGreistro = req.params.hrregistro.replace("\"", "");
  var origemInfo = req.params.origem.replace("\"", "");
  var usuarioAutenticado = req.params.usuario.replace("\"", "");
  var local = req.params.localidade.replace("\"", "");
  var tag = req.params.codtag.replace("\"", "");
 var locDesintala = req.params.localdesintala.replace("\"", "");
// var locDesintala ;
// if (local.substring(0,4) == "EFCJ")
// {
//   locDesintala = "EFCJ-MTR-MVC-EIXNV";
// }
// if (local.substring(0,4) == "FEIT")
// {
//   locDesintala = "FEIT-LES-MVC-ALMOX-MINA_REFO";
// }
// if (local.substring(0,4) == "FEBR")
// {
//   locDesintala = "FEBR-LES-MVC-AMRIN-MINBR-REFO";
// }

  var prefixoComp = req.params.prefixocomponente.replace("\"", "");
  var seqComp = req.params.seqcomponente.replace("\"", "");
  var localEquipPai = req.params.localinstala5nivel.replace("\"", "");
  var localEquipFilho = req.params.localinstala6nivel.replace("\"", "");
  var dataTag = req.params.datagravatag.replace("\"", "");
 var desmontarEquip = req.params.desmontar.replace("\"", "");
 var statusreq = req.params.statussync.replace("\"", "");
  //console.log("desmontar:" + desmontarEquip);
  /* 
      //Use Azure VM Managed Identity to connect to the SQL database
      const connection = new Connection({
      server: process.env["db_server"],
      authentication: {
          type: 'azure-active-directory-msi-vm',
      },
      options: {
          database: process.env["db_database"],
          encrypt: true,
          port: 1433
      }
  });
      //Use Azure App Service Managed Identity to connect to the SQL database
      const connection = new Connection({
      server: process.env["db_server"],
      authentication: {
          type: 'azure-active-directory-msi-app-service',
      },
      options: {
          database: process.env["db_database"],
          encrypt: true,
          port: 1433
      }
  });
  
  */
  
  const connection = new Connection(config);
  
  // Attempt to connect and execute queries if connection goes through
  await connection.on("connect", err => {
    if (err) {
      console.error(err.message);
      return res.status(500).send(err)
    } else {
      queryDatabase();
    }
  });
  
  await connection.connect();
  
  function queryDatabase() {
    console.log("Recording rows from the Table...");
  
    // Read all rows from table
    const request = new Request(
 //     `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR) VALUES (${dataRegisto},${horaGreistro}, ${origemInfo}, ${usuarioAutenticado}, ${local}, ${tag}, ${locDesintala}, ${prefixoComp}, ${seqComp}, ${localEquipPai} , ${localEquipFilho} , ${dataTag}, ${desmontarEquip}) `,
 //     `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR, OTAA_STATUS_SINC ) VALUES ('${dataRegisto}','${horaGreistro}', '${origemInfo}', '${usuarioAutenticado}', '${local}', '${tag}', '${locDesintala}', '${prefixoComp}', ${seqComp}, '${localEquipPai}' , '${localEquipFilho}' , '${dataTag}','${desmontarEquip}','${statusreq}') `,
      `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR, OTAA_STATUS_SINC ) VALUES ('${dataRegisto}','${horaGreistro}', '${origemInfo}', '${usuarioAutenticado}', '${local}', '${tag}', '${locDesintala}', '${prefixoComp}', ${seqComp}, '${localEquipPai}' , '${localEquipFilho}' , '${dataTag}','${desmontarEquip}','${statusreq}') `,
      
      (err, rowCount) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );
  const data = []
    request.on("row", columns => {
      columns.forEach(column => {
        console.log("%s\t%s", column.metadata.colName, column.value);
        data.push(column)
      });
      
    });
  
    connection.execSql(request);
    return res.send(data)
   
  }
}
catch (error)
{
    return res.status(500).send(error)
}
})

router.post("/InserirMovimento22/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:datagravatag/:desmontar/:statussync", async (req, res) => {
  // Create connection to database
//router.post("/InserirMovimento2/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:prefixocomponente/:seqcomponente/:localinstala5nivel/:localinstala6nivel/:datagravatag/:desmontar", (req, res) => {
  try
  {
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
      //PRD
      server: "rdb-rfid-prd.database.windows.net", 
      //QA
     // server: "rfid-db-qa.database.windows.net", 
      options: {
        //QA
        //database: "rfid-db", 
        //PRD
        database: "BDRFID_PRD", 
        encrypt: true
      }
    };
  var dataRegisto = req.params.dtregistro.replace("\"", "");
  var horaGreistro = req.params.hrregistro.replace("\"", "");
  var origemInfo = req.params.origem.replace("\"", "");
  var usuarioAutenticado = req.params.usuario.replace("\"", "");
  var local = req.params.localidade.replace("\"", "");
  var tag = req.params.codtag.replace("\"", "");
  var locDesintala = req.params.localdesintala.replace("\"", ""); 
// var locDesintala ;
 if (local.substring(0,4) == "EFCJ")
 {
   locDesintala = "EFCJ-MTR-MVC-EIXNV";
 }
// if (local.substring(0,4) == "FEIT")
// {
//   locDesintala = "FEIT-LES-MVC-ALMOX-MINA_REFO";
// }
// if (local.substring(0,4) == "FEBR")
// {
  // locDesintala = "FEBR-LES-MVC-AMRIN-MINBR-REFO";
// }
 var prefixoComp = '';
  var seqComp = 0;
  var localEquipPai = '';
  var localEquipFilho = '';
  var dataTag = req.params.datagravatag.replace("\"", "");
 var desmontarEquip = req.params.desmontar.replace("\"", "");
 var statusreq = req.params.statussync.replace("\"", "");
  //console.log("desmontar:" + desmontarEquip);
  /* 
      //Use Azure VM Managed Identity to connect to the SQL database
      const connection = new Connection({
      server: process.env["db_server"],
      authentication: {
          type: 'azure-active-directory-msi-vm',
      },
      options: {
          database: process.env["db_database"],
          encrypt: true,
          port: 1433
      }
  });
      //Use Azure App Service Managed Identity to connect to the SQL database
      const connection = new Connection({
      server: process.env["db_server"],
      authentication: {
          type: 'azure-active-directory-msi-app-service',
      },
      options: {
          database: process.env["db_database"],
          encrypt: true,
          port: 1433
      }
  });
  
  */
  
  const connection = new Connection(config);
  
  // Attempt to connect and execute queries if connection goes through
  await connection.on("connect", err => {
    if (err) {
      console.error(err.message);
      return res.status(500).send(err)
    } else {
      queryDatabase();
    }
  });
  
  await connection.connect();
  
  function queryDatabase() {
    console.log("Recording rows from the Table...");
  
    // Read all rows from table
    const request = new Request(
 //     `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR) VALUES (${dataRegisto},${horaGreistro}, ${origemInfo}, ${usuarioAutenticado}, ${local}, ${tag}, ${locDesintala}, ${prefixoComp}, ${seqComp}, ${localEquipPai} , ${localEquipFilho} , ${dataTag}, ${desmontarEquip}) `,
 //     `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR, OTAA_STATUS_SINC ) VALUES ('${dataRegisto}','${horaGreistro}', '${origemInfo}', '${usuarioAutenticado}', '${local}', '${tag}', '${locDesintala}', '${prefixoComp}', ${seqComp}, '${localEquipPai}' , '${localEquipFilho}' , '${dataTag}','${desmontarEquip}','${statusreq}') `,
      `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR, OTAA_STATUS_SINC ) VALUES ('${dataRegisto}','${horaGreistro}', '${origemInfo}', '${usuarioAutenticado}', '${local}', '${tag}', '${locDesintala}', '${prefixoComp}', ${seqComp}, '${localEquipPai}' , '${localEquipFilho}' , '${dataTag}','${desmontarEquip}','${statusreq}') `,
      
         (err, rowCount) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );
  const data = []
    request.on("row", columns => {
      columns.forEach(column => {
        console.log("%s\t%s", column.metadata.colName, column.value);
        data.push(column)
      });
      
    });
  
    connection.execSql(request);
    return res.send(data)
  }
  //connection.close();
}
catch (error)
{
    return res.status(500).send(error)
}
})

router.post("/InserirMovimentoNQA/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:datagravatag/:desmontar/:statussync", async (req, res) => {
  // Create connection to database
//router.post("/InserirMovimento2/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:prefixocomponente/:seqcomponente/:localinstala5nivel/:localinstala6nivel/:datagravatag/:desmontar", (req, res) => {
  try
  {
      const config = {
      authentication: {
        options: {
          userName: "PJRFID", 
          //PRD
          //password: "AwAvIXCj4n7Wwa" 
          //QA
          password: "cTg3NcTskEp4hT" 
        },
        type: "default"
      },
      //PRD
      //server: "rdb-rfid-prd.database.windows.net", 
      //QA
      server: "rfid-db-qa.database.windows.net", 
      options: {
        //QA
        database: "rfid-db", 
        //PRD
        //database: "BDRFID_PRD", 
        encrypt: true
      }
    };
  var dataRegisto = req.params.dtregistro.replace("\"", "");
  var horaGreistro = req.params.hrregistro.replace("\"", "");
  var origemInfo = req.params.origem.replace("\"", "");
  var usuarioAutenticado = req.params.usuario.replace("\"", "");
  var local = req.params.localidade.replace("\"", "");
  var tag = req.params.codtag.replace("\"", "");
  var locDesintala = req.params.localdesintala.replace("\"", "");
  var prefixoComp = '';
  var seqComp = 0;
  var localEquipPai = '';
  var localEquipFilho = '';
  var dataTag = req.params.datagravatag.replace("\"", "");
 var desmontarEquip = req.params.desmontar.replace("\"", "");
 var statusreq = req.params.statussync.replace("\"", "");
  //console.log("desmontar:" + desmontarEquip);
  /* 
      //Use Azure VM Managed Identity to connect to the SQL database
      const connection = new Connection({
      server: process.env["db_server"],
      authentication: {
          type: 'azure-active-directory-msi-vm',
      },
      options: {
          database: process.env["db_database"],
          encrypt: true,
          port: 1433
      }
  });
      //Use Azure App Service Managed Identity to connect to the SQL database
      const connection = new Connection({
      server: process.env["db_server"],
      authentication: {
          type: 'azure-active-directory-msi-app-service',
      },
      options: {
          database: process.env["db_database"],
          encrypt: true,
          port: 1433
      }
  });
  
  */
  
  const connection = new Connection(config);
  
  // Attempt to connect and execute queries if connection goes through
  await connection.on("connect", err => {
    if (err) {
      console.error(err.message);
      return res.status(500).send(err)
    } else {
      queryDatabase();
    }
  });
  
  await connection.connect();
  
  function queryDatabase() {
    console.log("Recording rows from the Table...");
  
    // Read all rows from table
    const request = new Request(
 //     `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR) VALUES (${dataRegisto},${horaGreistro}, ${origemInfo}, ${usuarioAutenticado}, ${local}, ${tag}, ${locDesintala}, ${prefixoComp}, ${seqComp}, ${localEquipPai} , ${localEquipFilho} , ${dataTag}, ${desmontarEquip}) `,
 //     `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR, OTAA_STATUS_SINC ) VALUES ('${dataRegisto}','${horaGreistro}', '${origemInfo}', '${usuarioAutenticado}', '${local}', '${tag}', '${locDesintala}', '${prefixoComp}', ${seqComp}, '${localEquipPai}' , '${localEquipFilho}' , '${dataTag}','${desmontarEquip}','${statusreq}') `,
      `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR, OTAA_STATUS_SINC ) VALUES ('${dataRegisto}','${horaGreistro}', '${origemInfo}', '${usuarioAutenticado}', '${local}', '${tag}', '${locDesintala}', '${prefixoComp}', ${seqComp}, '${localEquipPai}' , '${localEquipFilho}' , '${dataTag}','${desmontarEquip}','${statusreq}') `,
      
         (err, rowCount) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );
  const data = []
    request.on("row", columns => {
      columns.forEach(column => {
        console.log("%s\t%s", column.metadata.colName, column.value);
        data.push(column)
      });
      
    });
  
    connection.execSql(request);
    return res.send(data)
  }
  //connection.close();
}
catch (error)
{
    return res.status(500).send(error)
}
})

router.post("/InserirMovimentoqa/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:prefixocomponente/:seqcomponente/:localinstala5nivel/:localinstala6nivel/:datagravatag/:desmontar/:statussync", async (req, res) => {
  // Create connection to database
//router.post("/InserirMovimento2/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:prefixocomponente/:seqcomponente/:localinstala5nivel/:localinstala6nivel/:datagravatag/:desmontar", (req, res) => {
  try
  {
      const config = {
      authentication: {
        options: {
          userName: "PJRFID", 
          //PRD
         // password: "AwAvIXCj4n7Wwa" 
          //QA
            password: "cTg3NcTskEp4hT" 
        },
        type: "default"
      },
      //PRD
     // server: "rdb-rfid-prd.database.windows.net", 
      //QA
      server: "rfid-db-qa.database.windows.net", 
      options: {
        //PRD
       // database: "BDRFID_PRD", 
        //QA
        database: "rfid-db", 
        encrypt: true
      }
    };
  var dataRegisto = req.params.dtregistro.replace("\"", "");
  var horaGreistro = req.params.hrregistro.replace("\"", "");
  var origemInfo = req.params.origem.replace("\"", "");
  var usuarioAutenticado = req.params.usuario.replace("\"", "");
  var local = req.params.localidade.replace("\"", "");
  var tag = req.params.codtag.replace("\"", "");
  var locDesintala = req.params.localdesintala.replace("\"", "");
  var prefixoComp = req.params.prefixocomponente.replace("\"", "");
  var seqComp = req.params.seqcomponente.replace("\"", "");
  var localEquipPai = req.params.localinstala5nivel.replace("\"", "");
  var localEquipFilho = req.params.localinstala6nivel.replace("\"", "");
  var dataTag = req.params.datagravatag.replace("\"", "");
 var desmontarEquip = req.params.desmontar.replace("\"", "");
 var statusreq = req.params.statussync.replace("\"", "");
  //console.log("desmontar:" + desmontarEquip);
  /* 
      //Use Azure VM Managed Identity to connect to the SQL database
      const connection = new Connection({
      server: process.env["db_server"],
      authentication: {
          type: 'azure-active-directory-msi-vm',
      },
      options: {
          database: process.env["db_database"],
          encrypt: true,
          port: 1433
      }
  });
      //Use Azure App Service Managed Identity to connect to the SQL database
      const connection = new Connection({
      server: process.env["db_server"],
      authentication: {
          type: 'azure-active-directory-msi-app-service',
      },
      options: {
          database: process.env["db_database"],
          encrypt: true,
          port: 1433
      }
  });
  
  */
  
  const connection = new Connection(config);
  
  // Attempt to connect and execute queries if connection goes through
  await connection.on("connect", err => {
    if (err) {
      console.error(err.message);
      return res.status(500).send(err)
    } else {
      queryDatabase();
    }
  });
  
  await connection.connect();
  
  function queryDatabase() {
    console.log("Recording rows from the Table...");
  
    // Read all rows from table
    const request = new Request(
 //     `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR) VALUES (${dataRegisto},${horaGreistro}, ${origemInfo}, ${usuarioAutenticado}, ${local}, ${tag}, ${locDesintala}, ${prefixoComp}, ${seqComp}, ${localEquipPai} , ${localEquipFilho} , ${dataTag}, ${desmontarEquip}) `,
      `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR, OTAA_STATUS_SINC ) VALUES ('${dataRegisto}','${horaGreistro}', '${origemInfo}', '${usuarioAutenticado}', '${local}', '${tag}', '${locDesintala}', '${prefixoComp}', ${seqComp}, '${localEquipPai}' , '${localEquipFilho}' , '${dataTag}','${desmontarEquip}','${statusreq}') `,
      
      (err, rowCount) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );
  const data = []
    request.on("row", columns => {
      columns.forEach(column => {
        console.log("%s\t%s", column.metadata.colName, column.value);
        data.push(column)
      });
      
    });
  
    connection.execSql(request);
    return res.send(data)
  }
}
catch (error)
{
    return res.status(500).send(error)
}
})
// router.post("/InserirMovimento22/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:datagravatag/:desmontar/:statussync", async (req, res) => {
//   // Create connection to database
// //router.post("/InserirMovimento2/:dtregistro/:hrregistro/:origem/:usuario/:localidade/:codtag/:localdesintala/:prefixocomponente/:seqcomponente/:localinstala5nivel/:localinstala6nivel/:datagravatag/:desmontar", (req, res) => {
//   try
//   {
//       const config = {
//       authentication: {
//         options: {
//           userName: "PJRFID", 
//           //PRD
//           //password: "AwavIXCj4n7Wwa" 
//           //QA
//           password: "cTg3NcTskEp4hT" 
//         },
//         type: "default"
//       },
//       //PRD
//      // server: "rdb-rfid-prd.database.windows.net", 
//       //QA
//       server: "rfid-db-qa.database.windows.net", 
//       options: {
//         database: "rfid-db", 
//         encrypt: true
//       }
//     };
//   var dataRegisto = req.params.dtregistro.replace("\"", "");
//   var horaGreistro = req.params.hrregistro.replace("\"", "");
//   var origemInfo = req.params.origem.replace("\"", "");
//   var usuarioAutenticado = req.params.usuario.replace("\"", "");
//   var local = req.params.localidade.replace("\"", "");
//   var tag = req.params.codtag.replace("\"", "");
//   var locDesintala = req.params.localdesintala.replace("\"", "");
//   // var prefixoComp = req.params.prefixocomponente.replace("\"", "");
//   // var seqComp = req.params.seqcomponente.replace("\"", "");
//   // var localEquipPai = req.params.localinstala5nivel.replace("\"", "");
//   // var localEquipFilho = req.params.localinstala6nivel.replace("\"", "");
//   var dataTag = req.params.datagravatag.replace("\"", "");
//  var desmontarEquip = req.params.desmontar.replace("\"", "");
//  var statusreq = req.params.statussync.replace("\"", "");
//   //console.log("desmontar:" + desmontarEquip);
//   /* 
//       //Use Azure VM Managed Identity to connect to the SQL database
//       const connection = new Connection({
//       server: process.env["db_server"],
//       authentication: {
//           type: 'azure-active-directory-msi-vm',
//       },
//       options: {
//           database: process.env["db_database"],
//           encrypt: true,
//           port: 1433
//       }
//   });
//       //Use Azure App Service Managed Identity to connect to the SQL database
//       const connection = new Connection({
//       server: process.env["db_server"],
//       authentication: {
//           type: 'azure-active-directory-msi-app-service',
//       },
//       options: {
//           database: process.env["db_database"],
//           encrypt: true,
//           port: 1433
//       }
//   });
  
//   */
  
//   const connection = new Connection(config);
  
//   // Attempt to connect and execute queries if connection goes through
//   await connection.on("connect", err => {
//     if (err) {
//       console.error(err.message);
//       return res.status(500).send(err)
//     } else {
//       queryDatabase();
//     }
//   });
  
//   await connection.connect();
  
//   function queryDatabase() {
//     console.log("Recording rows from the Table...");
  
//     // Read all rows from table
//     const request = new Request(
//  //     `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO, OTAA_SIGLA_PREFIXO_COMPONENTE,OTAA_NUM_SEQ_ORDEM_RODA,OTAA_COD_EQTO_PAI,OTAA_COD_LOCAL_NOVO_INST,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR) VALUES (${dataRegisto},${horaGreistro}, ${origemInfo}, ${usuarioAutenticado}, ${local}, ${tag}, ${locDesintala}, ${prefixoComp}, ${seqComp}, ${localEquipPai} , ${localEquipFilho} , ${dataTag}, ${desmontarEquip}) `,
//       `INSERT INTO OTAAT_LEITURA_RFID(OTAA_DT_REGISTRO,OTAA_HR_REGISTRO,OTAA_IND_ORIGEM,OTAA_AUTENTICADOR_APLIC,OTAA_SIGLA_PREFIXO_INST,OTAA_COD_TAG,OTAA_COD_LOCAL_DESINSTALACAO,OTAA_DT_PRIMEIRA_GRAV_TAG,OTAA_DT_PRIMEIRA_GRAV_TAG.OTAA_IND_DESMONTAR, OTAA_STATUS_SINC ) VALUES ('${dataRegisto}','${horaGreistro}', '${origemInfo}', '${usuarioAutenticado}', '${local}', '${tag}', '${locDesintala}', '${dataTag}','${desmontarEquip}','${statusreq}') `,
      
//       (err, rowCount) => {
//         if (err) {
//           console.error(err.message);
//         } else {
//           console.log(`${rowCount} row(s) returned`);
//         }
//       }
//     );
//   const data = []
//     request.on("row", columns => {
//       columns.forEach(column => {
//         console.log("%s\t%s", column.metadata.colName, column.value);
//         data.push(column)
//       });
      
//     });
  
//     connection.execSql(request);
//     return res.send(data)
//   }
// }
// catch (error)
// {
//     return res.status(500).send(error)
// }
// })
module.exports = app => app.use('/SQLDB', router)

