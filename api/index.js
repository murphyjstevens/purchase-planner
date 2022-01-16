import cors from 'cors';
import express from 'express';
import http from 'http';
import https from 'https';

import routes from './routes/index.route.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

const port = 3000;
const useHttps = false;

const httpServer = http.createServer(app);
httpServer.listen(port);
console.log(`HTTP listening on port ${port}`);

if (useHttps) {
  const httpsServer = https.createServer(app);
  httpsServer.listen(port + 1);
  console.log(`HTTPS listening on port ${port + 1}`);
}