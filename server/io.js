const { Server } = require('socket.io')
const { SOCKET_TIMEOUT, SOCKET_INTERVAL } = process.env

const io = new Server({
	pingTimeout: Number(SOCKET_TIMEOUT),
	pingInterval: Number(SOCKET_INTERVAL)
})

module.exports = io