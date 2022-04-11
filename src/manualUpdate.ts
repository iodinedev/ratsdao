import 'dotenv/config'
import { updateDatabase } from "./services/update.service"

(async () => {
  const data = await updateDatabase();
  if (data)
    console.log(
      `Database refreshed. Scraped ${data.total} assets from the blockchain. Updated ${data.updated} in local database. Successfully downloaded ${data.downloaded} images.`
    );
})();