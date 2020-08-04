const mongoose = require('mongoose')

// const config = require('../../config/default.json')

const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true
}

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URL, connectionOptions)

mongoose.set('debug', true)

module.exports = { mongoose }
