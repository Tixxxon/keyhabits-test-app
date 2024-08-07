import { CarModel } from '@/database/models/car/car-models.model';
import { PhoneModel } from '@/database/models/shop/phones.model';
import { ShopCarsModel } from '@/database/models/shop/shop-cars.model';
import { ShopPhonesModel } from '@/database/models/shop/shop-phones.model';
import { ShopModel } from '@/database/models/shop/shop.model';
import { SummaryModel } from '@/database/models/summary.model';
import { Express, Request, Response, Router } from 'express';
import { MainService } from './main.service';

export function MainController(app: Express) {
  const summaryRepository = SummaryModel.getInstance();

  const mainService = new MainService(summaryRepository);

  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    const summary = await mainService.getSummary();
    return res.json(summary);
  });

  app.use('/api/summary', router);
}
