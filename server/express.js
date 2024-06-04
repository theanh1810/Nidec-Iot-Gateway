const app = require('express')()
const server = require('http').createServer(app)

const { PORT } = process.env

const start = () => {
	server.listen((PORT), () => {
		console.log(`express server start on ${PORT}`)
	})
}

module.exports = { app, server, start }