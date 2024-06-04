const route = require('express').Router()
const controller = require('@controllers/api/file.controller')
const { auth } = require('@middlewares/auth.middleware')

route.post('', [auth], controller.index)
route.post('/upload', [auth], controller.upload)
route.get('/download', controller.download)
route.post('/remove', controller.remove)

module.exports = route