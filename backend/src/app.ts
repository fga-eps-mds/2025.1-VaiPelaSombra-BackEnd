import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import userRouter from './routes/user.routes';
import travelInterestsRouter from './routes/travelInterests.routes';
import destinationsRoutes from './routes/destination.routes'; 
import { errorHandler } from './errors/midle';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.bundle.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas
app.use('/users', userRouter);
app.use('/api/user-preferences', userRouter);
app.use('/interests', travelInterestsRouter);
app.use('/travel-interests', travelInterestsRouter);
app.use('/destinations', destinationsRoutes);

app.use(errorHandler);

export default app;