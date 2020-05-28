import http from 'http';
import { origin, port } from './env';
import { useGraphQL } from './graphql';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';

export const app = express();
const server = http.createServer(app);

app.use(cors({ credentials: true, origin }));
app.use(express.json());
app.use(cookieParser());

app.get('/_ping', (req, res) => {
  res.send('pong');
});

useGraphQL({ app, server });

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
