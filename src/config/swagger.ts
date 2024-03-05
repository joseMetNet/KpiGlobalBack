import { SwaggerOptions } from 'swagger-ui-express';

export const swaggerOptions: SwaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.1',
		info: {
			title: 'Documentation for KPI Global API',
			version: '1.0.0',
			descripcion: 'Documentation for API',
			contact: {
				name: 'Metnet',
				email: 'development@metnet.co',
				url: 'https://metnet.co/'
			},
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				}
			}
		},
		'security': [
			{
				'bearerAuth': []
			}
		],
		servers: [
			{
				url: 'http://localhost:8080/api',
				descripcion: 'Development server'
			},
			{
				url: 'https://backkpiglobal.azurewebsites.net/api',
				descripcion: 'Production server'
			}
		]
	},
	apis: ['./src/routes/*.routes.ts'],
};
