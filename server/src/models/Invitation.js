const mongoose = require('mongoose')

const invitationSchema = new mongoose.Schema(
	{
		coupon: { type: String },
		reason: { type: String },
		menuId: { type: String },
		invitor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'user'
			}
		],
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'order'
			}
		],
		isActive: { type: Boolean },
		isPublic: { type: Boolean },
		isLocked: { type: Boolean },
		isCompleted: { type: Boolean }
	},
	{
		timestamps: true
	}
)

module.exports = { Invitation: mongoose.model('invitation', invitationSchema) }
