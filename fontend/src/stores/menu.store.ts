import { defineStore } from 'pinia';

interface State {
  activeIdx: number;
}

enum KEYS {
  ACTIVE_MENU_IDX = 'active-menu-idx',
}

export const useMenuStore = defineStore('menu', {
  state: (): State => ({
    activeIdx:
      localStorage.getItem(KEYS.ACTIVE_MENU_IDX) !== undefined
        ? Number(localStorage.getItem(KEYS.ACTIVE_MENU_IDX))
        : 0,
  }),
  actions: {
    changeActiveMenu(idx: number) {
      this.activeIdx = idx;
      localStorage.setItem(KEYS.ACTIVE_MENU_IDX, `${idx}`);
    },
  },
});
