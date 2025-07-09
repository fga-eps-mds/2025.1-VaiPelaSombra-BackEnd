import express from 'express';
import cors from 'cors';
// import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import userRouter from './routes/user.routes';
import travelInterestsRouter from './routes/travelInterests.routes';
import transportRouter from './routes/transport.routes';
import destinationRouter from './routes/destination.routes';
import homeRouter from './routes/home.routes';
//import loginRouter from './routes/login.routes';
import { errorHandler } from './errors/errorHandler';
import authRouter from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import intineraryRouter from './routes/itinerary.routes';

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Swagger
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.bundle.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas
app.use('/interests', travelInterestsRouter);
app.use('/users', userRouter);
app.use('/travel-interests', travelInterestsRouter);
app.use('/transports', transportRouter);
app.use('/interests', travelInterestsRouter);
app.use('/destinations', destinationRouter);
app.use('/home', homeRouter);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/auth', authRouter);
app.use('/transports', transportRouter);
// app.use('/login', loginRouter);
app.use('/itineraries', intineraryRouter);
app.use(errorHandler);

export default app;
