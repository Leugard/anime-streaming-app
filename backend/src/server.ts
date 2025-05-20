import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import config from './config/config';
import animeRoutes from './routes/animeRoutes';

const app = express();

app.use(express.json());

app.use('/api/v1/anime', animeRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
