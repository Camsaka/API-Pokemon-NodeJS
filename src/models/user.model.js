module.exports = (sequelize, DataTypes) => {
   return sequelize.define('Users', {
     id: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true
     },
     username: {
       type: DataTypes.STRING,
       unique: {
         msg: 'Le nom est déjà pris.'
       }
     },
     password: {
       type: DataTypes.STRING
     }
   })
 }