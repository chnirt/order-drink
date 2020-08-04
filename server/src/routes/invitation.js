const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const { comparePassword } = require('../utils')
const { checkAuth } = require('../middlewares')
const { Invitation, User, Order } = require('../models')
const data = require('../mocks/data.json')

/**
 * @swagger
 * definitions:
 *  CreateInvitation:
 *    type: object
 *    properties:
 *      coupon:
 *        type: string
 *        example: qwerty
 *      reason:
 *        type: string
 *        example: Hom nay Chin moi
 *      menuId:
 *        type: string
 *        enum: [phuc-long, go-cafe, highlands]
 *        example: phuc-long
 *      isPublic:
 *        type: boolean
 *        example: true
 */

/**
 * @swagger
 * definitions:
 *  UpdateInvitation:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *        example: Hom nay Ai moi
 *      password:
 *        type: string
 *        example: qwerty
 *      menuId:
 *        type: string
 *        enum: [phuc-long, go-cafe, highlands]
 *        example: go-cafe
 */

/**
 * @swagger
 * definitions:
 *  InvitationResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      coupon:
 *        type: string
 *      reason:
 *        type: string
 *      menuId:
 *        type: string
 *      invitor:
 *        type: string
 *      isActive:
 *        type: boolean
 *      isPublished:
 *        type: boolean
 *      isLocked:
 *        type: boolean
 *      isCompleted:
 *        type: boolean
 */

