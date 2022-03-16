import { download, deleteFile } from "../components/images";
import {
  getProjects,
  getNfts,
  addNfts,
  getDbNfts,
  getNft,
  removeDbNft,
} from "../components/nft";

export const updateDatabase = async () => {
  const projects = await getProjects();
  var photographynfts: any[] = [];
  var writingnfts: any[] = [];
  var nfts: Nft[] = [];

  const currentNfts = await getDbNfts();

  if (currentNfts) {
    for await (const nft of currentNfts) {
      const rawNft = await getNft(nft.project, `${nft.id}`);

      if (!rawNft || rawNft.state !== "free") {
        await deleteFile(nft.id);
        await removeDbNft(nft.id);
      }
    }
  }

  for await (const project of projects) {
    if (project.id === parseInt(process.env.PHOTOGRAPHY!)) {
      const photography = await getNfts(`${project.id}`, "free", "1");
      photographynfts = photographynfts.concat(photography);
    }

    if (project.id === parseInt(process.env.POETRY!)) {
      writingnfts = writingnfts.concat(
        await getNfts(`${project.id}`, "free", "1")
      );
    }
  }

  for await (const nft of photographynfts) {
    await download({ url: nft.gatewayLink, name: `${nft.id}` });

    nfts.push({
      id: nft.id,
      name: nft.displayname,
      details: nft.detaildata,
      project: process.env.PHOTOGRAPHY!,
      status: nft.state,
      imagePath: `./images/${nft.id}.jpg`,
      tokenamount: nft.tokenamount ? nft.tokenamount : 0,
      price: nft.price ? nft.price : 0,
      selldate: nft.selldate ? nft.selldate : 0,
    });
  }

  for await (const nft of writingnfts) {
    await download({ url: nft.gatewayLink, name: `${nft.id}` });

    nfts.push({
      id: nft.id,
      name: nft.displayname,
      details: nft.detaildata,
      project: process.env.POETRY!,
      status: nft.state,
      imagePath: `./images/${nft.id}.jpg`,
      tokenamount: nft.tokenamount ? nft.tokenamount : 0,
      price: nft.price ? nft.price : 0,
      selldate: nft.selldate ? nft.selldate : 0,
    });
  }

  await addNfts(nfts);
};
