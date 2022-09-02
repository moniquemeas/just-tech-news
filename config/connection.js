//import the Sequelize constructor from the library
const Sequelize = require('sequelize');


require('dotenv').config();
let sequelize;
if(process.env.JASWDB_URL){
    sequelize = new Sequelize(process.env.JASWDB_URL);
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });
}


//create connection to our database, pass in your MySQL information for username and password

module.exports = sequelize;