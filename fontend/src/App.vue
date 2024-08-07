<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainMenu from './components/MainMenu/MainMenu.vue';

const title = import.meta.env.VITE_APP_TITLE;
</script>

<template>
  <div id="app">
    <main-menu :title="title" />
    <div class="page">
      <router-view />
    </div>
  </div>
</template>

<style scoped></style>
