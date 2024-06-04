const message = require('@messages/index')
const MasterMachine = require('@models/MasterMachine')

module.exports = {
    async index(req, res, next) {
        try {
            res.json({
                status: message.SUCCESSFUL,
                data: await MasterMachine.findAll({ where: { IsDelete: false } })
            })
        } catch (err) {
            next(err)
        }
    }
}