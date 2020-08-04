require('dotenv').config()
module.exports = {
  "development": {
    // "username": process.env.MYSQL_DB_USERNAME,
    // "password": process.env.MYSQL_DB_PASSWORD,
    // "database": process.env.MYSQL_DB_DATABASE,
    // "host": process.env.MYSQL_DB_HOST,
    // "dialect": process.env.MYSQL_DB_CONNECTION,
    // "operatorsAliases": 1,
    // "logging": false
    "username": "root",// local access
    "password": null,
    "database": "wisekids",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }
}
