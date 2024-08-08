import { Pool } from 'pg';
import { Model } from './model.interface';
import { CarModel } from '@/database/models/car/car-models.model';
import { PhoneModel } from '@/database/models/shop/phones.model';
import { ShopCarsModel } from '@/database/models/shop/shop-cars.model';
import { ShopPhonesModel } from '@/database/models/shop/shop-phones.model';
import { ShopModel } from '@/database/models/shop/shop.model';
import { CarBrandsModel } from './car/car-brands.model';

export class SummaryModel implements Model {
  private static Instance: SummaryModel;
  constructor(private readonly db: Pool) {
    SummaryModel.Instance = this;
  }

  static getInstance() {
    return SummaryModel.Instance;
  }

  async initModel() {}

  async getSummary() {
    const brandTable = CarBrandsModel.getTableName();
    const carTable = CarModel.getTableName();
    const phoneTable = PhoneModel.getTableName();
    const shopCarsTable = ShopCarsModel.getTableName();
    const shopPhonesTable = ShopPhonesModel.getTableName();
    const shopTable = ShopModel.getTableName();

    const result = await this.db.query(`
      SELECT
        ${brandTable}.brand, 
        ${carTable}.model, 
        ${carTable}.price,
        ${shopTable}.id as shopid,
        ${shopTable}.name as shop
      FROM ${shopCarsTable}
        INNER JOIN ${shopTable} ON ${shopTable}.id = ${shopCarsTable}.shop_id
        INNER JOIN ${carTable} ON ${carTable}.id = ${shopCarsTable}.car_id
        INNER JOIN ${brandTable} ON ${brandTable}.id = ${carTable}.brand_id`);

    const shopsIds = new Set(result.rows.map(r => r.shopid));

    const phones = await ShopPhonesModel.getInstance().findShopsPhones([
      ...shopsIds.values(),
    ]);

    return result.rows.map(result => ({
      brand: result.brand,
      model: result.model,
      price: result.price,
      phones: phones[result.shopid] ?? [],
      shop: result.shop,
    }));
  }
}
