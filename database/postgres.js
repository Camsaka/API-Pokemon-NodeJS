const { Sequelize } = require("sequelize");

//Passing parameters separately (other dialects)
const sequelize = new Sequelize('usersapipokemons', 'root', '', {
   host: '127.0.0.1',
   port: '3306',
   dialect:
      'postgres' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
   logging: false
});

sequelize
   .authenticate()
   .then((_) => console.log("Connection has been established successfully."))
   .catch((error) => {
      console.error("Unable to connect to the database:", error);
   });
