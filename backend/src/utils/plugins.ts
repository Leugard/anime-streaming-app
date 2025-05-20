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
