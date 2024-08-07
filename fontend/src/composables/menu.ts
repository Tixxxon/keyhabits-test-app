import { useMenuStore } from '@/stores/menu.store';
import { storeToRefs } from 'pinia';

const menuItems = [
  {
    name: 'Главная',
    link: '/',
    icon: '/icons/garage.svg',
  },
  {
    name: 'Автомобили',
    link: '/cars',
    icon: '/icons/car.svg',
  },
  {
    name: 'Магазины',
    link: '/shops',
    icon: '/icons/shop.svg',
  },
];

export function useMenuService() {
  const menuStore = useMenuStore();

  const { activeIdx } = storeToRefs(menuStore);

  return {
    menuItems,
    changeMenuItem: menuStore.changeActiveMenu,
    activeMenuIdx: activeIdx,
  };
}
