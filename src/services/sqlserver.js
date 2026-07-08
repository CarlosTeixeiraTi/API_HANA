const sql = require('mssql');

const config = {
    server: 'sql-siam-002-prd.database.windows.net',
    database: 'sqldb-siam-002-prd',
    user: 'PJVIPMOINHOS',
    password: "sNk#3sRw%xgvt#>HeGj,",
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

module.exports = {
    sql,
    config
};