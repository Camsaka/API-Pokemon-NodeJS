const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('../models/user.model');
const confirmationTokenModel = require("../models/confirmationToken.model");
const bcrypt = require('bcrypt');

let sequelize;

if (process.env.NODE_ENV === 'production') {
   sequelize = new Sequelize(
      'zux7qwgu5uxij5ke',
      'st2ieumd8bpvbm7t',
      'hyvxqkhq2cm7m6ds',
      {
         host: 'u3r5w4ayhxzdrw87.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
         port: '3306',
         dialect:
            'mariadb' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
         logging: true,
      }
   );
} else {
   //Passing parameters separately (other dialects)
   sequelize = new Sequelize('usersapipokemons', 'root', '', {
      host: 'localhost',
      port: '3307',
      dialect:
         'mariadb' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
      logging: false,
   });
}

const User = UserModel(sequelize, DataTypes);
const confirmationToken = confirmationTokenModel(sequelize, DataTypes);

sequelize
   .authenticate()
   .then((_) =>
      console.log('Connection has been established successfully. mariadb')
   )
   .catch((error) => {
      console.error('Unable to connect to the database:', error);
   });

const initDB = () => {
   return sequelize.sync({ force: true }).then((_) => {
      console.log('Init user');
      const myPlaintextPassword = 'camsaka';
      bcrypt.hash(myPlaintextPassword, 10).then((hash) => {
         User.create({
            username: 'camsaka',
            email : "camille.gaut@sfr.fr",
            password: hash,
            active : true
         }).then((user) => console.log(user));
      });
   });
};

module.exports = { initDB, User, confirmationToken };
