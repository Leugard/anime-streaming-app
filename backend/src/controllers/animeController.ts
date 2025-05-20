import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import * as cheerio from 'cheerio';
import CryptoJS from 'crypto-js';

export const getAnimes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let currentPage = 1;
    let hasNextPage = true;
    let allAnime: any[] = [];

    const limit = 600;

    while (hasNextPage && allAnime.length <= limit) {
      console.log('Fetching page', currentPage);

      const url = `https://samehadaku.now/daftar-anime-2/page/${currentPage}`;
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const anime: {
          id: string | undefined;
          title: string;
          thumbnail: string | undefined;
          url: string | undefined;
        }[] = [];

        $('.animposx').each((i, el) => {
          const title = $(el).find('.title h2').text().trim();
          const thumbnail = $(el).find('img').attr('src');
          const url = $(el).find('a').attr('href');
          const id = url ? url.split('/').filter(Boolean).pop() : '';
          anime.push({ id, title, thumbnail, url });
        });

        allAnime.push(...anime);

        const isLastPage =
          anime.length === 0 || (anime.length === limit && currentPage > 1);

        if (isLastPage) {
          hasNextPage = false;
          console.log('Reached last page at page', currentPage);
        } else {
          currentPage++;
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          hasNextPage = false;
          console.log('Reached end of pages at page', currentPage);
        } else {
          throw error;
        }
      }
    }
    res.status(201).json({
      success: true,
      totalPages: currentPage,
      totalItems: allAnime.length,
      data: allAnime,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnimeByStatus = async (id: String) => {
  try {
    let currentPage = 1;
    let hasNextPage = true;
    let allAnime: any[] = [];

    const limit = 600;

    while (hasNextPage && allAnime.length <= limit) {
      console.log('Fetching page', currentPage);

      const url = `https://samehadaku.now/daftar-anime-2/page/${currentPage}/?title&status=${id}&type&order=title`;
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const anime: {
          id: string | undefined;
          title: string;
          thumbnail: string | undefined;
          url: string | undefined;
        }[] = [];

        $('.animposx').each((i, el) => {
          const title = $(el).find('.title h2').text().trim();
          const thumbnail = $(el).find('img').attr('src');
          const url = $(el).find('a').attr('href');
          const id = url ? url.split('/').filter(Boolean).pop() : '';
          anime.push({ id, title, thumbnail, url });
        });

        allAnime.push(...anime);

        const isLastPage =
          anime.length === 0 || (anime.length === limit && currentPage > 1);

        if (isLastPage) {
          hasNextPage = false;
          console.log('Reached last page at page', currentPage);
        } else {
          currentPage++;
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          hasNextPage = false;
          console.log('Reached end of pages at page', currentPage);
        } else {
          throw error;
        }
      }
    }

    return allAnime;
  } catch (error: any) {
    console.error('error in getAnimeByStatus: ', error.message);
    throw new Error('Server Error');
  }
};

export const getAnimeByType = async (id: String) => {
  try {
    let currentPage = 1;
    let hasNextPage = true;
    let allAnime: any[] = [];

    const limit = 600;

    while (hasNextPage && allAnime.length <= limit) {
      console.log('Fetching page', currentPage);

      const url = `https://samehadaku.now/daftar-anime-2/page/${currentPage}/?title=&status=&type=${id}&order=title`;
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const anime: {
          id: string | undefined;
          title: string;
          thumbnail: string | undefined;
          url: string | undefined;
        }[] = [];

        $('.animposx').each((i, el) => {
          const title = $(el).find('.title h2').text().trim();
          const thumbnail = $(el).find('img').attr('src');
          const url = $(el).find('a').attr('href');
          const id = url ? url.split('/').filter(Boolean).pop() : '';
          anime.push({ id, title, thumbnail, url });
        });

        allAnime.push(...anime);

        const isLastPage =
          anime.length === 0 || (anime.length === limit && currentPage > 1);

        if (isLastPage) {
          hasNextPage = false;
          console.log('Reached last page at page', currentPage);
        } else {
          currentPage++;
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          hasNextPage = false;
          console.log('Reached end of pages at page', currentPage);
        } else {
          throw error;
        }
      }
    }

    return allAnime;
  } catch (error: any) {
    console.error('error in getAnimeByType: ', error.message);
    throw new Error('Server Error');
  }
};

