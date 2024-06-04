const route = require('express').Router()
const controller = require('@controllers/api/machine.controller')

route.get('/', controller.index)

module.exports = route