const express = require('express')
const router = express.Router()
const pokemonsControl = require('../controllers/pokemons.controller')
const pokemonsController = new pokemonsControl()

router.get('/pokemons/', (req, res) => {
    pokemonsController.HelloWorld(req,res);
})

router.get('/pokemons/listAll',(req,res) => {
    pokemonsController.listAllPokemon(req, res)
})

router.post('/pokemons/add', async (req, res) => {
    pokemonsController.add(req, res);
});

// router.delete('/pokemons/:namePokemon', async (req, res) =>{
//     pokemonsController.deleteById(res, req);
// })

router.get('/pokemons/get/:id', async (req, res) => {
    pokemonsController.getById(req, res);
})




//Tres important pour le require dans le app.js !!!
module.exports = router;