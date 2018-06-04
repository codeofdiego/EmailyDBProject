const Sequelize = require('sequelize')
const db = require('../db')

const sqUser = db.define('users', {
  googleId: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  credits: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  }
})

module.exports = sqUser