const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");

//Passing parameters separately (other dialects)
const sequelize = new Sequelize("userapipokemons", "postgres", "root", {
   host: "localhost",
   dialect:
      "postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
   logging: false,
});

const User = UserModel(sequelize, DataTypes);

sequelize
   .authenticate()
   .then((_) =>
      console.log("Connection has been established successfully. postgres")
   )
   .catch((error) => {
      console.error("Unable to connect to the database:", error);
   });

const initDB = () => {
   return sequelize.sync({ force: true }).then((_) => {
      console.log("Init user");
      const myPlaintextPassword = "camsaka";
      bcrypt.hash(myPlaintextPassword, 5).then((hash) => {
         User.create({
            username: "camsaka",
            password: hash,
         }).then((user) => console.log(user));
      });
   });
};

module.exports = { initDB, User };
