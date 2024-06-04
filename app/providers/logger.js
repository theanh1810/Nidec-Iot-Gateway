const moment = require('moment')
const winston = require('winston')
require('winston-daily-rotate-file')
const { ENV, DATE_ONLY_FORMAT, DATE_TIME_FORMAT } = require('@configs')
const { NODE_ENV } = process.env

const timestamp = () => moment().format(DATE_TIME_FORMAT).toString()

const createLogger = (name, path, maxFiles = '30d', maxSize = '10m') => {
	const transports = [
		new winston.transports.DailyRotateFile({
			filename: `${process.cwd()}${path}/${name}-%DATE%.log`,
			datePattern: DATE_ONLY_FORMAT,
			maxFiles,
			maxSize,
			format: winston.format.combine(
				winston.format.timestamp({ format: timestamp }),
				winston.format.json()
			)
		})
	]
	const loggerOptions = { transports }

	if (NODE_ENV === ENV.DEVELOP) transports.push(new winston.transports.Console({
		format: winston.format.combine(
			winston.format.label({ label: name }),
			winston.format.timestamp({ format: timestamp }),
			winston.format.prettyPrint()
		),
	}),)

	return winston.createLogger(loggerOptions)
}

const iotStatusLogger = createLogger('iotStatus', '/logs/iot/status', null)

module.exports = {
	iotStatusLogger
}