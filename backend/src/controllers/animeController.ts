import axios from 'axios';
import * as cheerio from 'cheerio';
import CryptoJS from 'crypto-js';
import {
  extractDoodStream,
  extractKrakenFiles,
  extractMp4Upload,
} from '../utils/extractor';

export const getFilter = async (
  page: string,
  type: string = '',
  order: string = '',
  status: string = '',
  genre: string[] = [],
) => {
  try {
    let genreParams = '';
    genre.forEach((genre) => {
      genreParams += `&genre%5B%5D=${encodeURIComponent(genre)}`;
    });

    const url = `https://kuronime.vip/anime/page/${page}/?title=&status=${status}&type=${type}&order=${order}${genreParams}`;
    console.log('url: ', url);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const anime: {
      id: string | undefined;
      title: string;
      thumbnail: string | undefined;
      url: string | undefined;
    }[] = [];
    const animePromises = $('.bsx').map(async (i, el) => {
      const title = $(el).find('.tt h4').text().trim();
      const thumbnail = $(el)
        .find('.limit > img')
        .not('div.play img')
        .attr('data-src');
      const url = $(el).find('a').attr('href');
      const id = url ? url.split('/').filter(Boolean).pop() : '';

      const genres: string[] = [];
      let rating: string = '';
      if (url) {
        try {
          const { data } = await axios.get(url);
          const $ = cheerio.load(data);
          $('.infodetail')
            .find('a[href*="/genres/"]')
            .each((i, el) => {
              const genre = $(el).text().trim();
              if (genre) genres.push(genre);
            });

          const rawRating = $('.rating strong').text().trim();
          rating = rawRating.replace('Rating ', '').trim();
        } catch (error) {
          console.error(`Failed to fetch genre for ${title}:`, error);
        }
      }

      return { id, title, thumbnail, genres, rating, url };
    });

    const animeResults = await Promise.all(animePromises);
    anime.push(...animeResults);

    return anime;
  } catch (error: any) {
    console.error('error in getFilter: ', error.message);
    throw new Error('Server Error');
  }
};

