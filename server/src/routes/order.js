const express = require('express')
const router = express.Router()

const { checkAuth } = require('../middlewares')
const { Order, User, Invitation } = require('../models')

/**
 * @swagger
 * definitions:
 *  OrderResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      dishId:
 *        type: string
 *      quantity:
 *        type: number
 *      invitation:
 *        type: object
 *      orderer:
 *        type: object
 */

/**
 * @swagger
 * definitions:
 *  CreateOrder:
 *    type: object
 *    properties:
 *      dishId:
 *        type: string
 *        example: Tra sua khong duong
 *      invitation:
 *        type: string
 *        example: 5f1023e34207ab1cc58065c3
 *      quantity:
 *        type: number
 *        example: 1
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - orders
 *     summary: Get orders 👻
 *     description: Ok
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Get orders successful
 *         schema:
 *            type: array
 *            items:
 *                $ref: "#/definitions/OrderResponse"
 *       401:
 *         description: Token is invalid
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.get('/', checkAuth, async (req, res, next) => {
	try {
		const orders = await Order.find()
		return res.status(200).json(orders)
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /orders:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - orders
 *     summary: Create order 👻
 *     description: Give me the f**king your information to create
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       description: Created order object
 *       required: true
 *       schema:
 *         $ref: "#/definitions/CreateOrder"
 *     responses:
 *       201:
 *         description: Ordered successful
 *         schema:
 *            $ref: "#/definitions/OrderResponse"
 *       403:
 *         description: You booked today
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Error
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.post('/', checkAuth, async (req, res, next) => {
	try {
		const {
			user: { _id }
		} = req
		// "Trà nõn tôm ủ lạnh"
		const {
			body: { dishId, invitation, quantity }
		} = req

		const joined = await Invitation.findOne({
			_id: invitation,
			members: _id
		})

		if (!joined) {
			return res.status(403).json({
				message: 'You do not join'
			})
		}

		var start = new Date()
		start.setHours(0, 0, 0, 0)

		var end = new Date()
		end.setHours(23, 59, 59, 999)

		const booked = await Order.findOne({
			invitation,
			orderer: _id,
			createdAt: { $gte: start, $lt: end }
		})

		if (booked) {
			return res.status(403).json({
				message: 'You booked today'
			})
		}

		const newOrder = new Order({
			dishId,
			invitation,
			quantity,
			orderer: _id
		})

		const createdOrder = await newOrder.save()

		await Invitation.findOneAndUpdate(
			{ _id: invitation },
			{ $push: { orders: createdOrder._id } },
			{ new: true }
		)

		await User.findOneAndUpdate(
			{ _id: _id },
			{ $push: { orders: createdOrder._id } },
			{ new: true }
		)

		return res.status(201).json(createdOrder)
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /orders/{orderId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - orders
 *     summary: Delete order by orderId 👻
 *     description: Ok
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: orderId
 *       description: Order ID
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Delete order successful
 *         schema:
 *            $ref: "#/definitions/OrderResponse"
 *       401:
 *         description: Token is invalid
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.delete('/:orderId', checkAuth, async (req, res, next) => {
	try {
		const {
			params: { orderId }
		} = req
		const {
			user: { _id }
		} = req

		const result = await Order.findOneAndDelete({ _id: orderId })
		if (!result) {
			return res.status(404).json({
				message: 'No valid entry found for provided ID'
			})
		}

		await Invitation.findOneAndUpdate(
			{ _id: result.invitation },
			{ $pull: { orders: orderId } },
			{ new: true }
		)

		await User.findOneAndUpdate(
			{ _id },
			{ $pull: { orders: orderId } },
			{ new: true }
		)

		return res.status(200).json({
			message: 'successful'
		})
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

module.exports = router
