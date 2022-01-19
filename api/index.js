import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import https from 'https'

import routes from './routes/index.route.js'

dotenv.config()

const app = express()

app.use(express.json())

const origins = process.env.ALLOWED_ORIGINS.split(',')
const corsOptions = { origin: origins }
app.use(cors(corsOptions))
console.log(`Allowed origins: ${origins.join(', ')}`)
app.use(routes)

const port = process.env.PORT
const useHttps = false

const httpServer = http.createServer(app)
httpServer.listen(port)
console.log(`HTTP listening on port ${port}`)

if (useHttps) {
  const httpsServer = https.createServer(app)
  httpsServer.listen(port + 1)
  console.log(`HTTPS listening on port ${port + 1}`)
}
