import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const database = {
  async drop() {
    await prisma.nfts.deleteMany();
  },
  async addNfts(nfts: Nft[]) {
    try {
      const updated = await prisma.nfts.createMany({ data: nfts, skipDuplicates: true });
      return updated.count;
    } catch (err) {
      console.error(err);
    }
  },

  async getAllNfts(limit = 0): Promise<Nft[] | undefined> {
    try {
      var response;

      if (limit === 0)
        response = await prisma.nfts.findMany();
      else
        response = await prisma.nfts.findMany({take: limit});

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
  }
}