const { Sequelize, DataTypes } = require('sequelize')
const moment = require('moment')

const { DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env

DataTypes.DATE.prototype._stringify = function _stringify(date, options) {
	date = this._applyTimezone(date, options);

	return date.format('YYYY-MM-DD HH:mm:ss.SSS');
}

function getDateTimeFormat(field) {
	return moment(this.getDataValue(field)).utcOffset(0).format('YYYY-MM-DD HH:mm:ss').toString()
}

function getTimeFormat(field) {
	return moment(this.getDataValue(field)).utcOffset(0).format('HH:mm:ss').toString()
}

function getDateFormat(field) {
	return moment(this.getDataValue(field)).format('YYYY-MM-DD').toString()
}

const Db = new Sequelize(
	DB_DATABASE,
	DB_USERNAME,
	DB_PASSWORD,
	{
		host: DB_HOST,
		port: DB_PORT,
		dialect: DB_CONNECTION,
		dialectOptions: {
			options: {
				requestTimeout: 300000,
				encrypt: false,
				trustServerCertificate: true,
			},
		},
		logging: false,
		// logging: console.log,
		timezone: '+07:00',
		pool: {
			max: 200,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
	}
)

module.exports = {
	Db,
	getDateTimeFormat,
	getDateFormat,
	getTimeFormat
}