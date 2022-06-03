import axios from "axios";
import { stakeAddress } from "./bech";

const baseUrl = "https://cardano-mainnet.blockfrost.io/api/v0";

export const blockfrost = {
  async getAllAssets(pool, page = 1) {
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
};
