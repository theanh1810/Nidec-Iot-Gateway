const io = require('@socketIo')
const MasterIot = require('@models/MasterIot')
const message = require('@messages/index')
const { isArray } = require('@helpers/checkType')
const { Op } = require('sequelize')

module.exports = {
	async index(req, res, next) {
		try {
			const iots = await MasterIot.findAll({
				include: [{
					association: 'machine'
				}]
			})

			res.json(iots)
		} catch (err) {
			next(err)
		}
	},

	async show(req, res, next) {

	},

	async create(req, res, next) {
		try {
			const { mac, name, machineId } = req.body
			const user = req.user

			const iot = await MasterIot.create({
				Mac: mac,
				Name: name,
				MachineID: machineId,
				User_Created: user.id
			})

			res.json({
				status: message.SUCCESSFUL,
				message: message.SUCCESSFUL_CREATE,
				data: iot
			})
		} catch (err) {
			next(err)
		}
	},

	async update(req, res, next) {
		try {
			const { oldMac, newMac, name, machineId } = req.body
			const user = req.user

			const iot = await MasterIot.update({
				Mac: newMac,
				Name: name,
				MachineID: machineId,
				User_Updated: user.id
			}, {
				where: {
					Mac: oldMac
				}
			})

			res.json({
				status: message.SUCCESSFUL,
				message: message.SUCCESSFUL_UPDATE,
				data: iot
			})
		} catch (err) {
			next(err)
		}
	},

	async destroy(req, res, next) {
		try {
			const { mac } = req.body

			await MasterIot.destroy({
				where: {
					Mac: isArray(mac) ? { [Op.in]: mac } : mac
				}
			})

			res.json({
				status: message.SUCCESSFUL,
				message: message.SUCCESSFUL_DELETE,
				data: null
			})
		} catch (err) {
			next(err)
		}
	},

	async updateFirmware(req, res, next) {
		try {
			const { macs, path, selectedFile } = req.body
			// console.log({ macs, path, selectedFile })
			for (const mac of macs) {
				const iotClient = await MasterIot.findOne({
					where: {
						Mac: mac
					}
				})

				if (iotClient && iotClient.SocketID) {
					io.to(iotClient.SocketID).emit('update-firmware', {
						url: `${path}/api/file/download?mac=${mac}&file=${selectedFile}`
					})
				}
			}

			res.json({
				message: message.SUCCESSFUL
			})
		} catch (err) {
			next(err)
		}
	},

	sendIot(req, res, next) {
		try {
			const { socketId, event, payload } = req.body

			io.to(socketId).emit(event, payload)

			res.json({
				message: message.SUCCESSFUL
			})
		} catch (err) {
			next(err)
		}
	}
}