import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";
import axios from "axios";
import path from "path";
import { stakeAddress } from "./bech";

const baseUrl = "https://cardano-mainnet.blockfrost.io/api/v0";

export const blockfrost = {
  async getAllAssets(page = 1) {
    const url =
      baseUrl + `/accounts/${stakeAddress}/addresses/assets?page=${page}`;
    return await axios
      .get(url, {
        headers: {
          project_id: process.env.BLOCKFROST!,
        },
      })
      .then((d) => {
        return d.data;
      })
      .catch((resp) => {
        return resp.response.data;
      });
  },

  async getAsset(asset: string) {
    const url = baseUrl + `/assets/${asset}`;
    return await axios
      .get(url, {
        headers: {
          project_id: process.env.BLOCKFROST!,
        },
      })
      .then((d) => {
        return d.data;
      })
      .catch((resp) => {
        return resp.response.data;
      });
  },

  async getProjectName(policy_id: string): Promise<string | null> {
    const url = baseUrl + `/assets/policy/${policy_id}`;
    return await axios
      .get(url, { headers: { project_id: process.env.BLOCKFROST! } })
      .then(async (d) => {
        const name = await sharedStart(d.data);
        return name;
      })
      .catch((resp) => {
        return null;
      });
  },
};

async function sharedStart(
  array: { asset: string; quantity: string }[]
): Promise<string> {
  const nameArray: string[] = [];

  for await (const nft of array) {
    const raw = await blockfrost.getAsset(nft.asset);
    if (raw && raw.onchain_metadata && raw.onchain_metadata.name) {
      nameArray.push(raw.onchain_metadata.name);
    }
  }
  var sorted = nameArray.concat().sort(),
    a1 = sorted[0],
    a2 = sorted[sorted.length - 1],
    i = 0;
  if (!a1 || !a2) return "";
  var L = a1.length;
  console.log(`A1: ${a1}\nA2: ${a2}`);
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  return a1.slice(0, i).split("#")[0].trim();
}
