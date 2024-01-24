# API-Pokemon-NodeJS

See express doc : https://expressjs.com/fr/guide/routing.html
See mongoose doc : https://mongoosejs.com/
See sequelize doc : https://sequelize.org/docs/v6/getting-started/


# To run
clone this project => npm install => npm run start

# Heroku deployment
 heroku create (-a name). Create app on heroku (check on your dashboard)
 git push heroku main
 heroku ps:scale web=1 (i dont use dynos)


 WARNING add to env variable on heroku dashboard PGSSLMODE=no-verify

