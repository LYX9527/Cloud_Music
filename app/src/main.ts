import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import { BootstrapIconsPlugin } from 'bootstrap-icons-vue';
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import 'animate.css';
import "./assets/utils/flexlble.js"
import './index.css'
import 'nprogress/nprogress.css'
import directive from '@/directive/index'
createApp(App).use(store).use(router).use(BootstrapIconsPlugin).use(ElementPlus).use(directive).mount('#app')
