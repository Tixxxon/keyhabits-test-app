
export interface CreateCarDto {
  model: string;
  brandId: number;
  price: number;
}

export interface GetCarDto {
  id: number;
  model: string;
  brand: string;
  price: number;
}

export interface GetBrandDto {
  id: number;
  brand: string;
}

export interface CreateCarBrandDto {
  brand: string;
}

export interface GetBrandsDto {
  id: number;
  brand: string;
}