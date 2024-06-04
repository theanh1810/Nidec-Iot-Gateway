const iotBusiness = require('@business/iot.business')

const auth = async (socket, next) => {
	const { handshake } = socket
	const { headers } = handshake
	const { authorization, mac } = headers

	if (authorization) {
		socket.join('browser')
		next()
		return
	}

	if (mac && await iotBusiness.isRegistered(mac)) {
		
		console.log(`time: ${new Date()} , receiver request: ${handshake}`);
		next()
		console.log(`time: ${new Date()} , end request: ${handshake}`);
		return
	}

	console.log('unregistered')
	console.table({ authorization, mac })

	socket.disconnect()
}

module.exports = {
	auth
}