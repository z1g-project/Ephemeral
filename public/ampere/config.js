"use strict";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

export const aes = {
  encode: (value) => {
    return encodeURIComponent(
      AES.encrypt(value, location.origin + navigator.userAgent)
        .toString()
        .substring(10)
    );
  },
  decode: (value) => {
    return AES.decrypt(
      "U2FsdGVkX1" + decodeURIComponent(value),
      location.origin + navigator.userAgent
    ).toString(Utf8);
  }
};

(()=>{
    var n=(e=>(e[e.None=0]="None",e[e.Error=1]="Error",e[e.Warn=2]="Warn",e[e.Info=3]="Info",e[e.Debug=4]="Debug",e))(n||{}),i={
        prefix:"/~/light",
        server:"http://localhost:8080/bare/",
        logLevel:4,
        codec:AES,
        files:{
            directory:"/ampere/",
            config:"config.js",
            client:"client.js",
            worker:"worker.js",
            bundle:"bundle.js"
        },
        plugins:[]
    };Object.defineProperty(Object.prototype,"__$ampere",{value:Object.assign(globalThis.__$ampere||{},{config:i}),configurable:!1,enumerable:!1});})();
