import { Pool } from 'pg';

import { Models } from './models';

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

  static async createPool(params: CreatePoolInterface): Promise<Pool> {
    if (!Database.pool) {
      Database.pool = new Pool({
        user: params.user,
        password: params.password,
        host: params.host,
        port: params.port ?? 5432,
        database: params.database,
      });

      // Инициализируем констукторы моделей, передавая им инстанс пулла базы данных
      const modelsInstaces = Object.values(Models).map(
        model => new model(Database.pool),
      );

      // Вызываем инициализацию баз данных для каждой модели
      await Promise.all(
        modelsInstaces.map(modelInstance => modelInstance.initModel()),
      )
        .then(result => {
          console.log('Init models success');
        })
        .catch(error => {
          console.error('Init models errors');
          console.error(error);
        });
    }

    return Database.pool;
  }
}
