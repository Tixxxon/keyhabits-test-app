export interface CreateCarDto {
  model: string;
  brandId: number;
  price: number;
}

export interface CreateCarBrandDto {
  brand: string;
}