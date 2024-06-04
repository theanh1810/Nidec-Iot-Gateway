const bcrypt = require('bcrypt')
const { SALT_ROUNDS } = process.env

const hashPassword = (password) => bcrypt.hashSync(password, Number(SALT_ROUNDS))

const comparePassword = (password, hash) => bcrypt.compareSync(password, hash)

module.exports = {
    hashPassword,
    comparePassword
}