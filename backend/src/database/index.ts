import { Pool, PoolClient } from 'pg';

export interface CreatePoolInterface {
  user: string;
  password: string;
  database: string;
  host?: string;
  port?: number;
}

export class Database {
  private static pool: Pool;

  private constructor() {}

  static createPool(params: CreatePoolInterface): Promise<PoolClient> {
    if (!Database.pool) {
      Database.pool = new Pool({
        user: params.user,
        password: params.password,
        host: params.host,
        port: params.port ?? 5432,
        database: params.database,
      });
    }

    return Database.pool.connect();
  }
}
