const User = require('@models/User')

const getUserByUsername = async (username) => User.findOne({ where: { username, IsDelete: false } })

module.exports = {
    getUserByUsername
}