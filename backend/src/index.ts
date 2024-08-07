import express from 'express';
import path from 'path';
import cors from 'cors';
import { Config, Configuraton } from './config';
import { Database } from './database';
import { initControllers } from './routes';

const app = express();

app.use(express.json());
app.use(cors());

Configuraton.init();

const HOST = Configuraton.get<Config['host']>('host');
const PORT = Configuraton.get<Config['port']>('port');

const NODE_ENV = Configuraton.get<Config['nodeEnv']>('nodeEnv');

Database.createPool(Configuraton.get<Config['database']>('database')).then(
  result => {
    app.get('/', (req, res) => {
      switch (NODE_ENV) {
        case 'production':
          return res.sendFile(path.resolve('./public/index.html'));
        default:
          return res.send(`Hello from backend`);
      }
    });

    initControllers(app);

    app.listen(PORT, HOST, () => {
      console.info(`Server started: http://${HOST}:${PORT}`);
    });
  },
);
