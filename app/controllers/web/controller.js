const { PATH } = require('@configs')

module.exports = {
    index(req, res) {
        res.sendFile(`${PATH.FRONTEND}/index.html`)
    }
}