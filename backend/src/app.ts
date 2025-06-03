import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import userRouter from './routes/user.routes';
import travelPreferenceRouter from './routes/travelPreference.routes';
import travelInterestsRouter from './routes/travelInterests.routes';
import itineraryRouter from './routes/itinerary.routes';
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
app.use('/preferences', travelPreferenceRouter);
app.use('/interests', travelInterestsRouter);
app.use('/itinerary', itineraryRouter);
app.use(errorHandler);
app.use('/login', loginRouter);
app.use('/login', loginRouter);
export default app;
