import { Pool, QueryResult } from 'pg';
import { Model } from '../model.interface';
import { CarBrandModelInterface } from './car-brands.model';
import { CreateCarDto } from '@dto/car.dto';
import { TableName as CarBrandTableName } from './car-brands.model';

export const TableName = 'car_models';

export interface CarModelsInterface {
  id: number;
  model: string;
  price: number;
  brand_id: number;
  brand?: CarBrandModelInterface;
}

export class CarModel implements Model {
  private static Instance: CarModel;

  constructor(private readonly db: Pool) {
    CarModel.Instance = this;
  }

  static getTableName() {
    return TableName;
  }

  static getInstance() {
    return CarModel.Instance;
  }

  async initModel() {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS ${TableName}
      (
        id        SERIAL,
        model     VARCHAR(40),
        price     INT NOT NULL,
        brand_id  INT NOT NULL,
        CONSTRAINT fk_car_brand FOREIGN KEY(brand_id) REFERENCES ${CarBrandTableName}(id),
        PRIMARY KEY(model, brand_id)
      )
    `);

    console.log(`init table: ${TableName} success`);
  }

  /**
   * @description создание нового автомобиля в таблице автомобилей
   */
  async create(createCarDto: CreateCarDto) {
    await this.db.query(
      `INSERT INTO ${TableName} (model, brand_id, price) VALUES ('${createCarDto.model}', ${createCarDto.brandId}, ${createCarDto.price})`,
    );

    return this.findOne({
      brandId: createCarDto.brandId,
      model: createCarDto.model,
    });
  }

  /**
   * @description получение всех значений автомобилей из таблицы автомобилей
   * TODO: фильтр пока не добавлен, т.к. не успеваю пока
   */
  async findAll(query?: { page: number; rowPerPage: number }) {
    const result = await this.db.query(
      `SELECT 
        ${TableName}.id, 
        ${TableName}.model, 
        ${TableName}.price,
        ${CarBrandTableName}.brand
      FROM ${TableName} 
      JOIN ${CarBrandTableName} ON ${TableName}.brand_id = ${CarBrandTableName}.id`,
    );

    return findAllMapper(result);
  }

  /**
   * @description получение одного значения из таблицы моделей автомобилей
   */
  async findOne(query: { brandId: number; model: string }) {
    if (query.brandId === undefined || query.brandId < 0 || !query.model)
      throw new Error('Неверный запрос');
    const result = await this.db.query(
      `SELECT
        ${TableName}.id, 
        ${TableName}.model, 
        ${TableName}.price,
        ${CarBrandTableName}.brand 
      FROM ${TableName} 
      JOIN ${CarBrandTableName} ON ${TableName}.brand_id = ${CarBrandTableName}.id
      WHERE ${TableName}.brand_id=${query.brandId} AND ${TableName}.model='${query.model}'`,
    );

    return findAllMapper(result)[0];
  }
}

function findAllMapper(result: QueryResult<CarModelsInterface>) {
  return result.rows.map(res => ({
    id: res.id,
    brand: res.brand,
    price: res.price,
    model: res.model,
  }));
}
