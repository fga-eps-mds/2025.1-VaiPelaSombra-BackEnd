import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import userRouter from './routes/user.routes';
import travelInterestsRouter from './routes/travelInterests.routes';
<<<<<<< HEAD
import transportRouter from './routes/transport.routes';
=======
import destinationRouter from './routes/destination.routes';
>>>>>>> 35cdb438e7ad48ece8a72348fd749b7a580102fb
import { errorHandler } from './errors/midle';
import loginRouter from './routes/login.routes';

const app = express();

// Swagger setup usando arquivo YAML externo
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.bundle.yaml'));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', userRouter);
<<<<<<< HEAD
app.use('/travel-interests', travelInterestsRouter);
app.use('/transports', transportRouter);
=======
app.use('/interests', travelInterestsRouter);
app.use('/destinations', destinationRouter);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/login', loginRouter);
>>>>>>> 35cdb438e7ad48ece8a72348fd749b7a580102fb
app.use(errorHandler);
export default app;
