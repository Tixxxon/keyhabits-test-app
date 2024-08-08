import type { GetCarDto } from './car.dto';

export interface CreateShopDto {
  name: string;
  phones: string[];
  cars: number[];
}
export interface GetShopDto {
  name: string;
  phones: string[];
  // cars: GetCarDto[];
}