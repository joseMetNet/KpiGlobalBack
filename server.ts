import { config, swaggerOptions } from './src/config';
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'colors';
import fileUpload from 'express-fileupload';
import { authRoutes } from './src/routes';
import i18n from './src/config/i18n';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

class Server {
	private app: Application;
	private port: number;

	constructor() {
		this.app = express();
		this.port = config.APP_PORT;
		this.initializeSwagger();
		this.middlewares();
		this.routes();
	}

	private middlewares(): void {
		this.app.use(cors());
		this.app.use(express.static('public'));
		this.app.use(express.json());
		this.app.use(morgan('dev'));
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: './tmp/',
				createParentPath: true,
			})
		);
		this.app.use(i18n.init);
		this.app.disable('x-powered-by');
	}
  
	private initializeSwagger(): void {
		const configSwagger = swaggerJSDoc(swaggerOptions);
		this.app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(configSwagger));
	}

	private routes(): void {
		authRoutes(this.app);
	}

	public listen(): void {
		console.clear();
		this.app.listen(this.port, () => {
			console.log(` 🔥 Server in port ${this.port}`.bold);
		});
	}
}

export default Server;
