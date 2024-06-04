const dirHelper = require('@helpers/dir.helper')
const { PATH } = require('@configs')
const message = require('@messages/iot.message')
const { isArray } = require('@helpers/checkType')
const { isRegistered, isDuplicateName } = require('@business/iot.business')

module.exports = {
	show(req, res, next) {

	},

	async create(req, res, next) {
		try {
			const { mac, name } = req.body

			if (!mac) throw new Error(message.MAC_EMPTY)
			if (await isRegistered(mac)) throw new Error(message.DUPLICATE_MAC)
			if (!name) throw new Error(message.NAME_EMPTY)
			if (await isDuplicateName({ name })) throw new Error(message.DUPLICATE_NAME)

			next()
		} catch (err) {
			res.status(400)
				.json({ message: err.message })
		}
	},

	async update(req, res, next) {
		try {
			const { oldMac, newMac, name } = req.body

			if (!newMac) throw new Error(message.MAC_EMPTY)
			if (oldMac !== newMac && await isRegistered(newMac)) throw new Error(message.DUPLICATE_MAC)
			if (!name) throw new Error(message.NAME_EMPTY)
			if (await isDuplicateName({ mac: oldMac, name })) throw new Error(message.DUPLICATE_NAME)

			next()
		} catch (err) {
			res.status(400)
				.json({ message: err.message })
		}
	},

	destroy(req, res, next) {
		try {
			const { mac } = req.body

			if (!mac) throw new Error(message.MAC_EMPTY)

			next()
		} catch (err) {
			res.status(400)
				.json({ message: err.message })
		}
	},

	updateFirmware(req, res, next) {
		try {
			const { macs, path, selectedFile } = req.body

			if (!macs) throw new Error(message.MACS_EMPTY)
			if (!isArray(macs)) throw new Error(message.MACS_NOT_ARRAY)
			if (!path) throw new Error(message.PATH_EMPTY)
			if (!selectedFile) throw new Error(message.SELECTED_FILE_EMPTY)
			if (!dirHelper.checkExists(`${PATH.FIRMWARE}/${selectedFile}`)) throw new Error(message.FILE_NOT_EXISTS)

			next()
		} catch (err) {
			res.status(400)
				.json({ message: err.message })
		}
	},

	sendEvent(req, res, next) {
		try {
			const { socketId, event } = req.body

			if (!socketId) throw new Error(message.SOCKETID_EMPTY)
			if (!event) throw new Error(message.EVENT_EMPTY)

			next()
		} catch (err) {
			res.status(400)
				.json({ message: err.message })
		}
	}
}