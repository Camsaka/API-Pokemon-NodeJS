const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://camsaka:12345@cluster0.jskpb.mongodb.net/PokemonApiProject?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error'))

db.once('open', function() {
    console.log('Connected to the database! ✅')
})