const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String
		},
		password: {
			type: String
		},
		invitations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'invitations'
			}
		],
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'order'
			}
		]
	},
	{
		timestamps: true
	}
)

module.exports = { User: mongoose.model('user', userSchema) }
