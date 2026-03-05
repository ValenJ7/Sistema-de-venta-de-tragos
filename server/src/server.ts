import express, { Express } from 'express';
import colors from 'colors';
import swaggerUi from 'swagger-ui-express'; // Importante
import swaggerSpec from './config/swagger'; // Importante
import db from './config/db';
import router from './router';

async function connectDB() {
    try {
        await db.authenticate();
        await db.sync();
        console.log(colors.blue.bold('Conexión exitosa a la Base de Datos'));
    } catch (error) {
        console.log(colors.red.bold('Hubo un error al conectar a la BD'));
    }
}
connectDB();

const server: Express = express();
server.use(express.json());

// 1. Conectar las rutas de la API
server.use('/api', router);

// 2. Conectar la interfaz de Swagger
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default server;