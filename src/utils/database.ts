import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export const database = {
  async drop() {
    await prisma.nfts.deleteMany();
    await prisma.projects.deleteMany();
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

  async count(project?): Promise<number> {
    if (project) {
      return await prisma.nfts.count({
        where: {
          projectsId: project,
        },
      });
    }

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

  async getAllNfts(project?, skip = 0, limit = 0): Promise<Nft[] | undefined> {
    try {
      var response;

      if (limit === 0) {
        response = await prisma.nfts.findMany({
          where: {
            projectsId: project,
          },
          skip: skip,
        });
      } else {
        response = await prisma.nfts.findMany({
          where: {
            projectsId: project,
          },
          skip: skip,
          take: limit,
        });
      }

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

  async getProjects(): Promise<Project[] | null> {
    try {
      const response = await prisma.projects.findMany({
        select: {
          id: true,
          name: true,
          nfts: true,
          value: true
        },
      });

      return response;
    } catch (err) {
      return null;
    }
  },

  async getProjectName(id: number): Promise<string | null> {
    try {
      const project = await prisma.projects.findUnique({
        where: {
          id: id,
        },
      });

      if (project) return project.name;

      return null;
    } catch (err) {
      return null;
    }
  },

  async createProjects(policies: { [id: string]: string[] }): Promise<Boolean> {
    const projectNames: { name: string; policyId: string, value: number }[] = [];

    for await (const [key, value] of Object.entries(policies)) {
      var floorPrice = 0;

      try {
        floorPrice = ((await axios.get(`https://api.opencnft.io/1/policy/${key}/floor_price`)).data.floor_price * policies[key].length) / 1000000
      } catch(err) {
        console.log(err)
      }
      

      projectNames.push({ name: await sharedStart(value), policyId: key, value: floorPrice });
    }

    try {
      await prisma.projects.createMany({
        data: projectNames,
        skipDuplicates: true,
      });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async getProjectId(policyId: string): Promise<number | null> {
    try {
      var response = await prisma.projects.findUnique({
        where: {
          policyId: policyId,
        },
      });

      if (!response) return null;

      return response.id;
    } catch (err) {
      return null;
    }
  },
};

async function sharedStart(A: string[]): Promise<string> {
  var sorted = A.concat().sort(),
    a1 = sorted[0],
    a2 = sorted[sorted.length - 1],
    i = 0;
  if (!a1 || !a2) return "";
  var L = a1.length;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  return a1.slice(0, i).split("#")[0].trim();
}
