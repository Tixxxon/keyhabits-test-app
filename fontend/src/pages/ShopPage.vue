<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import type { TableColumn } from '@/types';
import type { GetShopDto } from '@dto/shop.dto';
import Table from '@/components/Common/Table.vue';
import CommonButton from '@/components/Common/Button.vue';
import AddShopForm from '@/components/ShopPage/AddShopForm/AddShopForm.vue';
import { useShopService } from '@/composables/shop';

const columns = ref<TableColumn[]>([
  {
    label: 'Название',
    name: 'name',
  },
  {
    label: 'Телефоны',
    name: 'phones',
  },
]);

const rows = ref<Record<keyof GetShopDto, string>[]>([]);

const shopService = useShopService();

const showingAddShopWindow = ref(false);
const showAddShopWindow = () => {
  showingAddShopWindow.value = true;
};

const addNewShop = (shop: GetShopDto) => {
  rows.value.push(formatShopObject(shop));
  showingAddShopWindow.value = false;
};

function formatShopObject(shop: GetShopDto) {
  return {
    name: shop.name,
    phones: shop.phones?.join(', '),
  };
}

onBeforeMount(() => {
  shopService.getShopList().then((shopList) => {
    shopList.forEach((shop) => rows.value.push(formatShopObject(shop)));
  });
});
</script>

<template>
  <div>
    <div class="flex justify-end control-section">
      <common-button label="Добавить магазин" @click="showAddShopWindow" />
    </div>
    <Table :columns="columns" :rows="rows" />
  </div>
  <add-shop-form v-model="showingAddShopWindow" @create-shop="addNewShop" />
</template>

<style lang="scss" scoped>
.control-section {
  padding: 1em;
}
</style>
