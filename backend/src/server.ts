import express, { NextFunction, Request, response, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import config from './config/config';
import animeRoutes from './routes/animeRoutes';
import axios from 'axios';
import https from 'https';

const app = express();

app.use(express.json());

app.use('/api/v1/anime', animeRoutes);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Video Streaming</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        video { width: 100%; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>Video Player</h1>
      <video controls autoplay>
        <source src="/api/v1/anime/stream?url=https://uploads5.krakenfiles.com/play/video/NzljYmY5ODk5OTdhYTdiNzOBmZenFvODVpJTuJhM1euIBzQE3PPbYLJ8luZrX0MrvXFnTNRP0-aJYJ6FC0juoBZYJgiraaG3GXaRDpWrevJ2NMWSshkGobRRr5YmOt0J" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </body>
    </html>
  `);
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
