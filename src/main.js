import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import AES from './utils/AES';
const app = createApp(App)
app.config.globalProperties.$aes = AES;

app.use(ElementPlus)
app.mount('#app')
