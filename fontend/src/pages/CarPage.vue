import { TableColumn } from '../types';
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useCarService } from '@/composables/car';
import type { TableColumn } from '@/types';
import { formatText } from '@/utils';
import Table from '@/components/Common/Table.vue';
import CommonButton from '@/components/Common/Button.vue';
import AddCarForm from '@/components/CarPage/AddCarForm/AddCarForm.vue';
import type { GetCarDto } from '@dto/car.dto';

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
    label: 'Цена',
    name: 'price',
  },
]);

const rows = ref<Record<keyof GetCarDto, string>[]>([]);

const carService = useCarService();

const showingAddCarWindow = ref(false);
const showAddCarWindow = () => {
  showingAddCarWindow.value = true;
};

const addNewCar = (car: GetCarDto) => {
  rows.value.push(formatCarObject(car));
  showingAddCarWindow.value = false;
};

function formatCarObject(car: GetCarDto) {
  return {
    id: `${car.id}`,
    brand: formatText(car.brand),
    model: formatText(car.model),
    price: `${car.price} ₽`,
  };
}

onBeforeMount(() => {
  carService.getCarList().then((carList) => {
    carList.forEach((car) => rows.value.push(formatCarObject(car)));
  });
});
</script>

<template>
  <div>
    <div class="flex justify-end control-section">
      <common-button label="Добавить автомобиль" @click="showAddCarWindow" />
    </div>
    <Table :columns="columns" :rows="rows" />
  </div>
  <add-car-form v-model="showingAddCarWindow" @create-car="addNewCar" />
</template>

<style lang="scss" scoped>
.control-section {
  padding: 1em;
}
</style>
