const swaggerJSDoc = require('swagger-jsdoc')

const { HOST } = require('../../constants')

const swaggerDefinition = {
	swagger: '2.0',
	info: {
		description: 'This is a sample server Chnirt server.',
		version: '1.0.0',
		title: 'Swagger Chnirt',
		termsOfService: 'http://swagger.io/terms/',
		contact: {
			email: 'trinhchinchin@gmail.com'
		},
		license: {
			name: 'MIT',
			url: 'https://opensource.org/licenses/MIT'
		}
	},
	HOST,
	basePath: '/',
	tags: [
		{
			name: 'users',
			description: 'Operations about users',
			externalDocs: {
				description: 'Find out more about our store',
				url: 'http://swagger.io'
			}
		},
		{
			name: 'invitations',
			description: 'Operations about invitation',
			externalDocs: {
				description: 'Find out more about our store',
				url: 'http://swagger.io'
			}
		},
		{
			name: 'orders',
			description: 'Operations about order',
			externalDocs: {
				description: 'Find out more about our store',
				url: 'http://swagger.io'
			}
		}
	],
	schemes:
		process.env.NODE_ENV === 'production'
			? ['https', 'http']
			: ['http', 'https'],
	consumes: ['application/json'],
	produces: ['application/json'],
	securityDefinitions: {
		bearerAuth: {
			type: 'apiKey',
			name: 'Authorization',
			in: 'header',
			description:
				'Enter your bearer token in the format **Bearer &lt;token>**',
			example: 'Bearer xxx'
		}
	},
	externalDocs: {
		description: 'Find out more about Swagger',
		url: 'http://swagger.io'
	}
}

const options = {
	swaggerDefinition,
	apis: ['src/index.js', 'src/routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = {
	swaggerSpec
}
