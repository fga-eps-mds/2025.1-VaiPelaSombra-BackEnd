import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import exampleRouter from './routes/example';
import userRouter from './routes/user.routes';
import travelInterestsRouter from './routes/travelInterests.routes';

const app = express();

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'My REST API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // files containing annotations as above
};

const specs = swaggerJsdoc(options);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/example', exampleRouter);
app.use('/users', userRouter);
app.use('/api/user-preferences', userRouter);
app.use('/interests', travelInterestsRouter);

export default app;
