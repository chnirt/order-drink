const errorHandler = (error, req, res, next) => {
	res.status(error.status || 500)
	res.json({
		message: error.message,
		stack: process.env.NODE === 'production' ? '👻' : error.stack
	})
}

module.exports = { errorHandler }
