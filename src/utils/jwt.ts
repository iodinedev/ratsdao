import util from "util";

const jwtVerify = util.promisify(require("jsonwebtoken").verify);
const jwtSign = util.promisify(require("jsonwebtoken").sign);

export interface AuthToken {
  userId: string;
}

export async function encode(data: any, expiresIn = "24h"): Promise<string> {
  return await jwtSign(data, process.env.JWT_TOKEN, {
    expiresIn,
  });
}

export async function decode<T = any>(data: string): Promise<T | null> {
  try {
    const payload = await jwtVerify(data, process.env.JWT_TOKEN);
    return payload;
  } catch (e) {
    return null;
  }
}
