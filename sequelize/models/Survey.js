const Sequelize = require('sequelize')
const db = require('../db')
const sqUser = require('./User')
const sqRecipient = require('./Recipient')

const sqSurvey = db.define('surveys', {
	id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
	},
	title: Sequelize.STRING,
	body: Sequelize.STRING,
	subject: Sequelize.STRING,
	yes: { type: Sequelize.INTEGER, defaultValue: 0 },
	no: { type: Sequelize.INTEGER, defaultValue: 0 },
	dateSent: Sequelize.DATE,
	lastResponded: Sequelize.DATE,
})

// Setup Associations
sqSurvey.belongsTo(sqUser, {as: '_user'})
sqSurvey.belongsToMany(sqRecipient, {as: 'recipients', through: 'SurveyRecipients'})
sqRecipient.belongsToMany(sqSurvey, {as: 'surveys', through: 'SurveyRecipients'})	

module.exports = sqSurvey