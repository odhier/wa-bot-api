const { DataTypes } = require("sequelize");
const sequelize = require("../config/database")
const useBcrypt = require('sequelize-bcrypt');

const User = sequelize.define("user", {
  name: DataTypes.STRING,
  username: {
    type:DataTypes.STRING,
    unique: true
  },
  password: DataTypes.STRING,
  photo: {type: DataTypes.TEXT, allowNull: true},
  role: {
    type: DataTypes.ENUM,
    values: ['Superuser', 'Verificator', 'Broadcaster'],
    defaultValue: 'Verificator'
  },
  isDeleted: {
    type: DataTypes.ENUM,
    values: ['0','1'],
    defaultValue: '0'
  }
});
const options = {
  field: 'password', // secret field to hash, default: 'password'
  rounds: 12, // used to generate bcrypt salt, default: 12
  compare: 'authenticate', // method used to compare secrets, default: 'authenticate'
}
useBcrypt(User, options);

module.exports = User;