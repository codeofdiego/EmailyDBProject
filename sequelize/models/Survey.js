const Sequelize = require('sequelize')
const db = require('../db')

const sqSurvey = db.define('survey', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    title: Sequelize.STRING,
    body: Sequelize.STRING,
    subject: Sequelize.STRING,
    recipients: [RecipientSchema], // HAS MANY
    yes: { type: Sequelize.INTEGER, defaultValue: 0 },
    no: { type: Sequelize.INTEGER, defaultValue: 0 },
    _user: { type: Schema.Types.ObjectId, ref: 'User'}, // BELONGS TO
    dateSent: Sequelize.DATE,
    lastResponded: Sequelize.DATE,
  }).sync()

  module.exports = sqSurvey