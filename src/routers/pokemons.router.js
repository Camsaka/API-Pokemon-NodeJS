//All routes are defined in this file
//Use the same model to add or modify routes
//See express doc : https://expressjs.com/fr/guide/routing.html

const express = require("express");
const router = express.Router();
const pokemonsControl = require("../controllers/pokemons.controller");
const pokemonsController = new pokemonsControl();

// router.get("/", (req, res) => {
//    pokemonsController.HelloWorld(req, res);
// });

router.get("/listAll", (req, res) => {
   pokemonsController.listAllPokemon(req, res);
});

router.get("/listAllSortAlpha", (req, res) => {
   pokemonsController.listAllPokemonSortAlpha(req, res);
});

router.post("/add", async (req, res) => {
   pokemonsController.add(req, res);
});
router.post("/addMultiple", async (req, res) => {
   pokemonsController.addMultiple(req, res);
});

router.get("/listAllPaginate", async (req, res) => {
   pokemonsController.getAllPaginate(req, res);
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
      pokemonsController.modifyById(req, res);
   });



router.use(({ res }) => {
   const message =
      "La page que vous recherché n'existe pas. Veuillez essayer une autre page";
   res.status(404).json({ message });
});

//Tres important pour le require dans le app.js !!!
module.exports = router;
