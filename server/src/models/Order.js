const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
	{
		dishId: { type: String },
		invitation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'invitation'
		},
		orderer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		},
		quantity: { type: Number }
	},
	{
		timestamps: true
	}
)

module.exports = { Order: mongoose.model('order', orderSchema) }
