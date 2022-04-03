import 'dotenv/config'
import { koa } from './components/router'
import { updateDatabase } from "./services/update.service"

const port = parseInt(process.env.HTTP_PORT!) || 3000
koa.listen(port, process.env.HTTP_HOST)

for (let route of ['static-pages']) {
	require('./routes/' + route)?.init?.()
}

const refresh = parseInt(process.env.REFRESH!) * 60 * 1000;

(async () => {    
  await updateDatabase();
  
  /*setInterval(
    updateDatabase,
    refresh
  )*/
})();