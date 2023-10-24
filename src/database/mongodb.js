const mongoose = require("mongoose");
const PokemonSchema = require("../models/pokemon.model");


mongoose.connect(
   "mongodb+srv://camsaka:12345@cluster0.jskpb.mongodb.net/PokemonApiProject?retryWrites=true&w=majority",
   { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error"));

db.once("open", function () {
   console.log("Connected to the database! ✅");
});

const Pokemon = mongoose.model("Pokemon", PokemonSchema)

const initDB = (mock) => {
   Pokemon.deleteMany({}).then(() => {
      console.log("Data deleted"); // Success
   });
   Pokemon.insertMany(mock).then((data) => {
      console.log("Data created");
       console.log(data)// Success
   });
};

module.exports = { initDB, Pokemon };

