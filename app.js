const postgres = require("./database/postgres");
const mongodb = require("./database/mongodb");
const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");
const app = express();
const routerPokemons = require("./routers/pokemons.router");
const routerUsers = require("./routers/users.router");
const morgan = require("morgan");
const port = process.env.PORT || 3000;
const mock = require("./database/pokemonsMock");

//homemade logger with middleware (deprecated)
// app.use((req, res, next) => {
//    res.on('finish', function () {
//       console.log(
//          `URL ${req.url} Time: ${Date.now()} with code ${res.statusCode}`
//       );
//    });
//    next();
// });

//use est est utilisé pour tout type de requete,
//a noté que si l'on ne précise pas de route la est exécuté à chaque fois que l'application recoit une demande
//  app.use(express.json())
//morgan logger
app.use(express.json())
   .use(morgan("dev"))
   .use(favicon(path.join(__dirname, "favicon.ico")))
   .use(express.static(path.join(__dirname, "public")));

//initialisation des BDD
postgres.initDB();
mongodb.initDB(mock);

app.use("/pokemons", routerPokemons);
app.use("/login", routerUsers);


//redirect all request without any path to a front page
//we need top customize this logicaly
app.get("/", (req, res) => {
   res.sendFile(__dirname + "/views/index.html");
});

//404 errors management
app.use((req, res) => {
   const message =
      "La page que vous recherché n'existe pas. Veuillez essayer une autre page";
   res.status(404).json({ message });
});

//port listening configuration
app.listen(port, () =>
   console.log(`Application node demarrée sur : http://localhost:${port}`)
);
