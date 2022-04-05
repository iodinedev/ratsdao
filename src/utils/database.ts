import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const database = {
  async drop() {
    await prisma.nfts.deleteMany();
  },
  async addNfts(nfts: Nft[]) {
    try {
      const updated = await prisma.nfts.createMany({
        data: nfts,
        skipDuplicates: true,
      });
      return updated.count;
    } catch (err) {
      console.error(err);
    }
  },

  async count(): Promise<number> {
    return await prisma.nfts.count();
  },

  async pickRandom(count: number): Promise<Nft[]> {
    const itemCount = await prisma.nfts.count();
    const skip = Math.max(0, Math.floor(Math.random() * itemCount) - count);
    const orderBy = ["id", "name", "quantity"][Math.floor(Math.random() * 3)];
    const orderDir = ["asc", "desc"][Math.floor(Math.random() * 2)];

    return prisma.nfts.findMany({
      take: count,
      skip: skip,
      orderBy: { [orderBy]: orderDir },
    });
  },

  async getAllNfts(skip = 0, limit = 0): Promise<Nft[] | undefined> {
    try {
      var response;

      if (limit === 0) response = await prisma.nfts.findMany({ skip: skip });
      else response = await prisma.nfts.findMany({ skip: skip, take: limit });

      return response;
    } catch (err) {
      console.error(err);
    }
  },

  async removeNft(nftId: string): Promise<void> {
    try {
      if (!nftId) return;

      await prisma.nfts.delete({ where: { id: nftId } });
    } catch (err) {
      console.error(err);
    }
  },

  async getNft(id: string): Promise<Nft | null> {
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
  },
};
