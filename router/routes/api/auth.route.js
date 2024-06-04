const route = require('express').Router()
const controller = require('@controllers/api/auth.controller')
const authMiddleware = require('@middlewares/auth.middleware')

route.post('/login', [authMiddleware.login], controller.login)
route.post('/logout', [authMiddleware.auth], controller.logout)
route.post('/verify', [authMiddleware.auth], controller.verify)

module.exports = route