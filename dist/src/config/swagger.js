"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
exports.swaggerOptions = {
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
                url: 'http://localhost:3000/api',
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
//# sourceMappingURL=swagger.js.map