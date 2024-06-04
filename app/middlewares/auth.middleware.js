const userRepository = require('@repositories/user.repository')
const { comparePassword } = require('@helpers/bcrypt.helper')
const jwt = require('jsonwebtoken')
const message = require('@messages/auth.message')
const { TOKEN_SECRET } = process.env

const login = async (req, res, next) => {
	try {
		const { username, password } = req.body

		if (!username) throw new Error(message.USERNAME_EMPTY)
		if (!password) throw new Error(message.PASSWORD_EMPTY)

		const user = await userRepository.getUserByUsername(username)

		if (user === null) throw new Error(message.INVALID_USERNAME)
		if (!comparePassword(password, user.password.replace(/^\$2y(.+)$/i, '$2a$1'))) throw new Error(message.INVALID_PASSWORD)

		req.user = user

		next()
	} catch (err) {
		res.status(500)
			.json({ message: err.message })
	}
}

const auth = (req, res, next) => {
	const { authorization } = req.headers

	if (!authorization) return res.status(401).json()

	jwt.verify(authorization, TOKEN_SECRET, (err, user) => {
		if (err) {
			res.status(401).json()
		} else {
			req.user = user
			console.log(user)
			next()
		}
	})
}

module.exports = {
	login,
	auth
}