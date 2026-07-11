require('dotenv').config();

const sql = require('mssql');

const config = {
    server: process.env.SQL_SERVER_HOST,
    database: process.env.SQL_SERVER_DATABASE,
    user: process.env.SQL_SERVER_USER,
    password: process.env.SQL_SERVER_PASSWORD,
    port: Number(process.env.SQL_SERVER_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

let pool;

async function getConnection() {

    if (pool) {
        return pool;
    }

    pool = await sql.connect(config);

    return pool;
}

module.exports = {
    sql,
    getConnection
};
