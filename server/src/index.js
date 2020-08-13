const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const logger = require('morgan')
// const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')
const swaggerUi = require('swagger-ui-express')
const pg = require('pg')

require('dotenv').config()

const { notFound, errorHandler } = require('./middlewares')
const { swaggerSpec, mongoose } = require('./helpers')
const { port, host } = require('./constants')

const userRoute = require('./routes/user')
const invitationRoute = require('./routes/invitation')
const orderRoute = require('./routes/order')

const { Invitation } = require('./models')

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

app.get('/', (req, res) => {
	// res.send(`Hello <a href='https://${host}${req.url}api-docs/'>Swagger!</a>`)
	// res.redirect('https://' + host + req.url + 'api-docs/')
	res.redirect('http://' + host + ':' + port + '/api-docs/')
})

app.use(notFound)
app.use(errorHandler)

// connected mongo database
mongoose.connection.on('error', () => {
	console.log('❌  error occurred from the mongodb database')
})
mongoose.connection.once('open', () =>
	console.log(`🌨  Connected successfully to mongodb database`)
)

let messages = []
let rooms = [{ id: 1, messages: ['Hello Socket.IO'] }]

// create io
io.on('connection', (socket) => {
	console.log('❌ connection')
	socket.on('joined room', (roomId) => {
		socket.join(roomId)

		// const foundRooms = rooms.filter((item) => item.id === roomId)
		// // check existed room
		// if (foundRooms.length <= 0) {
		// 	rooms.unshift({
		// 		id: roomId,
		// 		messages: [`${socket.id}: joined room`, ...messages]
		// 	})
		// } else {
		// 	const roomIndex = rooms.findIndex((item) => item.id === roomId)
		// 	rooms[roomIndex].messages = [
		// 		`${socket.id}: joined room`,
		// 		...rooms[roomIndex].messages
		// 	]

		// 	// get all messages in room
		// 	socket.emit(
		// 		'allMessages',
		// 		rooms.filter((item) => item.id === roomId)[0].messages
		// 	)
		// }

		// send other members
		socket.broadcast.to(roomId).emit('joined room', `${socket.id} joined room`)
	})

	socket.on('sendCart', async ({ roomId, data }) => {
		// rooms
		// 	.filter((item) => item.id === roomId)[0]
		// 	.messages.unshift(`${socket.id}: ${data}`)

		console.log('send', roomId, data)

		const report = await Invitation.aggregate([
			{
				$match: { _id: mongoose.Types.ObjectId(roomId) }
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
						{ $unwind: '$orderer' },
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

		// send to members in room
		io.sockets.to(roomId).emit('report', report)
	})

	socket.on('disconnect', (reason) => {
		if (reason === 'io server disconnect') {
			// the disconnection was initiated by the server, you need to reconnect manually
			socket.connect()
		}
		// else the socket will automatically try to reconnect
	})
})

//create a server object:
http.listen(port, () => {
	console.log(`👻  Listening on port ${port}`)
}) //the server object listens on port 8080
