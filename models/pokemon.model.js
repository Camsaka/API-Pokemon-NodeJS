'use strict';

const mongoose = require('mongoose');
const pokemonSchema = new mongoose.Schema({
    name: String
})

const Pokemon = mongoose.model('Pokemons', pokemonSchema);

module.exports = Pokemon;