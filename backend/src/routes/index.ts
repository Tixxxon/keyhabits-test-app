import { Express } from 'express';
import { CarController } from './car/index';
import { ShopController } from './shop/index';
import { MainController } from './main/index';

export function initControllers(app: Express) {
  CarController(app);
  ShopController(app);
  MainController(app);
}
