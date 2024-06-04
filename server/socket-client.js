
const ioClient = require('socket.io-client');
const controller = require('@controllers/oee/controller')

const socketPHPUrl  = process.env.SOCKET_PHP_URL;
const socketClient = ioClient.connect(socketPHPUrl, {reconnect: true});

socketClient.on('disconnect', (socClient) => {
    console.log(`Disconnect socketio to ${socketPHPUrl}`)
});
socketClient.on('call-status-machine', () => controller.callInitStatus(socketClient))
socketClient.on('auto-start-plan', () => controller.autoStartPlan(socketClient))
socketClient.on('refresh-plan-from-server', (payload) =>  controller.refreshPlan(payload))
socketClient.on('clear-all-plan', (payload) =>  controller.clearPlan(payload))

module.exports = socketClient
