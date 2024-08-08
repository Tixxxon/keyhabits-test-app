import { useHttp } from '@/composables/http';
import type { GetSummaryDto } from '@dto/summary.dto';
import type {
  CreateCarBrandDto,
  CreateCarDto,
  GetBrandDto,
  GetBrandsDto,
  GetCarDto,
} from '@dto/car.dto';

export function useCarService() {
  const http = useHttp();

  const getCarList = async () => {
    const { data: carList } = await http.get<GetCarDto[]>('/cars');

    return carList;
  };

  const getSummary = async () => {
    const { data } = await http.get<GetSummaryDto[]>('/summary');

    return data;
  };

  const getBrands = async () => {
    const { data } = await http.get<GetBrandsDto[]>('/cars/brands');
    return data;
  };

  const createCar = async (createCar: CreateCarDto) => {
    const { data } = await http.post<GetCarDto>('/cars', createCar);
    return data;
  };

  const createBrand = async (createBrand: CreateCarBrandDto) => {
    const { data } = await http.post<GetBrandDto>('/cars/brands', createBrand);
    return data;
  };

  return {
    getCarList,
    getSummary,
    getBrands,
    createCar,
    createBrand,
  };
}
