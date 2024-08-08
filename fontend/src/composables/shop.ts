import type { CreateShopDto, GetShopDto } from '@dto/shop.dto';
import { useHttp } from './http';

export function useShopService() {
  const http = useHttp();

  const getShopList = async () => {
    const { data } = await http.get<GetShopDto[]>('/shops');

    return data;
  };

  const createShop = async (shopData: CreateShopDto) => {
    const { data } = await http.post<GetShopDto>('/shops', shopData);

    return data;
  };

  return { getShopList, createShop };
}
