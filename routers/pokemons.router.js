const express = require("express");
const router = express.Router();
const pokemonsControl = require("../controllers/pokemons.controller");
const pokemonsController = new pokemonsControl();

// router
//    .use((res, req, next) => {
//       res.sendFile(__dirname + "/views/index.html");
//       next();
//    })
//    .use((err, req, res, next) => {
//       res.status(404).send("fichier non trouvé");
//       res.status(200).send("Requete terminée avec succès");
//       next();
//    });

router.get("/", (req, res) => {
   pokemonsController.HelloWorld(req, res);
});

router.get("/listAll", (req, res) => {
   pokemonsController.listAllPokemon(req, res);
});

router.post("/add", async (req, res) => {
   pokemonsController.add(req, res);
});
router.post("/addMultiple", async (req, res) => {
   pokemonsController.addMultiple(req, res);
});

router
   .route("/:id")
   .get(async (req, res) => {
      pokemonsController.getById(req, res);
   })
   .delete(async (req, res) => {
      pokemonsController.deleteById(req, res);
   })
   .put(async (req, res) => {
      pokemonsController.modify(req, res);
   });

router.use(({ res }) => {
   const message =
   "La page que vous recherché n'existe pas. Veuillez essayer une autre page";
   res.status(404).json({ message });
});
//Tres important pour le require dans le app.js !!!
module.exports = router;
