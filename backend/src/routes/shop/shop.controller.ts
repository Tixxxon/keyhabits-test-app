import { Router, Request, Express, Response } from 'express';
import { ShopService } from './shop.service';
import { ShopModel } from '@/database/models/shop/shop.model';
import { ShopPhonesModel } from '@/database/models/shop/shop-phones.model';
import { PhoneModel } from '@/database/models/shop/phones.model';
import { ShopCarsModel } from '@/database/models/shop/shop-cars.model';

export function ShopController(app: Express) {
  const shopRepository = ShopModel.getInstance();
  const shopPhoneRepository = ShopPhonesModel.getInstance();
  const phoneRepository = PhoneModel.getInstance();
  const shopCarRepository = ShopCarsModel.getInstance();

  const shopService = new ShopService(
    shopRepository,
    shopPhoneRepository,
    phoneRepository,
    shopCarRepository,
  );

  const router = Router();

  /**
   * @description получение списка магазинов
   * TODO: необходимо добавить фильтрацию/постраничный вывод
   */
  router.get('/', async (req: Request, res: Response) => {
    const shops = await shopService.getShops();
    return res.json(shops);
  });

  /**
   * @description создание нового магазина
   * @body {name: string, phones: string[], cars?: number[]}
   */
  router.post('/', async (req: Request, res: Response) => {
    try {
      const newShop = await shopService.createShop(req.body);
      return res.json(newShop);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        if (error.message.startsWith('duplicate key value')) {
          return res
            .status(403)
            .send(`Магазин с названием ${req.body.name} уже существует`);
        }
      }
      console.log(error);
      return res.status(500);
    }
  });

  /**
   * @description удаление магазина
   */
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await shopService.deleteShop(+req.params.id);
      return res.status(200).send('Удаление магазина произведено успешно');
    } catch (error) {
      return res.status(500).send('Ошибка сервера');
    }
  });

  /**
   * @description добавление автомобилей в магазин
   * @body {cars: number[]}
   * TODO: метод пока не реализован
   */
  router.post('/:id/cars', async (req: Request, res: Response) => {
    shopService.addCarsToShop();
    return res.status(200);
  });

  /**
   * @description удаление машин из магазина
   * TODO: в будущем может понадобиться для пакетого удаления автомобилей
   */
  router.delete('/:id/cars', async (req: Request, res: Response) => {
    shopService.deleteCarsFromShop(+req.params.id, req.body.carsIds);
    return res.status(200);
  });

  // TODO: добавить, если успею, добавление/изменение телефона

  app.use('/api/shops', router);
}
