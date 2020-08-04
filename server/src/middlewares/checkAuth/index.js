const { verifyToken } = require('../../utils')

const checkAuth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]

		const decoded = await verifyToken(token, 'accessToken')
		req.user = decoded
		next()
	} catch (error) {
		return res.status(401).json({
			message: 'Token is invalid'
		})
	}
}

module.exports = { checkAuth }
