module.exports = (sequelize, DataTypes) => {
   return sequelize.define("activationToken", {
      email: {
         type: DataTypes.STRING,
         primaryKey: true,
         require: true
      },
      token: {
         type: DataTypes.STRING,
         require: true,
      },
   });
};