import { download, deleteFile, checkValid } from "../components/images";
import { blockfrost } from "../utils/blockfrost";
import { database } from "../utils/database";

export const updateDatabase = async () => {
  var finalNfts: Nft[] = [];
  var nfts: {
    unit: string;
    quantity: string;
  }[] = [];
  var returned = 100;
  var page = 1;
  var projects: {} = {};
  var assets: any[] = [];

  var downloaded = 0;
  var total = 0;

  while (returned == 100) {
    const rawNfts = await blockfrost.getAllAssets(page);
    if (rawNfts && rawNfts.status_code && rawNfts.status_code === 402)
      return console.log("Usage limit reached.");

    nfts = nfts.concat(rawNfts);

    returned = rawNfts.length;
    page++;
  }

  total = nfts.length;

  for await (const rawNft of nfts) {
    const nft = await blockfrost.getAsset(rawNft.unit);

    assets.push(nft);

    if (nft && nft.policy_id && nft.onchain_metadata) {
      const name: string = nft.onchain_metadata.name;

      if (!projects[nft.policy_id]) projects[nft.policy_id] = [];

      projects[nft.policy_id].push(name);
    }
  }
  
  const currentNfts = await database.getAllNfts();

  if (currentNfts) {
    for await (const nft of assets) {
      if (!nft.id || nft.status_code == 404 || !checkValid(nft.id)) {
        await deleteFile(nft.id);
        await database.removeNft(nft.id);
      }
    }
  }

  await database.createProjects(projects);

  for await (const nft of assets) {
    if (nft.asset && nft.onchain_metadata && nft.onchain_metadata.image && nft.quantity) {
      const id: string = nft.asset;
      const name: string = nft.onchain_metadata.name;
      const imagePath = nft.onchain_metadata.image.split("/");
      const image: string = `https://infura-ipfs.io/ipfs/${
        imagePath[imagePath.length - 1]
      }`;
      const fingerprint = nft.fingerprint;
      const tags: string[] = nft.onchain_metadata.tags;
      const quantity: number = isNaN(parseInt(nft.quantity))
        ? 0
        : parseInt(nft.quantity);
      var projectId = await database.getProjectId(nft.policy_id);

      if (projectId) {
        try {
          await download({url: image, name: id});

          downloaded++;
        } catch(err) {
          console.log(err);
        }

        finalNfts.push({
          id: id,
          name: name,
          tags: tags,
          quantity: quantity,
          projectsId: projectId,
          fingerprint: fingerprint,
          url: image,
        });
      }
    }
  }
  
  const updated = await database.addNfts(finalNfts);

  return {total: total, updated: updated, downloaded: downloaded};
};
