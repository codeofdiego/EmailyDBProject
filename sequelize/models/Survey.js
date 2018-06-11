const Sequelize = require('sequelize')
const db = require('../db')
const sqUser = require('./User')
const sqRecipient = require('./Recipient')

const sqSurvey = db.define('surveys', {
	id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
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
sqSurvey.belongsTo(sqUser, {foreignKey: 'userId'})
sqSurvey.belongsToMany(sqRecipient, {through: 'surveys_recipients'})
sqRecipient.belongsToMany(sqSurvey, {through: 'surveys_recipients'})

module.exports = sqSurvey