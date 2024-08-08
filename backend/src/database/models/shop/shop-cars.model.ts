import { Pool } from 'pg';
import { Model } from '../model.interface';
import { ShopModelInterface } from './shop.model';
import { CarModelsInterface } from '../car/car-models.model';
import { TableName as ShopTableName } from './shop.model';
import { TableName as CarTableName } from '../car/car-models.model';
// import { TableName as CarBrandTableName } from '../car/car-brands.model';

export const TableName = 'shop_cars';

export interface ShopCarsModelInterface {
  shopId: number;
  carId: number;
  shop: ShopModelInterface;
  car: CarModelsInterface;
}

export class ShopCarsModel implements Model {
  private static Instance: ShopCarsModel;
  constructor(private readonly db: Pool) {
    ShopCarsModel.Instance = this;
  }

  static getTableName() {
    return TableName;
  }

  static getInstance() {
    return ShopCarsModel.Instance;
  }

  async initModel() {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS ${TableName}
      (
        id      SERIAL,
        shop_id INT NOT NULL,
        car_id  INT NOT NULL,
        PRIMARY KEY(shop_id, car_id)
      );
    `);

    console.log(`init table: ${TableName} success`);
  }

  async create(createShopCarDto: { shopId: number; carIds: number[] }) {
    const insertQuery: string[] = [];

    createShopCarDto.carIds.forEach(carId =>
      insertQuery.push(
        `INSERT INTO ${TableName} (shop_id, car_id) VALUES (${createShopCarDto.shopId}, ${carId})`,
      ),
    );

    await this.db.query(insertQuery.join(',\n'));
  }

  /**
   * @description получить все автомобили магазина
   * TODO: пока без фильтрации
   */
  async findShopCars(shopId: number) {
    const cars = await this.db.query(
      `SELECT car_id FROM ${TableName} WHERE shop_id = ${shopId}`,
    );

    return cars.rows.map(row => ({ id: row.car_id }));
  }

  async delete(query: { carId: number; shopId: number }) {
    const deleted = await this.db.query(
      `DELETE FROM ${TableName} WHERE shop_id = ${query.shopId} AND car_id = ${query.carId}`,
    );

    console.log(deleted);
  }
}
