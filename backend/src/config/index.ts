import { config } from 'dotenv';
import { ConfigKeyError, EnvFileParseError } from '@/errors';

const required = ['DB_NAME', 'DB_PASSWORD', 'DB_USERNAME'];

export interface Config {
  host: string;
  port: number;
  nodeEnv: 'production' | 'development';
  database: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
}

export class Configuraton {
  private static config: Record<string, any> = {};
  private static inited = false;
  private constructor() {}

  static init(envPath?: string) {
    if (Configuraton.inited) return Configuraton.config;

    config({
      path: envPath ?? undefined,
    });

    Configuraton.checkEnvConfig(process.env);

    Configuraton.config.host = process.env.HOST ?? 'localhost';
    Configuraton.config.port = process.env.PORT
      ? Number(process.env.PORT)
      : 3030;
    Configuraton.config.nodeEnv = process.env.NODE_ENV ?? 'development';

    const database = {
      host: process.env.DB_HOST ?? 'localhost',
      port: process.env.DB_PORT ?? 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    };

    Configuraton.config.database = database;

    Configuraton.inited = true;

    return Configuraton.config;
  }

  static get<T>(key: string): T {
    if (Object.prototype.hasOwnProperty.call(Configuraton.config, key))
      return Configuraton.config[key];

    throw new ConfigKeyError(key);
  }
  /**
   * @description Проверка заданных переменных окружения на отсутствие обязательных переменных
   * @param env список переменных окружения, получаемый из process.env
   */
  private static checkEnvConfig(env: NodeJS.ProcessEnv) {
    const missingFields = required.filter(req => !env[req]);

    if (missingFields.length) throw new EnvFileParseError(missingFields);
  }
}
