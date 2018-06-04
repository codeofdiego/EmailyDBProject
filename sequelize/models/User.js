const Sequelize = require('sequelize')
const db = require('../db')

const sqUser = db.define('user', {
  googleId: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  credits: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  }
}).sync()

module.exports = sqUser