require('./database/mongodb')
const express = require('express')
const app = express()

const routerPokemons = require('./routers/pokemons.router')

//use est est utilisé pour tout type de requete,
//a noté que si l'on ne précise pas de route la est exécuté à chaque fois que l'application recoit une demande
app.use('/',routerPokemons)


const port = 3000
app.listen(port, () => console.log(`Application node demarrée sur : http://localhost:${port}`))
