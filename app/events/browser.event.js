const io = require('@socketIo')

module.exports = {
    updateIot: (iot) => {
        io.to('browser').emit('update-iot', iot)
    }
}