import { CreateCarBrandDto } from '@dto/car.dto';
import { Pool, QueryResult } from 'pg';
import { Model } from '../model.interface';

export const TableName = 'car_brands';

export interface CarBrandModelInterface {
  id: number;
  brand: string;
}

export class CarBrandsModel implements Model {
  private static Instance: CarBrandsModel;
  constructor(private readonly db: Pool) {
    CarBrandsModel.Instance = this;
  }

  static getTableName() {
    return TableName;
  }

  static getInstance() {
    return CarBrandsModel.Instance;
  }

  async initModel() {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS ${TableName}
      (
        id      SERIAL,
        brand   VARCHAR(40) UNIQUE NOT NULL,
        PRIMARY KEY(id)
      );
    `);

    console.log(`init table: ${TableName} success`);
  }

  async create(createCarBrandDto: CreateCarBrandDto) {
    await this.db.query(
      `INSERT INTO ${TableName} (brand) VALUES ('${createCarBrandDto.brand}')`,
    );

    return this.findOne({ brand: createCarBrandDto.brand });
  }

  async findOne(query: { brand: string }) {
    const result = await this.db.query(
      `SELECT * FROM ${TableName} WHERE brand = '${query.brand}'`,
    );

    return brandsMapper(result)[0];
  }

  async findAll(query?: any) {
    const brands = await this.db.query(`SELECT * FROM ${TableName}`);

    return brandsMapper(brands);
  }

  // TODO: пока не используется... нужно каскадное удаление
  async delete(id: number) {
    const deleted = await this.db.query(
      `DELETE FROM ${TableName} WHERE id = ${id}`,
    );

    console.log(deleted);
  }
}

function brandsMapper(results: QueryResult<CarBrandModelInterface>) {
  return results.rows.map(result => ({
    id: result.id,
    brand: result.brand,
  }));
}
