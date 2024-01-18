import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
const aesKey = window.location.origin + navigator.userAgent;

export const encoder = {
  encode: (str: string) => {
    if (!str) return str;

    return AES.encrypt(str, aesKey).toString().substring(10);
  },
  decode: (str: string) => {
    if (!str) return str;

    return AES.decrypt("U2FsdGVkX1" + str, aesKey).toString(Utf8);
  },
};
