const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");

let sequelize;

if (process.env.NODE_ENV === "production") {
   sequelize = new Sequelize(
      "db8s2lm3nc0hp9",
      "mssjrtppzqoxku",
      "c0f472454343fb8f041d4f5fb60c0b1dcd10c5f5d04e6141b04186c797b82048",
      {
         host: "ec2-54-84-182-168.compute-1.amazonaws.com",
         dialect:
            "postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
         logging: true,
      }
   );
} else {
   //Passing parameters separately (other dialects)
   sequelize = new Sequelize("userapipokemons", "postgres", "root", {
      host: "localhost",
      dialect:
         "postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
      logging: false,
   });
}

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
