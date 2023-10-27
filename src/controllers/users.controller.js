const { User, confirmationToken } = require("../database/postgres");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: "camille.gautier.pro@gmail.com",
      pass: "ecye ysco dzzl bpbf",
   },
});

class usersController {
   //login function with hashed password
   async login(req, res) {
      User.findOne({ where: { username: req.body.username } })
         .then((user) => {
            if (!user) {
               const message = "Cet utilisateur n'existe pas";
               return res.status(404).json({ message });
            }
            if (!user.active) {
               const message = "Valider votre adresse mail.";
               return res.status(401).json({ message });
            }
            bcrypt
               .compare(req.body.password, user.password)
               .then((isPasswordValid) => {
                  if (!isPasswordValid) {
                     const message = "Votre mot de passe est incorrect";
                     return res.status(401).json({ message });
                  }

                  //JWT if user have enter good id and pwd
                  const token = jwt.sign(
                     {
                        userId: user.id,
                     },
                     toString(privateKey),
                     { expiresIn: "1h" }
                  );

                  const message = "Vous etes bien connecté. Enjoy.";
                  res.json({ message, data: user });
               })
               .catch((error) => {
                  const message =
                     "L'utilisateur n'a pas pu être connecté. Réessayer dans quelques instants.";
                  res.status(500).json({ message, data: error });
               });
         })
         .catch((error) => {
            const message =
               "L'utilisateur n'a pas pu être connecté. Réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
         });
   }

   async signup(req, res) {
      const username = req.body.username;
      const email = req.body.email;
      const myPlaintextPassword = req.body.password;
      // const salt = bcrypt.genSalt();
      //creation of the user with hashed password
      bcrypt.hash(myPlaintextPassword, 10).then((hash) => {
         User.create({
            username: username,
            email: email,
            password: hash,
         })
            .then(async (user) => {
               console.log(user);
               const emailToken = await jwt.sign(
                  {
                     user: user.id,
                  },
                  "email secret",
                  {
                     expiresIn: "10m",
                  }
               );
               
               let url;
               if (process.env.NODE_ENV === 'production'){
                  url = `https://shrouded-badlands-82687-a2146ab5fb9c.herokuapp.com/login/validation/${emailToken}`
               }
               else{
                  url = `http://localhost:3000/login/validation/${emailToken}`;
               }
               

               var mailOptions = {
                  from: "camille.gautier.pro@gmail.com",
                  to: user.email,
                  subject: "Confirmed your mail pokemonApi",
                  html: `Please click the link to confirmed your e-mail. This link is available for 10 minutes. <a href ="${url}">${url}<a/>`,
               };

               transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                     console.log(error);
                  } else {
                     console.log("Email sent: " + info.response);
                  }
               });

               await confirmationToken.create({
                  email: email,
                  token: emailToken,
               });
               const message =
                  "L'utilisateur à bien été créé. Vérifier votre e-mail avant de vous connecter.";
               res.json({ message });
            })
            .catch((error) => {
               const message =
                  "Une erreur s'est produite durant la création de l'utilisateur. Veuiller réessayer dans quelques instants.";
               res.status(500).json({ message, data: error });
            });
      });
   }

   async confirmEmail(req, res) {
      const token = req.params.token;
      confirmationToken
         .findOne({ where: { token: token } })
         .then(async (tokenRow) => {
            User.update({ active: 1 }, { where: { email: tokenRow.email } })
               .then(async (user) => {
                  confirmationToken
                     .destroy({ where: { token: token } })
                     .then((destroyedToken) => {
                        const message = `L'utilisateur ${user} est maintenant actif et le token delete`;
                        res.json({ message });
                     })
                     .catch((error) => {
                        const message =
                           "Une erreur est survenue lors de la suppression du token de validation email.";
                        res.status(500).json({ message, data: error });
                     });
               })
               .catch((error) => {
                  const message =
                     "Une erreur est survenue lors de la mise à jour de l'utitlisateur. (update activate : true)";
                  res.status(500).json({ message, data: error });
               });
         })
         .catch((error) => {
            const message =
               "Une erreur est survenue lors de la confirmation de l'e-mail.";
            res.status(500).json({ message, data: error });
         });
   }
}

module.exports = usersController;
