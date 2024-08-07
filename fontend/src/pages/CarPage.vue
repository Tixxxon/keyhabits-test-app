import { TableColumn } from '../types';
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useCarService } from '@/composables/car';
import type { TableColumn } from '@/types';
import { formatText } from '@/utils';
import Table from '@/components/Common/Table.vue';
import CommonButton from '@/components/Common/Button.vue';
import CommonDialog from '@/components/Common/Dialog.vue';

const columns = ref<TableColumn[]>([
  {
    label: 'Марка',
    name: 'brand',
  },
  {
    label: 'Модель',
    name: 'model',
  },
]);

const rows = ref<Record<string, string>[]>([]);

const carService = useCarService();

const showingAddCarWindow = ref(false);
const showAddCarWindow = () => {
  showingAddCarWindow.value = true;
};

onBeforeMount(() => {
  carService.getCarList().then((carList) => {
    carList.forEach((car) =>
      rows.value.push({
        id: `${car.id}`,
        brand: formatText(car.brand),
        model: formatText(car.model),
      }),
    );
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
  <common-dialog v-model="showingAddCarWindow" title="Добавление автомобиля" />
</template>

<style lang="scss" scoped>
.control-section {
  padding: 1em;
}
</style>
