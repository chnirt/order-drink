const { sign, verify } = require('jsonwebtoken')

const { User } = require('../../models')

// let users = [
// 	{
// 		_id: 1,
// 		username: 'admin',
// 		password: '$2b$10$fTIcNNKUaZ4IOch5GUZp0eMXx.3/Y9F/xHv4SdjBMQzcZ6H.gbige',
// 		isAdmin: true
// 	},
// 	{
// 		_id: 2,
// 		username: 'member',
// 		password: '$2b$10$fTIcNNKUaZ4IOch5GUZp0eMXx.3/Y9F/xHv4SdjBMQzcZ6H.gbige',
// 		isAdmin: false
// 	}
// ]

const tokenType = {
	accessToken: {
		privateKey: process.env.ACCESS_TOKEN_KEY,
		expiresIn: process.env.NODE_ENV !== 'production' ? '30d' : '15m' // 15m
	},
	refreshToken: {
		privateKey: process.env.REFRESH_TOKEN_KEY,
		expiresIn: '7d' // 7d
	}
}

/**
 * Returns token.
 *
 * @remarks
 * This method is part of the {@link utils/jwt}.
 *
 * @param user - 1st input
 * @param type - 2nd input
 *
 * @returns The access token mean of `user`
 *
 * @beta
 */
const generateToken = async (user, type) => {
	return await sign(
		{
			_id: user._id
		},
		tokenType[type].privateKey,
		{
			issuer: 'Chnirt corp',
			subject: user.username,
			audience: 'https://github.com/chnirt',
			algorithm: 'HS256',
			expiresIn: tokenType[type].expiresIn
		}
	)
}

/**
 * Returns user by verify token.
 *
 * @remarks
 * This method is part of the {@link utils/jwt}.
 *
 * @param token - 1st input
 * @param type - 2nd input
 *
 * @returns The user mean of `token`
 *
 * @beta
 */
const verifyToken = async (token, type) => {
	let currentUser

	const { _id } = await verify(token, tokenType[type].privateKey)

	currentUser = await User.findOne({ _id })

	return currentUser
}

/**
 * Returns login response by trade token.
 *
 * @remarks
 * This method is part of the {@link utils/jwt}.
 *
 * @param user - 1st input
 *
 * @returns The login response mean of `user`
 *
 * @beta
 */
const tradeToken = async user => {
	const accessToken = await generateToken(user, 'accessToken')
	const refreshToken = await generateToken(user, 'refreshToken')

	return { accessToken, refreshToken }
}

module.exports = {
	tradeToken,
	verifyToken
}
