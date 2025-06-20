import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import userRouter from './routes/user.routes';
import travelInterestsRouter from './routes/travelInterests.routes';
import destinationRouter from './routes/destination.routes';
import homeRouter from './routes/home.routes';
import { errorHandler } from './errors/midle';
import loginRouter from './routes/login.routes';

const app = express();

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.bundle.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas principais
app.use('/users', userRouter);
app.use('/api/user-preferences', userRouter);
app.use('/interests', travelInterestsRouter);
app.use('/travel-interests', travelInterestsRouter);
app.use('/destinations', destinationRouter);
app.use('/home', homeRouter);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/login', loginRouter);

app.use(errorHandler);

export default app;
