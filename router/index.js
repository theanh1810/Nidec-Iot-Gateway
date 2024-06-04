const express = require('express')
const { app } = require('../server/express')
const middleware = require('@middlewares/handleError.middleware')
const controller = require('@controllers/web/controller')
const api = require('./routes/api')
const { PATH } = require('@configs')

app.use(express.static(PATH.FRONTEND))
app.use(express.static(PATH.IMAGE))

app.use('/api', api)

app.get('*', controller.index)

app.use(middleware.serverError)