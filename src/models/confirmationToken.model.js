module.exports = (sequelize, DataTypes) => {
   return sequelize.define("activationToken", {
      email: {
         type: DataTypes.STRING,
         require: true
      },
      token: {
         type: DataTypes.STRING,
         require: true,
         primaryKey: true,
      },
   });
};