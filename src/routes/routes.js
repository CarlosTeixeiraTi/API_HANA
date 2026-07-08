const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '../controllers/');

module.exports = app => {

    fs.readdirSync(filepath)
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            require(path.resolve(filepath, file))(app);
        });

};
