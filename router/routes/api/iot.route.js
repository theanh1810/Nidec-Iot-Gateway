const route = require('express').Router()
const controller = require('@controllers/api/iot.controller')
const middleware = require('@middlewares/iot.middleware')
const { auth } = require('@middlewares/auth.middleware')

route.get('/', [auth], controller.index)
route.get('/:mac', [auth, middleware.show], controller.show)
route.post('/create', [auth, middleware.create], controller.create)
route.post('/update', [auth, middleware.update], controller.update)
route.post('/destroy', [auth, middleware.destroy], controller.destroy)
route.post('/update-firmware', [auth, middleware.updateFirmware], controller.updateFirmware)
route.post('/send-event', [auth, middleware.sendEvent], controller.sendIot)

module.exports = route