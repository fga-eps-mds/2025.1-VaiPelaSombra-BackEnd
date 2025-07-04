import express from 'express';
import cors from 'cors';
// import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import userRouter from './routes/user.routes';
import travelInterestsRouter from './routes/travelInterests.routes';
import destinationRouter from './routes/destination.routes';
import { errorHandler } from './errors/errorHandler';
import authRouter from './routes/auth.routes';
import cookieParser from 'cookie-parser';
const app = express();

// Swagger setup usando arquivo YAML externo
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.bundle.yaml'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', userRouter);
app.use('/interests', travelInterestsRouter);
app.use('/destinations', destinationRouter);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/auth', authRouter);
app.use(errorHandler);
export default app;
