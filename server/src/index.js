const express = require('express')
const app = express()
// const http = require('http').createServer(app)
// const io = require('socket.io')(http)
const logger = require('morgan')
// const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')
const swaggerUi = require('swagger-ui-express')
const pg = require('pg')
const path = require('path')

require('dotenv').config()

const { notFound, errorHandler } = require('./middlewares')
const { swaggerSpec, mongoose } = require('./helpers')
const { PORT } = require('./constants')
const { verifyToken } = require('./utils')

const userRoute = require('./routes/user')
const invitationRoute = require('./routes/invitation')
const orderRoute = require('./routes/order')

const { Invitation } = require('./models')

const port = process.env.PORT || PORT

var conString = process.env.PG_URL //Can be found in the Details page
var client = new pg.Client(conString)
client.connect(function (err) {
	if (err) {
		return console.error('could not connect to postgres', err)
	}
	client.query('SELECT NOW() AS "theTime"', function (err, result) {
		if (err) {
			return console.error('error running query', err)
		}
		// console.log(result.rows[0].theTime)
		// >> output: 2018-08-23T14:02:57.117Z
		console.log('🐘  Connected successfully to postgres database')
		client.end()
	})
})

app.get('/swagger.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	res.send(swaggerSpec)
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(logger(process.env.NODE !== 'production' ? 'dev' : 'common')) // logger
// app.use(helmet()) // secure
app.use(
	cors({
		// origin: ['localhost:3000', 'https://9ljp4.csb.app']
	})
) // enable cors
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.use(compression()) // reduce file sizes

// routes
app.use('/users', userRoute)
app.use('/invitations', invitationRoute)
app.use('/orders', orderRoute)

app.use(express.static(path.join(__dirname, 'build')))
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.use(notFound)
app.use(errorHandler)

// connected mongo database
mongoose.connection.on('error', () => {
	console.log('❌  error occurred from the mongodb database')
})
mongoose.connection.once('open', () =>
	console.log('🌨  Connected successfully to mongodb database')
)

// create io
// io.use(async (socket, next) => {
// 	const {
// 		handshake: {
// 			query: { token }
// 		}
// 	} = socket
// 	if (token) {
// 		try {
// 			const token = socket.handshake.query.token

// 			const decoded = await verifyToken(token, 'accessToken')
// 			socket.decoded = decoded
// 			next()
// 		} catch (error) {
// 			next(new Error('Authentication error'))
// 		}
// 	} else {
// 		next(new Error('Authentication error'))
// 	}
// }).on('connection', (socket) => {
// 	console.log(`🔗  ${socket.id} connected`)
// 	socket.on('joinedRoom', (roomId) => {
// 		socket.join(roomId)

// 		// send other members in room except sender
// 		socket.broadcast.to(roomId).emit('joinedRoom', `${socket.id} joined room`)
// 	})

// 	socket.on('addOrder', async ({ roomId, data }) => {
// 		console.log('addOrder', roomId, data)

// 		const report = await Invitation.aggregate([
// 			{
// 				$match: { _id: mongoose.Types.ObjectId(roomId) }
// 			},
// 			{
// 				$lookup: {
// 					// from: 'orders',
// 					// localField: 'orders',
// 					// foreignField: '_id',
// 					// as: 'orders',

// 					from: 'orders',
// 					let: { orderId: '$orders' },
// 					pipeline: [
// 						{ $match: { $expr: { $in: ['$_id', '$$orderId'] } } },
// 						{
// 							$lookup: {
// 								from: 'users',
// 								localField: 'orderer',
// 								foreignField: '_id',
// 								as: 'orderer'
// 							}
// 						},
// 						{ $unwind: '$orderer' },
// 						{
// 							$group: {
// 								_id: '$dishId',
// 								orders: {
// 									$addToSet: '$orderer'
// 								},
// 								count: { $sum: '$quantity' }
// 							}
// 						}
// 					],
// 					as: 'orders'
// 				}
// 			},
// 			{
// 				$addFields: {
// 					total: { $sum: '$orders.count' }
// 				}
// 			}
// 		])

// 		// send to members in room
// 		io.sockets.to(roomId).emit('report', report)
// 	})

// 	socket.on('deleteOrder', async ({ roomId, data }) => {
// 		console.log('deleteOrder', roomId, data)

// 		const report = await Invitation.aggregate([
// 			{
// 				$match: { _id: mongoose.Types.ObjectId(roomId) }
// 			},
// 			{
// 				$lookup: {
// 					// from: 'orders',
// 					// localField: 'orders',
// 					// foreignField: '_id',
// 					// as: 'orders',

// 					from: 'orders',
// 					let: { orderId: '$orders' },
// 					pipeline: [
// 						{ $match: { $expr: { $in: ['$_id', '$$orderId'] } } },
// 						{
// 							$lookup: {
// 								from: 'users',
// 								localField: 'orderer',
// 								foreignField: '_id',
// 								as: 'orderer'
// 							}
// 						},
// 						{ $unwind: '$orderer' },
// 						{
// 							$group: {
// 								_id: '$dishId',
// 								orders: {
// 									$addToSet: '$orderer'
// 								},
// 								count: { $sum: '$quantity' }
// 							}
// 						}
// 					],
// 					as: 'orders'
// 				}
// 			},
// 			{
// 				$addFields: {
// 					total: { $sum: '$orders.count' }
// 				}
// 			}
// 		])

// 		// send to members in room
// 		io.sockets.to(roomId).emit('report', report)
// 	})

// 	socket.on('onChangeInvitation', () => {
// 		// send all client connect
// 		io.emit('onChangeInvitation', true)
// 	})

// 	socket.on('disconnect', (reason) => {
// 		if (reason === 'io server disconnect') {
// 			// the disconnection was initiated by the server, you need to reconnect manually
// 			socket.connect()
// 		}
// 		// else the socket will automatically try to reconnect
// 	})
// })

//create a server object:
app.listen(process.env.PORT || 3000, function () {
	console.log(
		'👻  Express server listening on port %d in %s mode',
		this.address().port,
		app.settings.env
	)
})
