// const morgan = require("morgan");
const express = require("express");
const favicon = require("serve-favicon");
const app = express();
const path = require("path");

const postgres = require("./src/database/postgres");
const mongodb = require("./src/database/mongodb");
const routerPokemons = require("./src/routers/pokemons.router");
const routerUsers = require("./src/routers/users.router");
const mock = require("./src/database/mockPokemons.js");
const auth = require("./src/auth/auth");

//heroku dynamic port
const port = process.env.PORT || 3000;

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
   // .use(morgan("dev"))
   .use(favicon(__dirname + '/favicon.ico'))
   // .use(express.static(path.join(__dirname, "/src/public")));

//initialise databases
postgres.initDB();
mongodb.initDB(mock);

app.use("/pokemons", auth, routerPokemons);
app.use("/login", routerUsers);


//redirect empty end point on a html showing a little text
// app.get("/", (req, res) => {
//    res.sendFile(path.join(__dirname, "/src/views/index.html"));
// });

app.get('/', (req, res) => {
   res.json('Hello, Heroku ! 👋')
 })

//404 errors management
app.use((req, res) => {
   const message =
      "La page que vous recherché n'existe pas. Veuillez essayer une autre page";
   res.status(404).json({ message });
});

//port listening configuration
app.listen(process.env.PORT || 3000, () =>
   console.log(`Application node demarrée sur : http://localhost:${port}`)
);