export const getAnimeByGenre = async (id: string[]) => {
  try {
    let currentPage = 1;
    let hasNextPage = true;
    let allAnime: any[] = [];

    const limit = 600;

    let genreParams = '';
    id.forEach((genre) => {
      genreParams += `&genre%5B%5D=${encodeURIComponent(genre)}`;
    });

    while (hasNextPage && allAnime.length <= limit) {
      console.log('Fetching page', currentPage);

      const url = `https://samehadaku.now/daftar-anime-2/page/${currentPage}/?title=&status=&type=&order=title&${genreParams}`;

      console.log('url: ', url);
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const anime: {
          id: string | undefined;
          title: string;
          thumbnail: string | undefined;
          url: string | undefined;
        }[] = [];

        $('.animposx').each((i, el) => {
          const title = $(el).find('.title h2').text().trim();
          const thumbnail = $(el).find('img').attr('src');
          const url = $(el).find('a').attr('href');
          const id = url ? url.split('/').filter(Boolean).pop() : '';
          anime.push({ id, title, thumbnail, url });
        });

        allAnime.push(...anime);

        const isLastPage =
          anime.length === 0 || (anime.length === limit && currentPage > 1);

        if (isLastPage) {
          hasNextPage = false;
          console.log('Reached last page at page', currentPage);
        } else {
          currentPage++;
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          hasNextPage = false;
          console.log('Reached end of pages at page', currentPage);
        } else {
          throw error;
        }
      }
    }

    return allAnime;
  } catch (error: any) {
    console.error('error in getAnimeByGenre: ', error.message);
    throw new Error('Server Error');
  }
};

export const getFilter = async (
  status: string,
  type: string,
  order: string,
  genre: string[],
) => {
  try {
    let currentPage = 1;
    let hasNextPage = true;
    let allAnime: any[] = [];

    const limit = 600;

    let genreParams = '';
    genre.forEach((genre) => {
      genreParams += `&genre%5B%5D=${encodeURIComponent(genre)}`;
    });

    while (hasNextPage && allAnime.length <= limit) {
      console.log('Fetching page', currentPage);

      const url = `https://samehadaku.now/daftar-anime-2/page/${currentPage}/?title=&status=${status}&type=${type}&order=${order}${genreParams}`;
      console.log('url: ', url);
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const anime: {
          id: string | undefined;
          title: string;
          thumbnail: string | undefined;
          url: string | undefined;
        }[] = [];

        $('.animposx').each((i, el) => {
          const title = $(el).find('.title h2').text().trim();
          const thumbnail = $(el).find('img').attr('src');
          const url = $(el).find('a').attr('href');
          const id = url ? url.split('/').filter(Boolean).pop() : '';
          anime.push({ id, title, thumbnail, url });
        });

        allAnime.push(...anime);

        const isLastPage =
          anime.length === 0 || (anime.length === limit && currentPage > 1);

        if (isLastPage) {
          hasNextPage = false;
          console.log('Reached last page at page', currentPage);
        } else {
          currentPage++;
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          hasNextPage = false;
          console.log('Reached end of pages at page', currentPage);
        } else {
          throw error;
        }
      }
    }

    return allAnime;
  } catch (error: any) {
    console.error('error in getFilter: ', error.message);
    throw new Error('Server Error');
  }
};

export const getAnimeDetail = async (id: string) => {
  try {
    const url = `https://samehadaku.now/anime/${id}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const rawTitle = $('h1.entry-title').text().trim();
    const rtitle = rawTitle.replace('Nonton Anime ', '').trim();
    const title = rtitle.replace('Sub Indo', '').trim();
    const description = $('.entry-content p').text().trim();
    const thumbnail = $('.thumb img').attr('src');

    const episode: any[] = [];
    const episodeElements = $('.epsleft');
    const totalEpisode = episodeElements.length;

    episodeElements.each((i, el) => {
      const title = $(el).find('.lchx').text().trim();
      const url = $(el).find('a').attr('href');
      const release = $(el).find('.date').text().trim();
      const id = url?.split('/').filter(Boolean).pop();
      episode.push({ id, title, release, url });
    });

    return { id, title, description, thumbnail, totalEpisode, episode };
  } catch (error: any) {
    console.error('Error in getAnimeDetail: ', error.message);
    throw new Error('Server error');
  }
};

const CryptoJSAesJsonFormatter = {
  stringify: (cipherParams: any) => {
    const jsonObj: { ct: string; iv?: string; s?: string } = {
      ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
    };
    if (cipherParams.iv) jsonObj.iv = cipherParams.iv.toString();
    if (cipherParams.salt) jsonObj.s = cipherParams.salt.toString();
    return JSON.stringify(jsonObj);
  },
  parse: (jsonStr: string) => {
    const parsed = JSON.parse(jsonStr);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(parsed.ct),
    });
    if (parsed.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(parsed.iv);
    if (parsed.s) cipherParams.salt = CryptoJS.enc.Hex.parse(parsed.s);
    return cipherParams;
  },
};
