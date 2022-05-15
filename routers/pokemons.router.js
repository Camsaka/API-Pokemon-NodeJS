const express = require('express')
const router = express.Router()
const pokemonsControl = require('../controllers/pokemons.controller')
const pokemonsController = new pokemonsControl()

router.get('/pokemons', (req, res) => {
    pokemonsController.HelloWorld(req,res);
})
router.get('/pokemons/listAll',(req,res) => {
    pokemonsController.listAllPokemon()
})


//Tres important pour le require dans le app.js !!!
module.exports = router;