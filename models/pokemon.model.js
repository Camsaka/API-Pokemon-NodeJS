'use strict';

const mongoose = require('mongoose')
const pokemonSchema = new mongoose.Schema({
    name: String
})

const Pokemon = mongoose.model('pokemons', pokemonSchema)

module.exports = Pokemon;