const { app } = require('../../server/express')
const { urlencoded, json } = require('express')

app.use(urlencoded({
    extended: true
}))

app.use(json())