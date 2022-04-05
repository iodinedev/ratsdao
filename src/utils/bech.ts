import { bech32 } from "bech32";

// input Shelley address
const address = process.env.POOL!;

// decode bech32 shelley address and convert to hex
const addressWords = bech32.decode(address, 1000);
const payload = bech32.fromWords(addressWords.words);
const addressDecoded = `${Buffer.from(payload).toString("hex")}`;
const stakeAddressDecoded =
  "e1" + addressDecoded.substr(addressDecoded.length - 56);
export const stakeAddress = bech32.encode(
  "stake",
  bech32.toWords(Uint8Array.from(Buffer.from(stakeAddressDecoded, "hex"))),
  1000
);
