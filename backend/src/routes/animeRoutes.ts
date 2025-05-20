import express from 'express';
import {
  getAnimeByGenre,
  getAnimeByStatus,
  getAnimeByType,
  getAnimeDetail,
  getAnimes,
  getFilter,
  getStream,
} from '../controllers/animeController';
import { Request, Response, NextFunction } from 'express';
import { extractDoodstream, extractKrakenFiles } from '../utils/extractor';

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
  '/filter/:status/:type/:order/:genre',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, type, order, genre } = req.params;

      const genres = genre.includes(',') ? genre.split(',') : [genre];
      const trimmedGenres = genres.map((genre) => genre.trim());

      const response = await getFilter(status, type, order, trimmedGenres);

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
  '/stream/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const baseUrl = 'https://kuronime.vip/';
      const url = `${baseUrl}${id}`;
      const response = await getStream(url);

      res.status(201).json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      console.error('Error in getStream: ', error.message);
      res.status(501).json({ message: 'Internal server error' });
    }
  },
);

router.get(
  '/extract/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const baseUrl = 'https://do7go.com/';
      const url = `${baseUrl}e/${id}`;
      const response = await extractDoodstream(url);

      res.status(201).json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      console.error('Error in extracting: ', error.message);
      res.status(501).json({ message: 'Internal server error' });
    }
  },
);

export default router;
