import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { MaskInput } from 'vue-3-mask';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('MaskInput', MaskInput);

app.mount('#app');
