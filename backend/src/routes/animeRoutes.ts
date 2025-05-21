import express from 'express';
import {
  getAnimeByGenre,
  getAnimeByStatus,
  getAnimeByType,
  getAnimeDetail,
  getAnimes,
  getEpisodeUrl,
  getFilter,
  getSearch,
} from '../controllers/animeController';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import https from 'https';

const router = express.Router();

router.get('/', getAnimes);

router.get(
  '/status/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const response = await getAnimeByStatus(id);

      res.status(201).json({ success: true, data: response });
    } catch (error: any) {
      console.error('Error in getStatus: ', error.message);
      res.status(501).json({ message: 'Internal server error' });
    }
  },
);

router.get(
  '/type/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const response = await getAnimeByType(id);

      res.status(201).json({ success: true, data: response });
    } catch (error: any) {
      console.error('Error in getType: ', error.message);
      res.status(501).json({ message: 'Internal server error' });
    }
  },
);

router.get(
  '/genre/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const genres = id.includes(',') ? id.split(',') : [id];
      const trimmedGenres = genres.map((genre) => genre.trim());

      const response = await getAnimeByGenre(trimmedGenres);

      res.status(201).json({ success: true, data: response });
    } catch (error: any) {
      console.error('Error in getType: ', error.message);
      res.status(501).json({ message: 'Internal server error' });
    }
  },
);

router.get(
  '/filter/:status/:type/:order',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, type, order } = req.params;
      const genre = req.query.genre as string;

      if (genre) {
        const genres = genre.includes(',') ? genre.split(',') : [genre];
        const trimmedGenres = genres.map((genre) => genre.trim());
        const response = await getFilter(status, type, order, trimmedGenres);
      }

      const response = await getFilter(status, type, order);

      res.status(201).json({ success: true, data: response });
    } catch (error: any) {
      console.error('Error in getType: ', error.message);
      res.status(501).json({ message: 'Internal server error' });
    }
  },
);

router.get(
  '/detail/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const response = await getAnimeDetail(id);

      res.status(201).json({ success: true, data: response });
    } catch (error: any) {
      console.error('Error in getDetail: ', error.message);
      res.status(501).json({ message: 'Internal server error' });
    }
  },
);

router.get(
  '/search/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const response = await getSearch(id);

      res.status(201).json({ success: true, data: response });
    } catch (error: any) {
      console.error('Error in getSearch: ', error.message);
      res.status(501).json({ message: 'Internal server error' });
    }
  },
);
router.get(
  '/extract/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const response = await getEpisodeUrl(id);
      res.status(201).json({ success: true, data: response });
    } catch (error: any) {
      console.error('Error in getEpisodeUrl: ', error.message);
      res.status(501).json({ message: 'Internal server error' });
    }
  },
);

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

router.get('/stream', async (req: Request, res: Response) => {
  const videoUrl = req.query.url as string;

  try {
    const headResponse = await axios({
      method: 'HEAD',
      url: videoUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Referer: 'https://mp4upload.com',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        Connection: 'keep-alive',
      },
      httpsAgent: httpsAgent,
    });

    const contentLength = headResponse.headers['content-length'];
    const contentType = headResponse.headers['content-type'];

    // Get range from request
    const range = req.headers.range;

    if (range && contentLength) {
      // Parse Range
      // Example: "bytes=32324-"
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : parseInt(contentLength, 10) - 1;
      const chunksize = end - start + 1;

      // Stream the video chunk
      const videoResponse = await axios({
        method: 'GET',
        url: videoUrl,
        headers: {
          Range: `bytes=${start}-${end}`,
          'User-Agent': 'Mozilla/5.0',
          Referer: 'https://mp4upload.com',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          Connection: 'keep-alive',
        },
        responseType: 'stream',
        httpsAgent: httpsAgent, // Skip SSL certificate validation
      });

      // Set response headers
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${contentLength}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType || 'video/mp4',
      });

      // Pipe the video stream to response
      videoResponse.data.pipe(res);
    } else {
      // If no range is provided, send the entire video (not recommended for large files)
      res.writeHead(200, {
        'Content-Length': contentLength,
        'Content-Type': contentType || 'video/mp4',
      });

      const videoResponse = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Referer: 'https://mp4upload.com',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          Connection: 'keep-alive',
        },
        httpsAgent: httpsAgent,
      });

      videoResponse.data.pipe(res);
    }
  } catch (error: any) {
    console.error('Error streaming video:', error);
    res.status(500).json({
      message: 'Error streaming video',
      error: error.message,
    });
  }
});

export default router;
