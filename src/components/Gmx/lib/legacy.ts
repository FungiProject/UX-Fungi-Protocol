import { expandDecimals } from "./numbers";


export const USD_DECIMALS = 30;
export const PRECISION = expandDecimals(1, 30);
export const DUST_BNB = "2000000000000000";



export function importImage(name) {
    let tokenImage = "";
  
    try {
      tokenImage = require("src/img/" + name); //TODO fungi
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  
    return tokenImage;
  }