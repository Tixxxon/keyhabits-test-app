<script lang="ts" setup>
interface Props {
  modelValue: boolean;
  title: string;
  width?: number;
  height?: number;
}

interface Emits {
  (event: 'update:modelValue', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  width: 500,
  height: 600,
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
      <div class="flex items-center dialog__title">{{ title }}</div>
      <slot></slot>
      <slot name="action"></slot>
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

  &__title {
    padding: 10px;
    font-weight: bold;
    text-align: center;
    width: 100%;
  }
}
</style>
