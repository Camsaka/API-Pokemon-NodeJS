'use strict';

const mongoose = require('mongoose')
const mock = require("../database/pokemonsMock")

const pokemonSchema = new mongoose.Schema({
  name: String,
  hp: Number,
  cp: Number,
  picture: String,
  types: Array,
  created: Date
})

const Pokemon = mongoose.model("Pokemons", pokemonSchema)

const initDb = (mock) => {
  Pokemon.insertMany(mock);
}

initDb(mock);

module.exports = Pokemon;