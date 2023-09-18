const Pokemon = require("../models/pokemon.model");
const { success } = require("../helper.js");
const mock = require("../database/pokemonsMock");

class pokemonsController {
   async listAllPokemon(req, res) {
      await Pokemon.find().then((pokemons) => {
         const message = "Les pokemons ont bien été récupéré.";
         res.json({ message, count: pokemons.length, pokemons: pokemons });
      });
   }

   async add(req, res) {
      const pokemonParams = req.body;
      const pokemon = new Pokemon({
         name: pokemonParams.name,
         hp: pokemonParams.hp,
         cp: pokemonParams.cp,
         picture: pokemonParams.picture,
         types: pokemonParams.types,
         created: new Date(),
      });
      await pokemon.save().then((pokemon) => {
         const message = "Le pokemon a bien été ajouté.";
         res.json({ message, data: pokemon });
      });
   }

   async addMultiple(req, res) {
      const pokemonParams = req.body;
      await Pokemon.insertMany(pokemonParams).then((addings) => {
         const message = `${pokemonParams.length} pokemons ajoutés.`;
         res.json({ message, data: addings });
      });
   }

   async deleteById(req, res) {
      const id = req.params.id;
      await Pokemon.deleteOne({ id: id }).then((deletePokemon) => {
         const message = "Le pokemon a bien été supprimé.";
         res.json({ message, deletePokemon });
      });
   }

   async getById(req, res) {
      const id = req.params.id;
      await Pokemon.findById(id)
         .then((pokemon) => {
            if (pokemon == null) {
               res.status(404).send("le pokemon n'existe pas");
            } else {
               const message = "Le pokemon a été récupéré correctement"
               res.json({message, pokemon: pokemon});
            }
         })
         .catch((error) => {
            const message = "L'identifiant ne correspond pas au format demandé";
            res.status(404).json({ message, data: error });
         });
   }

   async modify(req, res) {
      const filter = { id: req.params.id };
      const update = req.body;
      await Pokemon.findOneAndUpdate(filter, update, {
         new: true,
      }).then((modifiedPokemon) => {
         const message = ` Le pokemon d'id ${req.params.id} à bien été mis à jour`;
         res.json({ message, modifiedPokemon });
      });
   }
}

module.exports = pokemonsController;