const test = async (
  status: string,
  type: string,
  order: string,
  genre: string[] = [],
  page: string,
) => {
  try {
    let currentPage = 1;
    let hasNextPage = true;
    let allAnime: any[] = [];

    const limit = 50;

    let genreParams = '';
    genre.forEach((genre) => {
      genreParams += `&genre%5B%5D=${encodeURIComponent(genre)}`;
    });

    while (hasNextPage && allAnime.length <= limit) {
      console.log('Fetching page', currentPage);

      const url = `https://kuronime.vip/anime/page/${page}/?title=&status=${status}&type=${type}&order=${order}${genreParams}`;
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

        $('.bsx').each((i, el) => {
          const title = $(el).find('.tt h4').text().trim();
          const thumbnail = $(el)
            .find('.limit > img')
            .not('div.play img')
            .attr('data-src');
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
    const url = `https://kuronime.vip/anime/${id}`;
    console.log(url);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('.entry-title').text().trim();
    const description = $('.const p').text().trim();
    const rawRating = $('.rating strong').text().trim();
    const rating = rawRating.replace('Rating ', '').trim();
    const thumbnail = $('.con .l img').attr('data-src');

    const genres: string[] = [];
    let episode: any[] = [];
    const episodeElements = $('.bixbox ul li');
    const totalEpisode = episodeElements.length;

    $('.infodetail')
      .find('a[href*="/genres/"]')
      .each((i, el) => {
        const genre = $(el).text().trim();
        if (genre) genres.push(genre);
      });

    episodeElements.each((i, el) => {
      const title = $(el).find('.lchx').text().trim();
      const url = $(el).find('a').attr('href');
      const id = url?.split('/').filter(Boolean).pop();
      episode.push({ id, title, url });
    });

    episode = episode.reverse();

    return {
      id,
      title,
      rating,
      genres,
      description,
      thumbnail,
      totalEpisode,
      episode,
    };
  } catch (error: any) {
    console.error('Error in getAnimeDetail: ', error.message);
    throw new Error('Server error');
  }
};

export const getSearch = async (id: string) => {
  try {
    let currentPage = 1;
    let hasNextPage = true;

    const url = `https://kuronime.vip/?s=${id}`;
    console.log('url: ', url);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const anime: {
      id: string | undefined;
      title: string;
      thumbnail: string | undefined;
      url: string | undefined;
    }[] = [];

    $('.bsx').each((i, el) => {
      const title = $(el).find('.tt h4').text().trim();
      const thumbnail = $(el)
        .find('.limit > img')
        .not('div.play img')
        .attr('data-src');
      const url = $(el).find('a').attr('href');
      const id = url ? url.split('/').filter(Boolean).pop() : '';
      anime.push({ id, title, thumbnail, url });
    });

    return anime;
  } catch (error: any) {
    console.error('error in getFilter: ', error.message);
    throw new Error('Server Error');
  }
};

export const getEpisodeUrl = async (anime: string) => {
  try {
    const animeUrl = `https://kuronime.vip/${anime}`;

    const response = await axios.get(animeUrl);

    const re = / var _0xa100d42aa = "(.*)";/m;
    const body = re.exec(response.data);
    if (!body || !body[1]) throw new Error('ID extraction failed');
    const id = body[1];

    const hex2a = (hexx: any) => {
      const hex = hexx.toString();
      let str = '';
      for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    };

    const CryptoJSAesJson = {
      stringify: (cipherParams: any) => {
        const jsonObj: any = {
          ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
        };
        if (cipherParams.iv) jsonObj.iv = cipherParams.iv.toString();
        if (cipherParams.salt) jsonObj.s = cipherParams.salt.toString();
        return JSON.stringify(jsonObj);
      },
      parse: (jsonStr: string) => {
        const jsonObj = JSON.parse(jsonStr);
        const cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct),
        });
        if (jsonObj.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
        if (jsonObj.s) cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
        return cipherParams;
      },
    };

    const postResponse = await axios({
      url: 'https://animeku.org/api/v9/sources',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { id: id },
    });

    const decrypted = CryptoJS.AES.decrypt(
      atob(postResponse.data.mirror),
      '3&!Z0M,VIZ;dZW==',
      { format: CryptoJSAesJson },
    );

    const decryption = hex2a(decrypted.toString());
    const decryptedData = JSON.parse(hex2a(decrypted.toString()));
    console.log(decryptedData);

    let krakenUrls: any[] = [];
    let doodstreamUrls: any[] = [];
    let mp4UploadUrls: any[] = [];

    // if (decryption.includes('krakenfiles.com')) {
    //   const embedSection = decryptedData.embed;

    //   for (const qualityKey of Object.keys(embedSection)) {
    //     const quality = embedSection[qualityKey];
    //     if (quality.krakenfiles && typeof quality.krakenfiles === 'string') {
    //       krakenUrls.push({ quality: qualityKey, url: quality.krakenfiles });
    //     }
    //   }

    //   const extractedUrl = krakenUrls.map(async (url) => {
    //     const directUrl = await extractKrakenFiles(url.url);
    //     return { quality: url.quality, url: directUrl };
    //   });

    //   krakenUrls = await Promise.all(extractedUrl);
    // }

    // if (decryption.includes('do7go.com')) {
    //   const embedSection = decryptedData.embed;

    //   for (const qualityKey of Object.keys(embedSection)) {
    //     const quality = embedSection[qualityKey];
    //     if (quality.doodstream && typeof quality.doodstream === 'string') {
    //       doodstreamUrls.push({ quality: qualityKey, url: quality.doodstream });
    //     }
    //   }

    //   const extractedUrl = doodstreamUrls.map(async (url) => {
    //     const directUrl = await extractDoodStream(url.url);
    //     console.log(directUrl);
    //     return { quality: url.quality, url: directUrl };
    //   });

    //   doodstreamUrls = await Promise.all(extractedUrl);
    // }

    if (decryption.includes('mp4upload.com')) {
      const embedSection = decryptedData.embed;

      for (const qualityKey of Object.keys(embedSection)) {
        const quality = embedSection[qualityKey];
        if (quality.mp4upload && typeof quality.mp4upload === 'string') {
          mp4UploadUrls.push({ quality: qualityKey, url: quality.mp4upload });
        }
      }

      const extractedUrl = mp4UploadUrls.map(async (url) => {
        const directUrl = await extractMp4Upload(url.url);
        console.log(directUrl);
        return { quality: url.quality, url: directUrl };
      });

      mp4UploadUrls = await Promise.all(extractedUrl);
    }

    return {
      // krakenfiles: krakenUrls,
      // doodstream: doodstreamUrls,
      mp4upload: mp4UploadUrls,
    };
  } catch (error) {
    console.error('error in getEpisode: ', error);
  }
};
