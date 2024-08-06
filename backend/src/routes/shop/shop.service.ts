import { Request, Response } from 'express';
import { PhoneService } from './phone.service';
import { CarService } from '../car/car.service';
import { ShopModel } from '@/database/models/shop/shop.model';
import { CreateShopDto } from '@dto/shop.dto';

export class ShopService {
  //* Передаём в качестве инверсии зависимостей
  //* сервис управления телефонами как параметр
  constructor(
    private readonly phoneService: PhoneService,
    private readonly carService: CarService,
    private readonly shopRepository: ShopModel,
  ) {}

  /**
   * @description получение списка магазинов
   */
  async getShops() {
    return await this.shopRepository.findAll();
  }

  /**
   * @description получение списка машин, продающихся в магазине
   */
  getCars(req: Request, res: Response) {}

  /**
   * @description создать новый магазин
   * @body {name: string, phones: string[], cars?: number[]}
   */
  createShop(createShopDto: CreateShopDto) {
    return this.shopRepository.create(createShopDto);
  }

  /**
   * @description удаление магазина по его id
   * @param id идентификатор магазина
   */
  deleteShop(id: number) {
    return this.shopRepository.delete(id);
  }

  /**
   * @description добавить автомобиль в магазин
   * @param id идентификатор магазина
   * @body {carId: number}
   */
  addCarToShop(req: Request, res: Response) {}

  /**
   * @description добавление нескольких автомобилей в магазин
   * @body {carIds: number[]}
   */
  addCarsToShop() {
    return 'Успешное добавление машины в магазин';
  }

  /**
   * @description удалить автомобиль из магазина
   * @param id идентификатор магазина
   * @body {carId: number}
   */
  deleteCarsFromShop(shopId: number, carsIds: number[]) {
    return 'Успешное удаление автомобилеей из магазина';
  }
}
