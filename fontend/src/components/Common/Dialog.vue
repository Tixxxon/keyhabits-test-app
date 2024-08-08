<script lang="ts" setup>
interface Props {
  modelValue: boolean;
  title: string;
  submitLabel?: string;
  width?: number;
  height?: number;
}

interface Emits {
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit'): void;
}

const props = withDefaults(defineProps<Props>(), {
  width: 500,
  height: 600,
  submitLabel: 'Сохранить',
});
const emits = defineEmits<Emits>();

const closeWindow = () => {
  emits('update:modelValue', false);
};
</script>

<template>
  <Teleport to="body" v-if="modelValue">
    <div class="dialog__backing" @click="closeWindow"></div>
    <div class="dialog__window" :style="{ width: `${width}px`, height: `${height}px` }">
      <div class="flex items-center justify-start dialog__header">
        <div class="dialog__title">{{ title }}</div>
        <button class="button dialog__close-btn" @click="closeWindow">
          <img class="dialog__close-btn-img" src="/icons/cross.svg" />
        </button>
      </div>
      <div class="dialog__body">
        <div class="dialog__content">
          <slot></slot>
        </div>
        <slot name="action">
          <div class="flex justify-end">
            <button class="button button--positive" @click="emits('submit')">
              {{ submitLabel }}
            </button>
          </div>
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
body {
  position: relative;
}

.dialog {
  &__backing {
    z-index: 1000;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85);
  }

  &__window {
    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: 1001;
    max-width: 80vw;
    max-height: 80vh;
    top: 50%;
    left: 50%;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    overflow: hidden;
    transform: translate3D(-50%, -50%, 0);
    background-color: white;
  }

  &__body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__content {
    flex-grow: 1;
  }

  &__header {
    padding: 10px 15px;
    font-size: 1.3em;
  }

  &__title {
    font-weight: bold;
    text-align: center;
    flex-grow: 1;
    width: 100%;
  }

  &__close-btn {
    display: flex;
    justify-content: stretch;
    align-items: stretch;
    cursor: pointer;
    background-color: transparent;
    border-radius: 50%;
    border: none;
    width: 30px;
    height: 30px;
    padding: 0;
    &:hover {
      background-color: darken(white, 5%);
    }
  }
}
</style>
