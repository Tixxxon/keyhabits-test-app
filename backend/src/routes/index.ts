import { Express } from 'express';
import { CarController } from './car/index';
import { ShopController } from './shop/index';

export function initControllers(app: Express) {
  CarController(app);
  ShopController(app);
}
