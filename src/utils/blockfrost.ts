import axios from "axios";
import { stakeAddress } from "./bech";

const baseUrl = "https://cardano-mainnet.blockfrost.io/api/v0";

export const blockfrost = {
  async getInfo(address) {
    const url = baseUrl + `/addresses/${address}`
    return await axios.get(url, {
      headers: {
        project_id: process.env.BLOCKFROST!
      }
    })
    .then((d) => {
      return d.data
    })
    .catch((resp) => {
      console.log(resp)
      if (resp.response.status === 404) console.log(address)
      return
    })
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
