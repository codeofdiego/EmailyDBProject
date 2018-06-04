const Sequelize = require('sequelize')
const db = require('../db')

const sqRecipient = db.define('recipients', {
	email: {
			type: Sequelize.STRING,
			primaryKey: true,
	},
	responded: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
	}
	})

  module.exports = sqRecipient