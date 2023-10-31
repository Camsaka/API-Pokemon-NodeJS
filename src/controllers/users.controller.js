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
                  res.json({ message, data: user, token: token });
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
               const emailToken = await jwt.sign(
                  {
                     user: user.id,
                  },
                  toString(process.env.ACCESS_TOKEN_SECRET),
                  {
                     expiresIn: "10000000000000",
                  }
               );

               let url;
               if (process.env.NODE_ENV === "production") {
                  url = `https://shrouded-badlands-82687-a2146ab5fb9c.herokuapp.com/login/validation/${emailToken}`;
               } else {
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
      try {
         const tokenRow = await confirmationToken.findOne({
            where: { token: token },
         });
         // if (!tokenRow) {
         //    const message = "Votre utilisateur est deja activé.";
         //    res.json({ message });
         // } else {
         try {
            const verif = jwt.verify(
               token,
               toString(process.env.ACCESS_TOKEN_SECRET),
               (err, row) => {
                  if (err) {
                     if (err.name == "TokenExpiredError") {
                        return { valid: false, data: err };
                     }
                     return { valid: false, data: err };
                  }
                  return { valid: true, data: row };
               }
            );
            if (!verif.valid) {
               const message =
                  "Votre lien à expirer veuillez entrer votre addresse pour en avoir un nouveau";
               return res.json({ message, data: verif.data });
            }
            const updatedUser = await User.update(
               { active: 1 },
               { where: { email: tokenRow.email } }
            );
         } catch (error) {
            const message =
               "Une erreur est survenue lors de la mise à jour du user (update activate : true).";
            res.status(500).json({ message, data: error });
         }
         try {
            const destroyedToken = await confirmationToken.destroy({
               where: { token: token },
            });
            const message = "Vous avez bien confirmer votre e-mail";
            res.json({ message });
         } catch (error) {
            const message =
               "Une erreur est survenue lors de la destruction du token.";
            res.status(500).json({ message, data: error });
         }
         // }
      } catch (error) {
         const message =
            "Une erreur est survenue lors de la confirmation de l'e-mail.";
         res.status(500).json({ message, data: error });
      }
   }

   async resendConfirmationMail(req, res) {
      const email = req.body.email;
      try {
         const user = await User.findOne({ where: { email: email } });
         if (!user) {
            const message = "Aucun compte associé"
            console.log(user);
            return res.status(404).json({message})
         } else {
            console.log(user);
            const emailToken = await jwt.sign(
               {
                  user: user.id,
               },
               toString(process.env.ACCESS_TOKEN_SECRET),
               {
                  expiresIn: "10000000000000",
               }
            );

            let url;
            if (process.env.NODE_ENV === "production") {
               url = `https://shrouded-badlands-82687-a2146ab5fb9c.herokuapp.com/login/validation/${emailToken}`;
            } else {
               url = `http://localhost:3000/login/validation/${emailToken}`;
            }

            var mailOptions = {
               from: "camille.gautier.pro@gmail.com",
               to: email,
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
               "L'email vient de vous etre renvoyé";
            res.json({ message });
         }
      } catch(err){
         res.status(500).json({data: err})

      }
   }
}

module.exports = usersController;
