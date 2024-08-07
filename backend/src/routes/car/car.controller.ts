import { CarBrandsModel } from '@/database/models/car/car-brands.model';
import { Request, Response, Router, Express } from 'express';
import { CarService } from './car.service';
import { CarModel } from '@/database/models/car/car-models.model';

export function CarController(app: Express) {
  const carService = new CarService(
    CarBrandsModel.getInstance(),
    CarModel.getInstance(),
  );

  const router = Router();

  /**
   * @description получение полного списка автомобилей
   * TODO:  необходимо добавить фильтрацию
   */
  router.get('/', async (req: Request, res: Response) => {
    const cars = await carService.getCars();

    return res.json(cars);
  });

  /**
   * @description получение информации об одной машине по её id
   */
  router.get('/:id', async (req: Request, res: Response) => {
    const info = await carService.getCar();
    return res.json(info);
  });

  /**
   * @description удаление машины по её id
   */
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await carService.deleteCar(req.body.carId);
      return res.send('Успешное удаление');
    } catch (error) {
      return res.status(500).send('Ошибка удаление автомобиля ');
    }
  });

  /**
   * @description создание новой машины
   * @body {brandId: number, model: string}
   */
  router.post('/', async (req: Request, res: Response) => {
    try {
      const newCar = await carService.createCar(req.body);
      return res.json(newCar);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.startsWith('duplicate key value')) {
          return res.status(403).json('Значение уже существует');
        }
      }

      return res.status(500).send('Ошибка на сервере');
    }
  });

  /**
   * @description получение списка всех брендов автомобилей
   */
  router.get('/brands', async (req: Request, res: Response) => {
    const brands = await carService.getBrands();

    return res.json(brands);
  });

  /**
   * @description создание нового бренда автомобилей
   * @body {brand: string}
   */
  router.post('/brands', async (req: Request, res: Response) => {
    try {
      const brand = await carService.createBrand(req.body);
      return res.json(brand);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.startsWith('duplicate key value')) {
          return res.status(403).json('Значение уже существует');
        }
      }

      return res.status(500).send('Ошибка на серверве');
    }
  });

  app.use('/api/cars', router);
}
