const jwt = require('jsonwebtoken')
const message = require('@messages/auth.message')
const { TOKEN_SECRET } = process.env

module.exports = {
	login(req, res, next) {
		try {
			const user = req.user

			const token = jwt.sign(
				{
					id: user.id,
					username: user.username
				},
				TOKEN_SECRET,
				{
					expiresIn: '6h'
				}
			)

			res.json({
				message: message.SUCCESSFUL_LOGIN,
				token,
				username: user.username
			})
		} catch (err) {
			next(err)
		}
	},

	async logout(req, res) {
		res.json({
			message: message.SUCCESSFUL_LOGOUT
		})
	},

	verify(req, res) {
		res.json()
	}
}