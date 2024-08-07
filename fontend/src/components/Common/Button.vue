<script lang="ts" setup>
interface Props {
  label: string;
}

interface Emits {
  (event: 'click'): void;
}

defineProps<Props>();

const emits = defineEmits<Emits>();
</script>
<template>
  <button class="button common-button" @click="emits('click')">{{ label }}</button>
</template>
<style lang="scss" scoped>
.common-button {
  cursor: pointer;
  border: 1px solid gray;
  padding: 10px 20px;
  background-color: transparent;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1em;
  transition: background-color 0.3s ease-out;
  &:hover {
    background-color: whitesmoke;
  }
}
</style>
