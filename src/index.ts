import 'dotenv/config'
import { koa } from './components/router'
import { updateDatabase } from "./services/update.service"

const port = parseInt(process.env.HTTP_PORT!) || 3000
koa.listen(port, process.env.HTTP_HOST)

for (let route of ['static-pages']) {
  console.log(`Adding ${route}`)
	require('./routes/' + route)?.init?.()
}

console.log(`Running on port ${port}.`)

const refresh = parseInt(process.env.REFRESH!) * 60 * 60 * 1000;

(async () => {
  setInterval(
    updateDatabase,
    refresh
  )
})();