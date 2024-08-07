<script setup lang="ts">
import Table from '@/components/Common/Table.vue';
import { onBeforeMount, ref } from 'vue';
import { useCarService } from '../composables/car';
import type { TableColumn } from '@/types';
import { formatPrice, formatText } from '@/utils';

const columns = ref<TableColumn[]>([
  {
    label: 'Марка',
    name: 'brand',
  },
  {
    label: 'Модель',
    name: 'model',
  },
  {
    label: 'Стоимость',
    name: 'price',
  },
  {
    label: 'Магазин',
    name: 'shop',
  },
  {
    label: 'Телефон',
    name: 'phone',
  },
]);

const rows = ref<Record<string, string>[]>([]);

const carService = useCarService();

onBeforeMount(() => {
  carService.getSummary().then((carList) => {
    carList.forEach((item) => {
      rows.value.push({
        brand: formatText(item.brand),
        model: formatText(item.model),
        price: formatPrice(item.price),
        shop: item.shop,
        phone: item.phones.join(', '),
      });
    });
  });
});
</script>

<template>
  <div>
    <Table :columns="columns" :rows="rows" />
  </div>
</template>
