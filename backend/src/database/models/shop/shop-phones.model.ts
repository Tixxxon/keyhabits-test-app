import { Pool, QueryResult } from 'pg';
import { Model } from '../model.interface';
import { TableName as PhoneTableName } from './phones.model';
import { TableName as ShopTableName } from './shop.model';

export const TableName = 'shop_phones';

export interface ShopPhonesModelInterface {
  phone_id: number;
  shop_id: number;
}

export class ShopPhonesModel implements Model {
  private static Instance: ShopPhonesModel;
  constructor(private readonly db: Pool) {
    ShopPhonesModel.Instance = this;
  }

  static getTableName() {
    return TableName;
  }

  static getInstance() {
    return ShopPhonesModel.Instance;
  }

  async initModel() {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS ${TableName}
      (
        id        SERIAL,       
        shop_id   INT NOT NULL,
        phone_id  INT NOT NULL,
        PRIMARY KEY(shop_id, phone_id)
      );
    `);

    console.log(`init table: ${TableName} success`);
  }

  async create(createShopPhoneDto: { shopId: number; phoneIds: number[] }) {
    if (createShopPhoneDto.phoneIds.length) {
      const insertQuery = createShopPhoneDto.phoneIds.map(
        phoneId => `(${createShopPhoneDto.shopId}, ${phoneId})`,
      );
      await this.db.query(
        `INSERT INTO ${TableName} (shop_id, phone_id) VALUES ${insertQuery.join(',')}`,
      );
    }

    // return this.findOne({ name: createShopDto.name });
  }

  /**
   * @description получение всех номером телефонов для магазина
   */
  async findShopPhones(shopId: number) {
    const result = await this.db.query(
      `SELECT shop_id, number FROM ${TableName} JOIN ${PhoneTableName} ON ${TableName}.phone_id = ${PhoneTableName}.id WHERE shop_id = '${shopId}'`,
    );

    return result.rows.map(result => result.number);
  }

  /**
   * @description поиск телефонов по id магазинов
   
   */
  async findShopsPhones(shopIds: number[]) {
    const result = await this.db.query(`
      SELECT shop_id, number FROM ${TableName} JOIN ${PhoneTableName} ON ${TableName}.phone_id = ${PhoneTableName}.id WHERE shop_id IN (${shopIds.join(', ')})`);

    const shopPhones: Record<number, string[]> = {};

    result.rows.forEach(phone => {
      if (!Object.prototype.hasOwnProperty.call(shopPhones, phone.shop_id))
        shopPhones[phone.shop_id] = [];

      shopPhones[phone.shop_id].push(phone.number);
    });

    return shopPhones;
  }

  async delete(query: { shopId: number; phoneId: number }) {
    const deleted = await this.db.query(
      `DELETE FROM ${TableName} WHERE shop_id = ${query.shopId} AND phone_id = ${query.phoneId}`,
    );

    console.log(deleted);
  }
}
