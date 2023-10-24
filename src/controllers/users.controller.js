const { User } = require("../database/postgres");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");

class usersController {
   async login(req, res) {
      User.findOne({ where: { username: req.body.username } })
         .then((user) => {
            if (!user) {
               const message = "Cet utilisateur n'existe pas";
               return res.status(404).json({ message });
            }
            bcrypt
               .compare(req.body.password, user.password)
               .then((isPasswordValid) => {
                  if (!isPasswordValid) {
                     const message = "Votre mot de passe est incorrect";
                     return res.status(401).json({ message });
                  }

                  //JWT if user have enter good id and pwd
                  const token = jwt.sign({
                     userId: user.id
                   }, toString(privateKey), { expiresIn: '1h' });

                  const message = "Vous etes bien connecté. Enjoy.";
                  res.json({ message, data: user, token });
               });
         })
         .catch((error) => {
            const message =
               "L'utilisateur n'a pas pu être connecté. Réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
         });
   }
}

module.exports = usersController;
