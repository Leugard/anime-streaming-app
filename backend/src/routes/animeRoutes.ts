import express from 'express';
import {
  getAnimeDetail,
  getEpisodeUrl,
  getFilter,
  getSearch,
} from '../controllers/animeController';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import https from 'https';

const router = express.Router();

router.get(
  '/filter/:page',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page } = req.params;
      const status = req.query.status as string;
      const type = req.query.type as string;
      const order = req.query.order as string;
      const genre = req.query.genre as string;

      if (genre) {
        const genres = genre.includes(',') ? genre.split(',') : [genre];
        const trimmedGenres = genres.map((genre) => genre.trim());
        const response = await getFilter(
          page,
          type,
          order,
          status,
          trimmedGenres,
        );

        res.status(201).json({ success: true, data: response });
      } else {
        const response = await getFilter(page, type, order, status);

        res.status(201).json({ success: true, data: response });
      }
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

  if (!videoUrl) {
    res
      .status(400)
      .json({ success: false, message: "Missing 'url' query parameter." });
  }

  try {
    const range = req.headers.range;

    const response = await axios.get(videoUrl, {
      responseType: 'stream',
      headers: {
        Range: range || '',
        Referer: videoUrl,
      },
      httpsAgent: httpsAgent,
    });

    const headers = Object.fromEntries(Object.entries(response.headers));
    res.writeHead(response.status, headers);
    response.data.pipe(res);
  } catch (error: any) {
    console.error('Stream proxy error:', error.message);
    res
      .status(500)
      .json({ success: false, message: 'Failed to stream video.' });
  }
});

export default router;
