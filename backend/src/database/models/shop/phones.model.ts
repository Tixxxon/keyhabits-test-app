import { Pool, QueryResult } from 'pg';
import { Model } from '../model.interface';
import { CreateShopDto } from '@dto/shop.dto';

export const TableName = 'phones';

export interface PhoneModelInterface {
  id: number;
  number: string;
}

export class PhoneModel implements Model {
  private static Instance: PhoneModel;
  constructor(private readonly db: Pool) {
    PhoneModel.Instance = this;
  }

  static getInstance() {
    return PhoneModel.Instance;
  }

  async initModel() {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS ${TableName}
      (
        id      SERIAL,
        number  VARCHAR(40) UNIQUE NOT NULL,
        PRIMARY KEY(id)
      );
    `);

    console.log(`init table: ${TableName} success`);
  }

  /**
   * @description создание нового номера телефона
   */
  async create(createPhondDto: { phones: string[] }) {
    const insertQuery = createPhondDto.phones.map(
      phone => `INSERT INTO ${TableName} (number) VALUES ('${phone}')`,
    );

    await this.db.query(insertQuery.join(';'));

    return this.findAllByNumbers({ number: createPhondDto.phones });
  }

  /**
   * @description получение всех номеров телефонов
   * @returns
   * TODO: скорее всего не будет никогда использоваться, максимум только для получения (зачем-то) списков всех телефонов... хмм...
   */
  async findAll() {
    const phones = await this.db.query(`SELECT * FROM ${TableName}`);

    return phoneMapper(phones);
  }

  /**
   * @description получение всех номеров телефонов по их идентификатору
   * @param query объектс с массивом идентификаторов телефонов
   * @returns
   */
  async findAllByIds(query: { id: string[] }) {
    const where = query
      ? `WHERE id IN (${query.id.map(id => `${id}`).join(', ')})`
      : '';

    const phones = await this.db.query(`SELECT * FROM ${TableName} ${where}`);

    return phoneMapper(phones);
  }

  /**
   * @description получение всех номеров телефонов по их номеру
   * @param query объектс с массивом номеров телефонов
   * @returns
   */
  async findAllByNumbers(query: { number: string[] }) {
    const where = query
      ? `WHERE number IN (${query.number.map(number => `${number}`).join(', ')})`
      : '';

    const phones = await this.db.query(`SELECT * FROM ${TableName} ${where}`);

    return phoneMapper(phones);
  }

  async delete(id: number) {
    const deleted = await this.db.query(
      `DELETE FROM ${TableName} WHERE id = ${id}`,
    );

    console.log(deleted);
  }
}

function phoneMapper(results: QueryResult<PhoneModelInterface>) {
  return results.rows.map(result => ({
    id: result.id,
    number: result.number,
  }));
}
