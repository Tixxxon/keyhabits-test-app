import { Pool, QueryResult } from 'pg';
import { Model } from '../model.interface';
import { CreateShopDto } from '@dto/shop.dto';
import { ShopPhonesModel } from './shop-phones.model';
import { PhoneModel } from './phones.model';
import { ShopCarsModel } from './shop-cars.model';

export const TableName = 'shops';

export interface ShopModelInterface {
  id: number;
  name: string;
}

export class ShopModel implements Model {
  private static Instance: ShopModel;
  private shopPhoneRepository!: ShopPhonesModel;
  private phoneRepository!: PhoneModel;
  private shopCarRepository!: ShopCarsModel;

  constructor(private readonly db: Pool) {
    this.shopPhoneRepository = ShopPhonesModel.getInstance();
    this.phoneRepository = PhoneModel.getInstance();

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
   * @description создание нового магазина, глобальный метод, сразу привязывающий и автомобили и телефоны к магазину
   */
  async create(createShopDto: CreateShopDto) {
    await this.db.query(
      `INSERT INTO ${TableName} (name) VALUES ('${createShopDto.name}')`,
    );
    const shop = await this.findOne({ name: createShopDto.name });

    await Promise.all([
      // Привязка телефонов к магазину
      this.bindPhonesToShop(shop.id, createShopDto.phones),
      // Привязка автомобилей к магазину
      this.bindCarsToShop(shop.id, createShopDto.cars),
    ]);

    return this.findById(shop.id);
  }

  /**
   * @description привязывание телефонов к магазину при создании
   */
  private async bindPhonesToShop(shopId: number, phoneNumbers: string[]) {
    if (!phoneNumbers.length) return;
    const phones = await this.phoneRepository.create({
      phones: phoneNumbers,
    });

    await this.shopPhoneRepository.create({
      shopId: shopId,
      phoneIds: phones.map(phone => phone.id),
    });
  }

  /**
   * @description привязывание автомобилей к магазину при создании
   */
  private async bindCarsToShop(shopId: number, cars: number[]) {
    if (!cars.length) return;

    await this.shopCarRepository.create({
      shopId: shopId,
      carIds: cars,
    });
  }

  /**
   * @description получение информации о магазине по его идентификатору
   */
  private async findById(id: number) {
    const [shop, phones, cars] = await Promise.all([
      this.db.query(`
      SELECT *,  
      FROM ${TableName} 
      WHERE id = '${id}'`),
      this.shopPhoneRepository.findShopPhones(id),
      this.shopCarRepository.findShopCars(id),
    ]);

    return {
      ...shopMapper(shop)[0],
      cars,
      phones,
    };
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
