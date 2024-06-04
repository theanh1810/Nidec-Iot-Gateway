const cors = require('cors')
const io = require('@socketIo')
const { app, server } = require('../../server/express')

const { CORS_ORIGIN } = process.env

app.use(cors({
	origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(','),
	methods: ["GET", "POST"],
	exposedHeaders: [
		'File-Name'
	]
}))

io.attach(server, {
	cors: {
		origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(','),
		methods: ["GET", "POST"],
	}
})