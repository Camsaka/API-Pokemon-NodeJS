const Pokemon = require("../models/pokemon.model");
const { success } = require("../helper.js");
const mock = require("../database/pokemonsMock");

class pokemonsController {
   //request return all pokemon in database
   async listAllPokemon(req, res) {
      //if query param 'name', find pokemons like 'name' param
      if (req.query.name) {
         const name = req.query.name;
         if (name.length > 1) {
            await Pokemon.find()
               .where({ name: { $regex: ".*" + name + ".*" } })
               .limit(4)
               //we can also find pokemon exactly equal name with { 'name': name } but its more flexible like above for user
               .then((pokemons) => {
                  if (pokemons != "") {
                     const message = "Le pokemons a bien été récupéré.";
                     res.json({
                        message,
                        count: pokemons.length,
                        pokemons: pokemons,
                     });
                  } else {
                     const message = `Le pokemon ${name} n'existe pas. Vérifié l'ortographe et réessayer`;
                     res.status(400).json({ message });
                  }
               });
         } else {
            const message = "Le terme de recherche doit contenir au moins 2 caractères."
            res.status(400).json({message});
         }
      } else {
         await Pokemon.find()
            .then((pokemons) => {
               const message = "Les pokemons ont bien été récupéré.";
               res.json({
                  message,
                  count: pokemons.length,
                  pokemons: pokemons,
               });
            })
            .catch((error) => {
               const message =
                  "La liste des pokémons n'a pas pu être récupérée. Veuillez réessayer dans quelques instants.";
               res.status(500).json({ message, data: error });
            });
      }
   }

   //request return all pokemon in database and sort by name
   async listAllPokemonSortAlpha(req, res) {
      await Pokemon.find()
         .sort({ name: 1 })
         .then((pokemons) => {
            const message = "Les pokemons ont bien été récupéré.";
            res.json({ message, count: pokemons.length, pokemons: pokemons });
         })
         .catch((error) => {
            const message =
               "La liste des pokémons n'a pas pu être récupérée. Veuillez réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
         });
   }

   //function post for save a new pokemon in database
   //take a pokemon in body
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
      await pokemon
         .save()
         .then((pokemon) => {
            const message = "Le pokemon a bien été ajouté.";
            res.json({ message, data: pokemon });
         })
         .catch((error) => {
            if (error.name == "ValidationError") {
               res.status(400).json({ message: error.message, data: error });
            } else {
               const message =
                  "Le pokemon n'a pas pu être ajouté (vérifier le corps de la requête et réessayer)";
               res.status(500).json({ message, data: error });
            }
         });
   }

   //function post which is add multiple pokemons in database
   //take a table of pokemons in body
   async addMultiple(req, res) {
      const pokemonParams = req.body;
      await Pokemon.insertMany(pokemonParams)
         .then((addings) => {
            const message = `${pokemonParams.length} pokemons ajoutés.`;
            res.json({ message, data: addings });
         })
         .catch((error) => {
            if (error.name == "ValidationError") {
               res.status(400).json({ message: error.message, data: error });
            } else {
               const message =
                  "L'ajout des pokemons n'a pas pu être effectués. Vérifier le corps de la requête et réessayer.";
               res.status(500).json({ message, data: error });
            }
         });
   }

   //function to delete a pokemon
   //take an _id in param
   async deleteById(req, res) {
      const id = req.params.id;
      await Pokemon.findById(id)
         .then(async (pokemon) => {
            if (pokemon === null) {
               const message = "Le pokemon n'existe pas";
               res.status(404).send({ message });
            } else {
               await Pokemon.deleteOne({ _id: id }).then((deletePokemon) => {
                  const message = "Le pokemon a bien été supprimé.";
                  res.json({ message, deletePokemon });
               });
            }
         })
         .catch((error) => {
            const message =
               "Le pokemon n'a pas pu être supprimé (vérifier l'identifiant et réessayer)";
            res.status(500).json({ message, data: error });
         });
   }

   //function to find a pokemon by _id in param
   async getById(req, res) {
      const id = req.params.id;
      await Pokemon.findById(id)
         .then((pokemon) => {
            if (pokemon === null) {
               const message = "Le pokemon n'existe pas";
               res.status(404).send({ message });
            } else {
               const message = "Le pokemon a été récupéré correctement";
               res.json({ message, pokemon: pokemon });
            }
         })
         .catch((error) => {
            const message =
               "Le pokemon n'a pas pu être récupéré (vérifier l'identifiant et réessayer)";
            res.status(500).json({ message, data: error });
         });
   }

   //function to modify a pokemon
   //take _id in params and modification in body
   async modifyById(req, res) {
      const id = req.params.id;
      const filter = { _id: id };
      const update = req.body;
      await Pokemon.findById(id)
         .then(async (pokemon) => {
            if (pokemon === null) {
               const message = "Le pokemon n'existe pas";
               res.status(404).send({ message });
            } else {
               await Pokemon.findOneAndUpdate(filter, update, {
                  new: true,
               }).then((modifiedPokemon) => {
                  const message = ` Le pokemon d'id ${req.params.id} à bien été mis à jour`;
                  res.json({ message, modifiedPokemon });
                  console.log(modifiedPokemon);
               });
            }
         })
         .catch((error) => {
            if (error.name == "ValidationError") {
               res.status(400).json({ message: error.message, data: error });
            } else {
               const message =
                  "Le pokemon n'a pas pu être modifié (vérifier l'identifiant et réessayer)";
               res.status(500).json({ message, data: error });
            }
         });
   }

   //function to get all pokemons with pagination options
   //this function can take page=<number> and limit=<number> in query param
   //by default it will return page 1 with 4 pokemons
   async getAllPaginate(req, res) {
      const page =
         req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
      const numberPerPage =
         req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 4;
      await Pokemon.aggregate([
         {
            $facet: {
               totalData: [
                  { $match: {} },
                  { $skip: numberPerPage * (page - 1) },
                  { $limit: numberPerPage },
               ],
               totalCount: [{ $count: "count" }],
            },
         },
      ])
         .then((totalData) => {
            if (totalData[0].totalData[0] !== undefined) {
               const message = `Les pokémons ont bien été récupérés. page : ${page} total : ${totalData[0].totalCount[0].count}`;
               res.json({ message, totalData });
            } else {
               const message = `Page : ${page} vide.`;
               res.status(400).json({ message });
            }
         })
         .catch((error) => {
            const message =
               "Une erreur est survenue réessayer dans quelques instants";
            res.status(500).json({ message, data: error });
         });
   }
}

module.exports = pokemonsController;
