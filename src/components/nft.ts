import { prisma } from "../components/prisma";
import axios from "axios";
import path from "path";

const base = "https://api.nft-maker.io/";

export const getProjects = async () => {
  const url = new URL(path.join("/ListProjects", process.env.TOKEN!), base)
    .href;

  try {
    const response = await axios({
      url: url,
      method: "get",
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getNfts = async (
  projectId: string,
  state: "all" | "free" | "reserved" | "sold" | "error",
  page: string
) => {
  const url = new URL(
    path.join("/GetNfts", process.env.TOKEN!, projectId, state, "25", page),
    base
  ).href;

  try {
    const response = await axios({
      url: url,
      method: "get",
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getNft = async (projectId: string, nftId: string) => {
  const url = new URL(
    path.join("/GetNftDetailsById", process.env.TOKEN!, projectId, nftId),
    base
  ).href;

  try {
    const response = await axios({
      url: url,
      method: "get",
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const addNfts = async (nfts: Nft[]) => {
  try {
    await prisma.nfts.createMany({ data: nfts, skipDuplicates: true });
  } catch (err) {
    console.error(err);
  }
};

export const getDbNfts = async (
  projectId?: string
): Promise<Nft[] | undefined> => {
  try {
    var response;

    if (projectId) {
      response = await prisma.nfts.findMany({
        where: {
          project: projectId,
        },
      });
    } else {
      response = await prisma.nfts.findMany();
    }

    return response;
  } catch (err) {
    console.error(err);
  }
};

export const removeDbNft = async (nftId: number): Promise<void> => {
  try {
    if (!nftId) return;

    await prisma.nfts.delete({ where: { id: nftId } });
  } catch (err) {
    console.error(err);
  }
};

export const getDbNft = async (id: number): Promise<Nft | null> => {
  try {
    const response = await prisma.nfts.findUnique({
      where: {
        id: id,
      },
    });

    return response;
  } catch (err) {
    console.error(err);
  }

  return null;
};

export const getNftAddress = async (
  project: string,
  nft: number,
  price: number
) => {
  const subpath = path.join(
    "/GetAddressForSpecificNftSale",
    process.env.TOKEN!,
    project,
    `${nft}`,
    "1",
    `${price}`
  );
  const url = new URL(subpath, base).href;

  try {
    const response = await axios({
      url: url,
      method: "get",
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};
