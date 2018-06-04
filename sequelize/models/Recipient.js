const Sequelize = require('sequelize')
const db = require('../db')

const sqRecipient = db.define('recipient', {
	email: {
			type: Sequelize.STRING,
			primaryKey: true,
	},
	responded: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
	}
	}).sync()

  module.exports = sqRecipient