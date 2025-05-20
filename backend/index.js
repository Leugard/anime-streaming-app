var CryptoJS = require('crypto-js');
var axios = require('axios');

// next step is to just scrap known url from website
const animeId =
  'https://kuronime.vip/nonton-compass-2-0-sentou-setsuri-kaiseki-system-episode-1/';

axios.get(animeId).then((resp) => {
  const re = / var _0xa100d42aa = "(.*)";/m; // server generated episode id??????
  const body = re.exec(resp.data);
  const id = body[1];

  const hex2a = (hexx) => {
    var hex = hexx.toString(); //force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  };

  const CryptoJSAesJson = {
    stringify: function (_0x50a0c4) {
      let _0x43992d = {
        ct: _0x50a0c4.ciphertext.toString(CryptoJS.enc.Base64),
      };
      if (_0x50a0c4.iv) {
        _0x43992d.iv = _0x50a0c4.iv.toString();
      }
      if (_0x50a0c4.salt) {
        _0x43992d.s = _0x50a0c4.salt.toString();
      }
      return JSON.stringify(_0x43992d);
    },
    parse: function (_0x23f5ea) {
      let _0x5feeff = JSON.parse(_0x23f5ea);
      let _0x14210a = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(_0x5feeff.ct),
      });
      if (_0x5feeff.iv) {
        _0x14210a.iv = CryptoJS.enc.Hex.parse(_0x5feeff.iv);
      }
      if (_0x5feeff.s) {
        _0x14210a.salt = CryptoJS.enc.Hex.parse(_0x5feeff.s);
      }
      return _0x14210a;
    },
  };

  const formatter = {
    format: CryptoJSAesJson,
  };

  axios({
    url: 'https://animeku.org/api/v9/sources',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      id: id,
    },
  }).then((resp) => {
    let decryptedMirror = CryptoJS.AES.decrypt(
      atob(resp.data.mirror),
      '3&!Z0M,VIZ;dZW==',
      formatter,
    );

    // your mirror data here
    console.log(
      JSON.stringify(JSON.parse(hex2a(decryptedMirror.toString())), null, 4),
    );
  });
});
