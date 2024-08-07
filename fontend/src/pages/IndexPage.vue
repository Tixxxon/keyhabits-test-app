<script setup lang="ts">
import Table from '@/components/Common/Table.vue';
import { onBeforeMount, ref } from 'vue';
import { useCarService } from '../composables/car';

const columns = ref<
  {
    label: string;
    name: string;
  }[]
>([
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

function formatText(text: string) {
  return `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;
}

function formatPrice(price: number) {
  let _price = price.toLocaleString(undefined);
  return `${_price} ₽`;
}
</script>

<template>
  <div>
    <Table :columns="columns" :rows="rows" />
  </div>
</template>
