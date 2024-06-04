module.exports = {
	serverError(err, req, res, next) {
		res.status(500).json({
			status: 'error',
			data: null,
			message: err.toString()
		})
	}
}