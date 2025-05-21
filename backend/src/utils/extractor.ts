import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

export async function extractKrakenFiles(url: string) {
  try {
    const embedUrl = url.startsWith('http') ? url : `https://embed-video${url}`;

    const response = await axios.get(embedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://krakenfiles.com/',
      },
    });

    const $ = cheerio.load(response.data);

    const videoUrl = $('source').attr('src');
    console.log(videoUrl);

    return videoUrl;
  } catch (error: any) {
    console.error('error in kraken: ', error.message);
    return null;
  }
}

export async function extractMp4Upload(url: string) {
  try {
    const headers = {
      Referer: 'https://www.mp4upload.com/',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    };

    const response = await axios.get(url, { headers });

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch embed page (Status: ${response.status})`,
      );
    }

    const regex = /player\.src\(\{\s*type:\s*"[^"]+",\s*src:\s*"([^"]+)"/;
    const match = response.data.match(regex);

    if (!match || !match[1]) {
      throw new Error('Direct video URL not found in page source');
    }

    const directUrl = match[1];

    if (
      !directUrl.match(
        /^https?:\/\/a\d\.mp4upload\.com:\d+\/d\/[a-z0-9]+\/video\.mp4$/,
      )
    ) {
      throw new Error('Invalid URL format detected');
    }

    return directUrl;
  } catch (error: any) {
    console.error('error in doodstream: ', error.message);
    return null;
  }
}

const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export async function extractDoodStream(url: string) {
  try {
    const embedUrl = url.replace('/d/', '/e/');
    const response = await axios.get(embedUrl);
    const $ = cheerio.load(response.data);

    const host = getBaseUrl(response.request.res.responseUrl || url);

    const scripts = $('script').toString();
    const md5Match: any = scripts.match(/\/pass_md5\/[^']*/);

    const md5Path = md5Match[0];
    const md5Url = host + md5Path;

    const md5Response = await axios.get(md5Url, {
      headers: { Referer: embedUrl },
    });

    const hashTable = createHashTable();
    const token = md5Path.split('/').pop() || '';
    const trueUrl = `${md5Response.data}${hashTable}?token=${token}`;

    return trueUrl;
  } catch (error: any) {
    console.error('error in mp4upload: ', error.message);
    return null;
  }
}

function createHashTable(): string {
  return Array.from(
    { length: 10 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join('');
}

function getBaseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch (e) {
    return url;
  }
}
