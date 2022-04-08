import 'dotenv/config'
import { updateDatabase } from "./services/update.service"

(async () => {
  await updateDatabase();
})();