const Pokemon = require('../models/pokemon.model')


class pokemonsController{

    async HelloWorld(req, res){
        res.status(200).send("Hello World pokemon")
    }

    async listAllPokemon(req, res){
        const pokemons = await Pokemon.find()
        res.json({
            count: pokemons.length,
            pokemons: pokemons
        })
    }

    async add(req, res) {
        const pokemonParams = req.body;
        console.log(pokemonParams)
        const pokemon = new Pokemon({
            name: pokemonParams[1].name
        })
        await pokemon.save();
        res.json(pokemon);
    }

    async deleteById(req, res){
        const nameP = req.params.namePokemon;
        const pokemon = await Pokemon.deleteOne({name: nameP});

        res.json(pokemon);
        res.send("pokemon supprimer")
    }

}

module.exports = pokemonsController;