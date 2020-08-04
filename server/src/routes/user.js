const express = require('express')
// const { check, validationResult } = require('express-validator')
const router = express.Router()

const { hashPassword, comparePassword, tradeToken } = require('../utils')
const { checkAuth, createAccountLimiter } = require('../middlewares')
const { User } = require('../models')

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

/**
 * @swagger
 * definitions:
 *  UserResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      username:
 *        type: string
 */

/**
 * @swagger
 * definitions:
 *  CreateUser:
 *    type: object
 *    properties:
 *      username:
 *        type: string
 *        example: chnirt
 *      password:
 *        type: string
 *        example: "0"
 * 		required:
 *      - username
 *      - password
 */

/**
 * @swagger
 * definitions:
 *  LoginUser:
 *    type: object
 *    properties:
 *      username:
 *        type: string
 *        example: chnirt
 *      password:
 *        type: string
 *        example: "0"
 * 		required:
 *      - username
 *      - password
 */

/**
 * @swagger
 * definitions:
 *  LoginResponse:
 *    type: object
 *    properties:
 *      access_token:
 *        type: string
 *      refresh_token:
 *        type: string
 */

/**
 * @swagger
 * definitions:
 *  ErrorResponse:
 *    type: object
 *    properties:
 *      message:
 *        type: string
 */

/**
 * @swagger
 * definitions:
 *  ValidateErrorResponse:
 *    type: object
 *    properties:
 *      errors:
 *        type: array
 *        items:
 *            $ref: "#/definitions/UserResponse"
 */

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - users
 *     summary: Get users 👻
 *     description: Ok
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Get users successful
 *         schema:
 *            type: array
 *            items:
 *                $ref: "#/definitions/UserResponse"
 *       401:
 *         description: Token is invalid
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.get('/', checkAuth, async (req, res, next) => {
	// const formatUser = users.map(({ password, isAdmin, ...element }) => element)
	try {
		const formatUsers = await User.find().select('-password -orders')
		return res.status(200).json(formatUsers)
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *     - users
 *     summary: Retrieve token 👻
 *     description: If you wanna get an access token, Give me the f**king your information
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       description: Created user object
 *       required: true
 *       schema:
 *         $ref: "#/definitions/LoginUser"
 *     responses:
 *       200:
 *         description: Login successful
 *         schema:
 *            $ref: "#/definitions/LoginResponse"
 *       403:
 *         description: Username and password don't match
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       405:
 *         description: Invalid input
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Error
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.post('/login', async (req, res, next) => {
	try {
		const {
			body: { username, password }
		} = req

		// find user
		// const foundUser = users.find(element => element.username === username)
		const foundUser = await User.findOne({
			username
		})
		if (!foundUser) {
			return res
				.status(403)
				.json({ message: "Username or Password don't match" })
		}

		// validate password
		// const hashedPassword = users.find(element => element.username === username)
		// 	.password
		const hashedPassword = foundUser.password
		const compare = await comparePassword(password, hashedPassword)

		if (compare) {
			// create token
			const { accessToken, refreshToken } = await tradeToken(foundUser)
			return res.status(200).json({
				access_token: accessToken,
				refresh_token: refreshToken
			})
		}

		return res.status(403).json({ message: "Username or Password don't match" })
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *     - users
 *     summary: Create user 👻
 *     description: Give me the f**king your information to create
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       description: Created user object
 *       required: true
 *       schema:
 *         $ref: "#/definitions/CreateUser"
 *     responses:
 *       201:
 *         description: Registered successful
 *         schema:
 *            $ref: "#/definitions/UserResponse"
 *       403:
 *         description: Username is existed
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       422:
 *         description: Validate Error
 *         schema:
 *            $ref: "#/definitions/ValidateErrorResponse"
 *       500:
 *         description: Error
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.post('/register', createAccountLimiter, async (req, res, next) => {
	try {
		const {
			body: { username, password }
		} = req

		// validate username
		// const existedUser = users.find(element => element.username === username)
		const existedUser = await User.findOne({
			username
		})

		// console.log(existedUser)

		if (existedUser) {
			return res.status(403).json({
				message: 'Username is existed'
			})
		}

		// createed
		// users = [
		// 	...users,
		// 	{ id: ++users.length, username, password: await hashPassword(password) }
		// ]

		// return res.status(201).json({ message: 'Created successful' })

		const newUser = new User({
			username,
			password: await hashPassword(password)
		})

		const createdUser = await newUser.save()
		res.status(201).json({ data: createdUser, message: 'successful' })
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /users/{userId}/orders:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - users
 *     summary: Get order by userId 👻
 *     description: Ok
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: userId
 *       description: User ID
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Get users successful
 *         schema:
 *            type: array
 *            items:
 *                $ref: "#/definitions/UserResponse"
 *       401:
 *         description: Token is invalid
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.get('/:userId/orders', checkAuth, async (req, res, next) => {
	try {
		const {
			params: { userId }
		} = req
		const user = await User.findOne({ _id: userId })
			.select('-password')
			.populate('orders')

		return res.status(200).json(user)
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

module.exports = router
