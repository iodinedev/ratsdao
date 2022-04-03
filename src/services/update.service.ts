import { download, deleteFile } from "../components/images";
import { blockfrost } from "../utils/blockfrost";
import { database } from "../utils/database";

export const updateDatabase = async () => {
  var finalNfts: Nft[] = [];
  var nfts: {
    unit: string,
    quantity: string
  }[] = [];
  var returned = 100;
  var page = 1;

  var downloaded = 0;
  var total = 0;

  while (returned == 100) {
    const rawNfts = await blockfrost.getAllAssets(page);
    nfts.push(...rawNfts);

    returned = rawNfts.length;
    page++;

    returned = 0;
  }

  total = nfts.length;

  const currentNfts = await database.getAllNfts();

  if (currentNfts) {
    for await (const nft of currentNfts) {
      const rawNft = await blockfrost.getAsset(nft.id);

      if (!rawNft || rawNft.status_code == 404) {
        await deleteFile(nft.id);
        await database.removeNft(nft.id);
      }
    }
  }

  for await (const rawNft of nfts) {
    const nft = await blockfrost.getAsset(rawNft.unit);

    if (nft.asset && nft.onchain_metadata && nft.quantity) {
      const id: string = nft.asset;
      const name: string = nft.onchain_metadata.name;
      const imagePath = nft.onchain_metadata.image.split("/");
      const image: string = `https://ipfs.io/ipfs/${imagePath[imagePath.length - 1]}`;
      const tags: string[] = nft.onchain_metadata.tags;
      const quantity: number = isNaN(parseInt(nft.quantity)) ? 0 : parseInt(nft.quantity);
      
      if (await download({ url: image, name: id })) {
        downloaded += 1;

        finalNfts.push({
          id: id,
          name: name,
          tags: tags,
          quantity: quantity
        });
      }
    }
  }

  const updated = await database.addNfts(finalNfts);

  console.log(`Database refreshed. Scraped ${total} assets from the blockchain. Updated ${updated} in local database. Successfully downloaded ${downloaded} images.`)
};
