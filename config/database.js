const { Sequelize } = require('sequelize');
require("dotenv").config();
const {DB_HOST,DB_PORT,DB_NAME,DB_USER,DB_PASSWORD} = process.env

module.exports = sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql'
});