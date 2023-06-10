require('./database/mongodb')
const express = require('express')
const app = express()
const routerPokemons = require('./routers/pokemons.router')
const path = require('path')

//use est est utilisé pour tout type de requete,
//a noté que si l'on ne précise pas de route la est exécuté à chaque fois que l'application recoit une demande
app.use(express.json())
app.use('/',routerPokemons)

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Application node demarrée sur : http://localhost:${port}`))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static(path.join(__dirname,"public")));