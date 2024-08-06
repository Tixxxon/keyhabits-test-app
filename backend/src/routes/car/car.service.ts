/**
 * @author Тишкин Д.А.
 * @description сервис управления моделью автомобилей
 */

import { CarBrandsModel } from '@/database/models/car/car-brands.model';
import { CarModel } from '@/database/models/car/car-models.model';
import { CreateCarBrandDto, CreateCarDto } from '@dto/car.dto';
import { Request, Response } from 'express';

export class CarService {
  private static Instance: CarService;
  constructor(
    private readonly carBrandRepostitory: CarBrandsModel,
    private readonly carRepository: CarModel,
  ) {
    CarService.Instance = this;
  }

  static getInstance() {
    return CarService.Instance;
  }

  /**
   * @description получение списка всех брендов автомобилей
   */
  async getBrands() {
    return this.carBrandRepostitory.findAll();
  }

  /**
   * @description получение списка всех доступных машин
   */
  getCars() {
    return this.carRepository.findAll();
  }

  /**
   * @description получение информации об одной машине по её id
   * TODO: пока не рализовано
   */
  getCar() {
    return 'Получение информации о машине пока не реализовано ';
  }

  /**
   * @description создание нового бренда машины
   */
  async createBrand(createCarBrandDto: CreateCarBrandDto) {
    const newBrand = await this.carBrandRepostitory.create(createCarBrandDto);

    return newBrand;
  }

  /**
   * @description создание новой машины
   */
  async createCar(createCarDto: CreateCarDto) {
    const newCar = await this.carRepository.create({
      model: createCarDto.model,
      brandId: createCarDto.brandId,
    });

    return newCar;
  }

  /**
   * @description удаление машины
   * TODO: пока не реализовано
   */
  deleteCar(carId: number) {
    return 'Успешное удаление автомобиля';
  }
}
