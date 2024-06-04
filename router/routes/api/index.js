const route = require('express').Router()
const auth = require('./auth.route')
const iot = require('./iot.route')
const file = require('./file.route')
const machine = require('./machine.route')

route.use('/auth', auth)
route.use('/iot', iot)
route.use('/file', file)
route.use('/machine', machine)

module.exports = route