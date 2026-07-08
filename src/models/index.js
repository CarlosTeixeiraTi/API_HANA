
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const db = {};

const sequelize = new Sequelize({
    username: "mysqlapi",
    password: "Vale@12345678",
    database: "db_MVP",
    host: "10.44.32.193",
    dialect: "mysql"
});

fs.readdirSync(__dirname)

    .filter(file =>
        (file.indexOf('.') !== 0) &&
        (file !== path.basename(__filename)) &&
        (file.slice(-3) === '.js')
    )

    .forEach(file => {

        const model = require(
            path.join(__dirname, file)
        )(sequelize, Sequelize.DataTypes);

        db[model.name] = model;

    });

Object.keys(db).forEach(modelName => {

    if (db[modelName].associate) {
        db[modelName].associate(db);
    }

});

sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
