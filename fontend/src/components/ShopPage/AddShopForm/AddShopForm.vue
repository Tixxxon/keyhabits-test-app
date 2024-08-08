<script setup lang="ts">
import CommonDialog from '@/components/Common/Dialog.vue';
import { useCarService } from '@/composables/car';
import { useShopService } from '@/composables/shop';
import type { GetCarDto } from '@dto/car.dto';
import type { GetShopDto } from '@dto/shop.dto';
import { computed, onMounted, ref } from 'vue';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (event: 'update:modelValue', value: boolean): void;
  (event: 'createShop', value: GetShopDto): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const carService = useCarService();
const shopService = useShopService();

const isShow = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

const shopName = ref('');
const shopPhones = ref<string[]>([]);
const addingPhone = ref('');

const addNewPhone = () => {
  shopPhones.value.push(addingPhone.value);
  // FIXME: Почему-то не работает очистка
  addingPhone.value = '';
};

const deleteShopPhone = (idx: number) => {
  shopPhones.value.splice(idx, 1);
};

const carList = ref<GetCarDto[]>([]);
const selectedCarIdx = ref<number>(-1);
const shopCars = ref<GetCarDto[]>([]);

const addCar = () => {
  const car = carList.value.find((car) => car.id === selectedCarIdx.value);
  if (!car) return;

  shopCars.value.push(car);

  selectedCarIdx.value = -1;
};

const deleteShopCar = (idx: number) => {
  shopCars.value.splice(idx, 1);
};

const createNewShop = async () => {
  const shop = await shopService.createShop({
    name: shopName.value,
    phones: shopPhones.value,
    cars: shopCars.value.map((car) => car.id),
  });

  emits('createShop', shop);

  setTimeout(() => {
    shopName.value = '';
    shopPhones.value = [];
    shopCars.value = [];
  }, 100);
};

onMounted(() => {
  carService.getCarList().then((list) => {
    carList.value = list;
  });
});
</script>

<template>
  <common-dialog
    v-model="isShow"
    title="Добавить новый магазин"
    @submit="createNewShop"
    :height="400"
  >
    <div class="form">
      <div class="form__line">
        <label class="form__label">Название</label>
        <input v-model="shopName" class="form__input" />
      </div>
      <div class="form__line">
        <label class="form__label">Телефон</label>
        <MaskInput v-model="addingPhone" mask="+7 (###) ###-##-##" class="form__input" />
        <button
          class="button button--positive form__button"
          @click="addNewPhone"
          :disabled="!addingPhone"
        >
          +
        </button>
      </div>
      <div class="form__line">
        <span v-for="(phone, idx) in shopPhones" class="chip"
          ><span>{{ phone }}</span>
          <button class="chip__btn" @click="deleteShopPhone(idx)">
            <img src="/icons/cross.svg" /></button
        ></span>
      </div>
      <div class="form__line">
        <label class="form__label">Автомобили</label>
        <select class="form__input" v-model="selectedCarIdx">
          <option value=""></option>
          <option v-for="car in carList" :key="car.id" :value="car.id">
            {{ car.brand }} {{ car.model }}
          </option>
        </select>
        <button
          class="button button--positive form__button"
          @click="addCar"
          :disabled="selectedCarIdx < 0"
        >
          +
        </button>
      </div>
      <div class="form__line">
        <span v-for="(shopCar, idx) in shopCars" class="chip"
          ><span>{{ shopCar.brand }} {{ shopCar.model }}</span>
          <button class="chip__btn" @click="deleteShopCar(idx)">
            <img src="/icons/cross.svg" /></button
        ></span>
      </div>
    </div>
  </common-dialog>
</template>

<style lang="scss" scoped>
.chip {
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 2px 5px;
  background-color: rgb(242, 242, 242);
  margin-left: 5px;
  margin-right: 5px;
  span {
    padding: 4px;
  }
  &__btn {
    margin-left: 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: none;
    background-color: darken(white, 20%);
    transition: background-color 0.3s ease-out;
    &:hover {
      background-color: darken(white, 10%);
    }
    img {
      max-width: 15px;
      max-height: 15px;
      width: 15px;
      height: 15px;
    }
  }
}
</style>
