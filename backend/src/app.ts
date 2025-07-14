import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes';
import travelInterestsRouter from './routes/travelInterests.routes';
import transportRouter from './routes/transport.routes';
import destinationRouter from './routes/destination.routes';
import homeRouter from './routes/home.routes';
import authRouter from './routes/auth.routes';
import itineraryRouter from './routes/itinerary.routes';

import { errorHandler } from './errors/errorHandler';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.bundle.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/travel-interests', travelInterestsRouter);
app.use('/transports', transportRouter);
app.use('/destinations', destinationRouter);
app.use('/home', homeRouter);
app.use('/itineraries', itineraryRouter);
app.use(errorHandler);

export default app;
