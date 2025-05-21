import axios from 'axios';
import * as cheerio from 'cheerio';

export async function extractKrakenFilesId(url: string) {
  const regex = /(?:view|embed-video)\/([\da-zA-Z]+)/i;
  const match = url.match(regex);

  if (!match?.[1]) console.log('Invalid krakenFiles url');
  else return match[1];
}

export async function hexToAscii(hex: string) {
  return (
    hex
      .match(/.{1,2}/g)
      ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join('') || ''
  );
}

export async function CryptoJSAesJsonFormatter() {
  parse: (jsonStr: string) => {
    const parsed = JSON.parse(jsonStr);
    return CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(parsed.ct),
    });
  };
}

export async function fetchHTML(url: any) {
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
    },
  });
  return cheerio.load(data);
}
