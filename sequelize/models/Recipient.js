const Sequelize = require('sequelize')
const db = require('../db')

const sqRecipient = db.define('recipients', {
	email: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	name: Sequelize.STRING,
})

module.exports = sqRecipient