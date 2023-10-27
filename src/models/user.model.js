module.exports = (sequelize, DataTypes) => {
   return sequelize.define("Users", {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      username: {
         type: DataTypes.STRING,
         unique: {
            msg: "Le nom est déjà pris.",
         },
         require: true,
      },
      email: {
         type: DataTypes.STRING,
         unique: {
            msg: "Cet email est déja pris.",
         },
         require: true,
      },
      password: {
         type: DataTypes.STRING,
      },
      active : {
         type: DataTypes.BOOLEAN,
         defaultValue: false
      }
   });
};
