<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useCarService } from '@/composables/car';
import type { GetBrandsDto, GetCarDto } from '@dto/car.dto';
import CommonDialog from '@/components/Common/Dialog.vue';
import { MaskInput } from 'vue-3-mask';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (event: 'update:modelValue', value: boolean): void;
  (event: 'createCar', value: GetCarDto): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const carService = useCarService();

const carBrands = ref<GetBrandsDto[]>([]);

const carBrand = ref<number>(-1);
const carModel = ref('');
const carPrice = ref(0);

const errorMessage = ref('');

const isShow = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

const showError = (message: string) => {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = '';
  }, 2500);
};

const submit = () => {
  if (carBrand.value <= 0) {
    showError('Необходимо выбрать марку');
    return;
  }
  if (!carModel.value) {
    showError('Необходимо указать модель автомобиля');
    return;
  }

  if (!carPrice.value || carPrice.value <= 0) {
    showError('Цена должна быть больше 0₽');
    return;
  }

  carService
    .createCar({
      brandId: carBrand.value,
      model: carModel.value,
      price: carPrice.value,
    })
    .then((car) => {
      emits('createCar', car);
      setTimeout(() => {
        carBrand.value = -1;
        carModel.value = '';
        carPrice.value = 0;
      }, 100);
    });
};

const showingAddBrandWindow = ref(false);
const newBrand = ref('');
const newBrandInput = ref<HTMLButtonElement>();
const showNewBrandInput = () => {
  showingAddBrandWindow.value = true;

  setTimeout(() => {
    newBrandInput.value?.focus();
  }, 100);
};

const saveNewBrand = () => {
  carService
    .createBrand({
      brand: newBrand.value,
    })
    .then((brand) => {
      showingAddBrandWindow.value = false;
      setTimeout(() => {
        carBrand.value = carBrands.value.push(brand);
      }, 100);
    });
};

onMounted(() => {
  carService.getBrands().then((brandList) => {
    carBrands.value = brandList.map((brand) => ({
      id: brand.id,
      brand: `${brand.brand[0].toUpperCase()}${brand.brand.slice(1)}`,
    }));
  });
});
</script>
<template>
  <common-dialog v-model="isShow" title="Добавление автомобиля" @submit="submit" :height="300">
    <div class="add-car-form form">
      <div class="form__line">
        <template v-if="!showingAddBrandWindow">
          <label class="form__label">Марка</label>
          <select class="form__input" v-model="carBrand">
            <option value=""></option>
            <option v-for="brand in carBrands" :key="brand.id" :value="brand.id">
              {{ brand.brand }}
            </option>
          </select>
          <button class="button button--positive form__button" @click="showNewBrandInput">+</button>
        </template>
        <template v-else>
          <label class="form__label">Марка</label>
          <input
            class="form__input"
            ref="newBrandInput"
            v-model="newBrand"
            placeholder="Новый бренд"
          />
          <button class="button button--positive form__button" @click="saveNewBrand">
            Сохранить
          </button>
        </template>
      </div>
      <div class="form__line">
        <label class="form__label">Модель</label>
        <input class="form__input" v-model="carModel" />
      </div>
      <div class="form__line">
        <label class="form__label">Цена (₽)</label>
        <MaskInput class="form__input" v-model="carPrice" mask="################" />
      </div>
      <div class="form__line" v-show="errorMessage">
        <span class="form__error">{{ errorMessage }}</span>
      </div>
    </div>
  </common-dialog>
</template>

<style lang="scss">
.form__error {
  padding: 15px;
  background-color: rgb(240, 101, 101);
  font-weight: bold;
  margin: 15px auto;
  color: white;
  flex-grow: 1;
  text-align: center;
  border-radius: 10px;
}
</style>
