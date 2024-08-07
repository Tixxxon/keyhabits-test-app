import { useHttp } from '@/composables/http';
import type { GetSummaryDto } from '@/../../dto/summary.dto';

export function useCarService() {
  const http = useHttp();

  const getCarList = async () => {
    const { data: carList } = await http.get<
      {
        id: number;
        brand: any;
        model: string;
      }[]
    >('/cars');

    return carList;
  };

  const getSummary = async () => {
    const { data } = await http.get<GetSummaryDto[]>('/summary');

    console.log(data);
    return data;
  };

  return {
    getCarList,
    getSummary,
  };
}
