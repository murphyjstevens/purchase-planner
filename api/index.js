import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import https from 'https'

import routes from './routes/index.route.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(routes)

dotenv.config()

const port = process.env.PORT
const useHttps = false

console.log(process.env.PGUSER)

const httpServer = http.createServer(app)
httpServer.listen(port)
console.log(`HTTP listening on port ${port}`)

if (useHttps) {
  const httpsServer = https.createServer(app)
  httpsServer.listen(port + 1)
  console.log(`HTTPS listening on port ${port + 1}`)
}
