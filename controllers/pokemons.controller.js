const Pokemon = require('../models/pokemon.model')
class pokemonsController{

    async HelloWorld(req, res){
        res.status(200).send("Hello World pokemon")
    }

    async addPokemon({

    }
    async listAllPokemon(req, res){
        const pokemonList = await Pokemon.find()
        res.json({
            pokemons: pokemonList
        })
    }

}

module.exports = pokemonsController;