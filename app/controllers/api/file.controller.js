const multer = require('multer')
const message = require('@messages/index')
const dirHelper = require('@helpers/dir.helper')
const { PATH } = require('@configs')
const { createReadStream, statSync } = require('fs')

module.exports = {
	index(req, res, next) {
		try {
			const { dir = '' } = req.body

			res.json({
				status: message.SUCCESSFUL,
				message: null,
				data: dirHelper.getDirectories(`${PATH.FIRMWARE}`)
			})
		} catch (err) {
			next(err)
		}
	},

	upload(req, res) {
		multer({
			storage: multer.diskStorage({
				destination: function (req, file, cb) {
					// const { dir } = req.query

					cb(null, `${PATH.FIRMWARE}`)
				},
				filename: function (req, file, cb) {
					// const { fileName } = req.query
					console.log(file)
					cb(null, file.originalname)
				}
			})
		}).array('files')(req, res, (err) => {
			if (err) {
				res.status(500).json({
					message: err.toString()
				})
			} else {
				res.json({
					status: message.SUCCESSFUL,
					message: message.SUCCESSFUL_UPLOAD,
					data: null
				})
			}
		})
	},

	download(req, res, next) {
		try {
			const { file, mac } = req.query

			console.log(mac, 'download')

			// const path = `${PATH.STORAGE}/${file}`
			// const readStream = createReadStream(path)
			// const fileSize = statSync(path).size
			// let downloadedBytes = 0

			// res.setHeader('Content-disposition', `attachment; filename=${file}`)
			// res.setHeader('Content-type', 'application/octet-stream')

			// readStream.on('data', chunk => {
			//     downloadedBytes += chunk.length
			//     console.log((downloadedBytes * 100 / fileSize).toFixed(2))
			// })

			// readStream.pipe(res)

			res.download(`${PATH.FIRMWARE}/${file}`)
		} catch (err) {
			next(err)
		}
	},

	remove(req, res, next) {
		try {
			const { file } = req.body

			console.log(`${PATH.FIRMWARE}/${file}`)
			dirHelper.removeDirectory(`${PATH.FIRMWARE}/${file}`)

			res.json({
				status: message.SUCCESSFUL,
				message: message.SUCCESSFUL_DELETE,
				data: null
			})
		} catch (err) {
			next(err)
		}
	}
}