import express from 'express';
import path from 'path';
import { Config, Configuraton } from './config';
import { Database } from './database';

// import routes from './routes/index';

const app = express();

Configuraton.init();

const HOST = Configuraton.get<Config['host']>('host');
const PORT = Configuraton.get<Config['port']>('port');

const NODE_ENV = Configuraton.get<Config['nodeEnv']>('nodeEnv');

app.get('/', (req, res) => {
  switch (NODE_ENV) {
    case 'production':
      return res.sendFile(path.resolve('./public/index.html'));
    default:
      return res.send(`Hello from backend`);
  }
});

// app.get('/api', )

Database.createPool(Configuraton.get<Config['database']>('database'));

app.listen(PORT, HOST, () => {
  console.info(`Server started: http://${HOST}:${PORT}`);
});
