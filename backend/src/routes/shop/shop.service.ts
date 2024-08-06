import { Request, Response } from 'express';
import { ShopModel } from '@/database/models/shop/shop.model';
import { CreateShopDto } from '@dto/shop.dto';
import { ShopPhonesModel } from '@/database/models/shop/shop-phones.model';
import { PhoneModel } from '@/database/models/shop/phones.model';
import { ShopCarsModel } from '@/database/models/shop/shop-cars.model';

export class ShopService {
  //* Передаём в качестве инверсии зависимостей
  //* сервис управления телефонами как параметр
  constructor(
    private readonly shopRepository: ShopModel,
    private readonly shopPhoneRepository: ShopPhonesModel,
    private readonly phoneRepository: PhoneModel,
    private readonly shopCarRepository: ShopCarsModel,
  ) {}

  /**
   * @description получение списка магазинов
   */
  async getShops() {
    return await this.shopRepository.findAll();
  }

  /**
   * @description создать новый магазин
   * @body {name: string, phones: string[], cars?: number[]}
   */
  async createShop(createShopDto: CreateShopDto) {
    const shop = await this.shopRepository.create(createShopDto);

    await Promise.all([
      // Привязка телефонов к магазину
      this.bindPhonesToShop(shop.id, createShopDto.phones),
      // Привязка автомобилей к магазину
      this.bindCarsToShop(shop.id, createShopDto.cars),
    ]);

    const [phones, cars] = await Promise.all([
      this.shopPhoneRepository.findShopPhones(shop.id),
      this.shopCarRepository.findShopCars(shop.id),
    ]);

    return {
      shop,
      phones,
      cars,
    };
  }

  /**
   * @description привязывание телефонов к магазину при создании
   */
  private async bindPhonesToShop(shopId: number, phoneNumbers: string[]) {
    if (!phoneNumbers || !phoneNumbers.length) return;

    const phones = await this.phoneRepository.create({
      phones: phoneNumbers,
    });

    await this.shopPhoneRepository.create({
      shopId: shopId,
      phoneIds: phones.map(phone => phone.id),
    });
  }

  /**
   * @description привязывание автомобилей к магазину при создании
   */
  private async bindCarsToShop(shopId: number, cars: number[]) {
    if (!cars || !cars.length) return;

    await this.shopCarRepository.create({
      shopId: shopId,
      carIds: cars,
    });
  }

  /**
   * @description получение списка машин, продающихся в магазине
   */
  getCars(req: Request, res: Response) {}

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
