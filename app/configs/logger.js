const { app } = require('../../server/express')
const rfs = require('rotating-file-stream')
const morgan = require('morgan')

const logStream = rfs.createStream('access.log', {
    interval: '1d',
    maxFiles: 7,
    path: `${process.cwd()}/logs`
})

app.use(morgan(function(tokens, req, res) {
    return JSON.stringify({
        ip: req.ip,
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        res: tokens.res(req, res, 'content-length'),
        response: tokens['response-time'](req, res),
    })
}, {
    stream: logStream
}))