"use strict";

const mongoose = require("mongoose");
const mock = require("../database/pokemonsMock");

//Structure model of a pokemon object, DEPRECATED we have to use MYSQL to use model
//Here it's for simplicity but it does not make any sens
//See mongoose doc : https://mongoosejs.com/

const pokemonSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, "Please fill the name field with characters"],
   },
   hp: {
      type: Number,
      required: [true, "Please fill the hp field with a number"],
   },
   cp: {
      type: Number,
      required: [true, "Please fill the cp field with a number"],
   },
   picture: {
      type: String,
      required: [true, "Please fill the picture field with an url"],
   },
   types: {
      type: Array,
      required: [true, "Please fill the types field with types"],
   },
});

const Pokemon = mongoose.model("Pokemons", pokemonSchema);

const initDb = (mock) => {
   Pokemon.deleteMany({}).then(() => {
      console.log("Data deleted"); // Success
   });
   Pokemon.insertMany(mock).then(() => {
      console.log("Data created"); // Success
   });
};

initDb(mock);

module.exports = Pokemon;
