<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface Props {
  columns: {
    label: string;
    name: string;
  }[];
  rows: Record<string, any>[];
}

const props = defineProps<Props>();

const fieldLocation = ref<string[]>(props.columns.map((c) => c.name));
const resizableColumns = ref(
  props.columns.map((column) => ({
    width: 300,
    ...column,
  })),
);

const resizable = ref(false);
const prevResizePosition = ref<number>();
const resizeColumnIdx = ref<number>();
const startResize = (idx: number, event: MouseEvent) => {
  resizable.value = true;

  resizeColumnIdx.value = idx;

  prevResizePosition.value = event.clientX;

  document.body.style.cursor = 'col-resize';

  document.addEventListener('mousemove', resizeFunction);
  document.addEventListener('mouseup', onMouseUpHandle);
};

function resizeFunction(event: MouseEvent) {
  requestAnimationFrame(() => {
    const resizeDelta = event.clientX - prevResizePosition.value!;

    resizableColumns.value[resizeColumnIdx.value!].width =
      resizableColumns.value[resizeColumnIdx.value!].width + resizeDelta;

    prevResizePosition.value = event.clientX;
  });
}

const onMouseUpHandle = (event: any) => {
  if (!resizable.value) return;
  resizable.value = false;

  document.removeEventListener('mousemove', resizeFunction);
  document.removeEventListener('mouseup', onMouseUpHandle);
  document.body.style.cursor = 'default';

  resizeColumnIdx.value = -1;
  prevResizePosition.value = 0;
};

onMounted(() => {
  // Добавляем событие на поднятие мыши, что бы удалить событие перетаскивания
  document.addEventListener('mouseup', onMouseUpHandle);
});
</script>

<template>
  <table class="table">
    <tr>
      <th
        v-for="(column, cIdx) in resizableColumns"
        :key="cIdx"
        class="table__header"
        :class="{
          'table__header--resizing': resizeColumnIdx === cIdx,
        }"
        :style="{ width: `${column.width}px` }"
      >
        {{ column.label }}
        <div
          v-if="cIdx !== resizableColumns.length - 1"
          class="drag-line"
          :class="{ 'drag-line--active': resizeColumnIdx === cIdx }"
          @mousedown="startResize(cIdx, $event)"
        ></div>
      </th>
    </tr>
    <tr class="table__row" v-for="(rowItem, rIdx) in rows" :key="rIdx">
      <td class="table__row-item" v-for="(value, vIdx) in fieldLocation" :key="vIdx">
        {{ rowItem[value] ?? '' }}
      </td>
    </tr>
  </table>
</template>
<style lang="scss" scoped>
.table {
  border: 1px solid gray;
  border-collapse: collapse;

  width: 100%;
  &__header {
    position: relative;
    background-color: rgb(101, 147, 255);
    transition: background-color 0.3s ease-out;
    font-weight: bold;
    font-size: 1.3em;

    .drag-line {
      opacity: 0;
      position: absolute;
      cursor: col-resize;
      right: 0;
      top: 0;
      height: 100%;
      border: 1px solid black;
      transition: opacity 0.2s ease-out;
      &--active {
        opacity: 1;
      }
    }

    &--resizing {
      background-color: darken(rgb(101, 147, 255), 10%);
    }

    &:hover {
      background-color: darken(rgb(101, 147, 255), 10%);
      .drag-line {
        user-select: none;
        opacity: 1;
      }
    }
  }
  &__row {
    &:hover {
      .table__row-item {
        background-color: rgb(239, 239, 239);
      }
    }
    & > * {
      border: 1px solid rgb(169, 169, 169);
    }
  }
  &__row-item {
    transition: all 0.2s ease-out;
    text-align: center;
  }
}
</style>