/**
 * @swagger
 * /invitations:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - invitations
 *     summary: Get invitations 👻
 *     description: Ok
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       name: mine
 *       description: Get invitation object by mine
 *       schema:
 *         type: boolean
 *     - in: query
 *       name: sortBy
 *       description: Get invitation object by sortBy
 *       schema:
 *         type: string
 *     - in: query
 *       name: isPublic
 *       description: Get invitation object by isPublic
 *       schema:
 *         type: boolean
 *     responses:
 *       200:
 *         description: Get invitations successful
 *         schema:
 *            type: array
 *            items:
 *                $ref: "#/definitions/InvitationResponse"
 *       401:
 *         description: Token is invalid
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.get('/', checkAuth, async (req, res, next) => {
	try {
		const {
			user: { _id }
		} = req

		const {
			query: { mine, sortBy, isPublic }
		} = req

		const match = {}
		let sort

		if (mine) {
			match.invitor = mine ? _id : null
		}

		if (isPublic) {
			match.isPublic = isPublic
		}

		if (sortBy) {
			sort = sortBy
		}

		// let skip = +req.query.skip || 0
		// let limit = +req.query.limit || 0 // Make sure to parse the limit to number

		// if (req.query.page) {
		// 	limit = req.query.page_size || 20 // Similar to 'limit'
		// 	skip = (req.query.page - 1) * limit
		// }

		const invitations = await Invitation.find({
			...match
		})
			.sort(sort)
			.populate('invitor')
		return res.status(200).json(invitations)
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /invitations:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - invitations
 *     summary: Create invitation 👻
 *     description: Give me the f**king your information to create
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       description: Created invitation object
 *       required: true
 *       schema:
 *         $ref: "#/definitions/CreateInvitation"
 *     responses:
 *       201:
 *         description: Invited successful
 *         schema:
 *            $ref: "#/definitions/OrderResponse"
 *       403:
 *         description: You invited today
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

		// const { title, password, menuId } = req.body
		const {
			body: { coupon, reason, menuId, isPublic }
		} = req

		// var start = new Date()
		// start.setHours(0, 0, 0, 0)

		// var end = new Date()
		// end.setHours(23, 59, 59, 999)

		// const invited = await Invitation.findOne({
		// 	invitor: user._id,
		// 	createdAt: { $gte: start, $lt: end }
		// })

		// if (invited) {
		// 	return res.status(403).json({
		// 		message: 'You invited today'
		// 	})
		// }

		const newInvitation = new Invitation({
			coupon,
			reason,
			menuId,
			invitor: _id,
			isActive: true,
			isPublic,
			isLocked: false,
			isCompleted: false
		})

		const createdInvitation = await newInvitation.save()

		const foundUser = await User.findOne({ _id })
		foundUser.invitations.push(newInvitation)
		await foundUser.save()

		return res.status(201).json(createdInvitation)
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /invitations/{invitationId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - invitations
 *     summary: Get invitation 👻
 *     description: Give me the f**king your information to get
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: invitationId
 *       description: invitation ID
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Get invitation successful
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       403:
 *         description: You are not invited
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Error
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.get('/:invitationId', checkAuth, async (req, res, next) => {
	try {
		const {
			params: { invitationId }
		} = req

		const invitation = await Invitation.findOne({ _id: invitationId })

		if (!invitation) {
			return res.status(404).json({
				message: 'No valid entry found for provided ID'
			})
		}

		return res.status(200).json(invitation)
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /invitations/{invitationId}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - invitations
 *     summary: Update invitation by invitationId 👻
 *     description: Ok
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: invitationId
 *       description: invitation ID
 *       required: true
 *       schema:
 *         type: string
 *     - in: body
 *       name: body
 *       description: Updated invitation object
 *       required: true
 *       schema:
 *         $ref: "#/definitions/UpdateInvitation"
 *     responses:
 *       200:
 *         description: Updated successful
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Error
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.patch('/:invitationId', checkAuth, async (req, res, next) => {
	try {
		const {
			params: { invitationId }
		} = req
		const { body } = req

		const result = await Invitation.findOneAndUpdate(
			{ _id: invitationId },
			body
		)
		if (!result) {
			return res.status(404).json({
				message: 'No valid entry found for provided ID'
			})
		}

		return res.status(200).json({
			message: 'successful'
		})
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /invitations/{invitationId}/verify:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - invitations
 *     summary: Verify invitation 👻
 *     description: Give me the f**king your information to create
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: invitationId
 *       description: invitation ID
 *       required: true
 *       schema:
 *         type: string
 *     - in: query
 *       name: password
 *       description: The password for verify
 *       required: true
 *       default: qwerty
 *       type: string
 *     responses:
 *       200:
 *         description: Verified successful
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       403:
 *         description: Your password is incorrect
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Error
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.post('/:invitationId/verify', checkAuth, async (req, res, next) => {
	try {
		const { user } = req
		const {
			params: { invitationId }
		} = req
		const {
			query: { password }
		} = req

		const verifiedInvitation = await Invitation.findOne({
			_id: invitationId,
			password: { $ne: null }
		})

		if (!verifiedInvitation) {
			return res.status(404).json({
				message: 'No valid entry found for provided ID'
			})
		}

		const result = await comparePassword(password, verifiedInvitation.password)

		if (result) {
			const joined = await Invitation.findOne({
				_id: invitationId,
				members: user._id
			})

			if (joined) {
				return res.status(403).json({
					message: 'You joined'
				})
			}

			await Invitation.findOneAndUpdate(
				{ _id: invitationId },
				{ $push: { members: user._id } },
				{ new: true }
			)

			return res.status(200).json({ message: 'successful' })
		}

		return res.status(403).json({ message: 'Password is incorrect' })
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /invitations/{invitationId}/join:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - invitations
 *     summary: Join invitation 👻
 *     description: Give me the f**king your information to create
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: invitationId
 *       description: invitation ID
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Joined successful
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       403:
 *         description: You joined
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Error
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.post('/:invitationId/join', checkAuth, async (req, res, next) => {
	try {
		const {
			user: { _id }
		} = req

		const {
			params: { invitationId }
		} = req

		// const owner = await Invitation.findOne({
		// 	_id: invitationId,
		// 	invitor: user._id
		// })

		// if (owner) {
		// 	return res.status(403).json({
		// 		message: 'You are owner'
		// 	})
		// }

		const joined = await Invitation.findOne({
			_id: invitationId,
			members: _id
		})

		if (joined) {
			return res.status(403).json({
				message: 'You joined'
			})
		}

		await Invitation.findOneAndUpdate(
			{ _id: invitationId },
			{ $push: { members: _id } },
			{ new: true }
		)

		return res.status(200).json({ message: 'successful' })
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /invitations/{invitationId}/leave:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - invitations
 *     summary: Leave invitation 👻
 *     description: Give me the f**king your information to leave
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: invitationId
 *       description: invitation ID
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Left successful
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       403:
 *         description: You left
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Error
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.post('/:invitationId/leave', checkAuth, async (req, res, next) => {
	try {
		const {
			user: { _id }
		} = req

		const {
			params: { invitationId }
		} = req

		const joined = await Invitation.findOne({
			_id: invitationId,
			members: _id
		})

		if (!joined) {
			return res.status(403).json({
				message: 'You do not join'
			})
		}

		await Invitation.findOneAndUpdate(
			{ _id: invitationId },
			{ $pull: { members: _id } },
			{ new: true }
		)

		return res.status(200).json({ message: 'successful' })
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /invitations/{invitationId}/menu:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - invitations
 *     summary: Get invitation menu 👻
 *     description: Give me the f**king your information to create
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: invitationId
 *       description: invitation ID
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Get menu successful
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       403:
 *         description: You are not invited
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Error
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.get('/:invitationId/menu', checkAuth, async (req, res, next) => {
	try {
		const {
			user: { _id }
		} = req

		const {
			params: { invitationId }
		} = req

		const joined = await Invitation.findOne({
			_id: invitationId,
			members: _id
		})

		if (!joined) {
			return res.status(403).json({
				message: 'You do not join'
			})
		}

		const invitation = await Invitation.findOne({ _id: invitationId })

		const name = invitation.menuId
		// console.log("123", name);
		// console.log("456", Object.keys(data));
		const result = Object.keys(data).find(item => {
			// console.log(name, item, name.includes(item));
			return name.includes(item)
		})
		// console.log("789", data[result]);

		const menu = data[result]

		return res.status(200).json(menu)
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * /invitations/{invitationId}/report:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - invitations
 *     summary: Get invitation report 👻
 *     description: Give me the f**king your information to create
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: invitationId
 *       description: invitation ID
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Get report successful
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       403:
 *         description: You are not invited
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Error
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.get('/:invitationId/report', checkAuth, async (req, res, next) => {
	try {
		const {
			user: { _id }
		} = req

		const {
			params: { invitationId }
		} = req

		const joined = await Invitation.findOne({
			_id: invitationId,
			members: _id
		})

		if (!joined) {
			return res.status(403).json({
				message: 'You do not join'
			})
		}
		// const invitation = await Invitation.findOne({ _id: invitationId })
		// 	.populate('invitor members orders')
		// 	.group('orders.dishId')

		const report = await Invitation.aggregate([
			{
				$match: { _id: mongoose.Types.ObjectId(invitationId) }
			},
			{
				$lookup: {
					// from: 'orders',
					// localField: 'orders',
					// foreignField: '_id',
					// as: 'orders',

					from: 'orders',
					let: { orderId: '$orders' },
					pipeline: [
						{ $match: { $expr: { $in: ['$_id', '$$orderId'] } } },
						{
							$lookup: {
								from: 'users',
								localField: 'orderer',
								foreignField: '_id',
								as: 'orderer'
							}
						},
						{
							$group: {
								_id: '$dishId',
								orders: {
									$addToSet: '$orderer'
								},
								count: { $sum: '$quantity' }
							}
						}
					],
					as: 'orders'
				}
			},
			{
				$addFields: {
					total: { $sum: '$orders.count' }
				}
			}
		])

		return res.status(200).json(report)
	} catch (error) {
		return res.status(500).json({ message: error })
	}
})

/**
 * @swagger
 * invitations/{invitationId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - invitations
 *     summary: Delete invitation by invitationId 👻
 *     description: Ok
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: invitationId
 *       description: Invitation ID
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Delete invitation successful
 *         schema:
 *            $ref: "#/definitions/InvitationResponse"
 *       401:
 *         description: Token is invalid
 *         schema:
 *            $ref: "#/definitions/ErrorResponse"
 */
router.delete('/:invitationId', checkAuth, async (req, res, next) => {
	try {
		const {
			params: { invitationId }
		} = req
		const {
			user: { _id }
		} = req

		const result = await Invitation.findOneAndDelete({ _id: invitationId })
		if (!result) {
			return res.status(404).json({
				message: 'No valid entry found for provided ID'
			})
		}

		await Order.remove({ _id: { $in: result.orders } })

		await User.findOneAndUpdate(
			{ _id: _id },
			{ $pull: { invitations: invitationId } },
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
