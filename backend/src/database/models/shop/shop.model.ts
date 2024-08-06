import { Pool, QueryResult } from 'pg';
import { Model } from '../model.interface';
import { CreateShopDto } from '@dto/shop.dto';

export const TableName = 'shops';

export interface ShopModelInterface {
  id: number;
  name: string;
}

export class ShopModel implements Model {
  private static Instance: ShopModel;

  constructor(private readonly db: Pool) {
    ShopModel.Instance = this;
  }

  static getInstance() {
    return ShopModel.Instance;
  }

  async initModel() {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS ${TableName}
      (
        id      SERIAL,
        name    VARCHAR(40) UNIQUE NOT NULL,
        PRIMARY KEY(id)
      );
    `);

    console.log(`init table: ${TableName} success`);
  }

  /**
   * @description создание нового магазина
   */
  async create(createShopDto: CreateShopDto) {
    await this.db.query(
      `INSERT INTO ${TableName} (name) VALUES ('${createShopDto.name}')`,
    );
    const shop = await this.findOne({ name: createShopDto.name });
    return this.findById(shop.id);
  }

  /**
   * @description получение информации о магазине по его идентификатору
   */
  private async findById(id: number) {
    const shop = await this.db.query(`
      SELECT *  
      FROM ${TableName} 
      WHERE id = '${id}'`);

    return shopMapper(shop)[0];
  }
  /**
   * @description получение информации об одном магазине...
   */
  private async findOne(query: { name: string }) {
    const result = await this.db.query(
      `SELECT * FROM ${TableName} WHERE name = '${query.name}'`,
    );

    return shopMapper(result)[0];
  }

  /**
   * @description получение списка магазинов для таблицы магазинов
   * TODO: пока без фильтрации, если успею, добавлю
   */
  async findAll(query?: {}) {
    const shops = await this.db.query(`SELECT * FROM ${TableName}`);

    return shopMapper(shops);
  }

  async delete(id: number) {
    const deleted = await this.db.query(
      `DELETE FROM ${TableName} WHERE id = ${id}`,
    );

    console.log(deleted);
  }
}

function shopMapper(results: QueryResult<ShopModelInterface>) {
  return results.rows.map(result => ({
    id: result.id,
    name: result.name,
  }));
}
