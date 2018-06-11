
const keys = require('../config/keys')
const Sequelize = require('sequelize')

// Connect to Postgres
const db = new Sequelize(keys.postgresURI);

// Validate connection
db.authenticate()
  .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

module.exports = db