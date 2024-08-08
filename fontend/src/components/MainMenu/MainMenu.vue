<script setup lang="ts">
import { useMenuService } from '@/composables/menu';
import { toRefs } from 'vue';

const menuService = useMenuService();

const { activeMenuIdx } = menuService;
</script>

<template>
  <div class="flex items-center justify-center main-menu">
    <router-link
      v-for="(item, idx) in menuService.menuItems"
      :key="idx"
      class="main-menu__link"
      :class="{ 'main-menu__link--active': idx === activeMenuIdx }"
      :to="item.link"
      @click="menuService.changeMenuItem(idx)"
    >
      <img class="main-menu-link__icon" :src="item.icon" />
      <span class="main-menu-link__text">{{ item.name }}</span>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.main-menu {
  background-color: #dbdbdb;
  &__link {
    text-decoration: none;
    color: black;
    padding: 0.5em 1em;
    min-width: 170px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: all 0.3s ease-out;
    &--active {
      background-color: rgba(255, 255, 255, 0.6);
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
  &-link {
    &__icon {
      max-width: 30px;
      max-height: 30px;
    }
    &__text {
      font-size: 1.1em;
      font-weight: bold;
      text-transform: uppercase;
    }
  }
}
</style>
