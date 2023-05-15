import { createApp } from 'vue'
import App from './App.vue'
import Pagination from '@/components/pagination/index.vue'
import Dict from '@/components/dict/index.vue'
import SvgIcon from './assets/icons/index'
import ElementPlus from 'element-plus'
import router from './router'
import store from './store'
import i18n from '@/i18n'
import 'element-plus/dist/index.css'
import './router/permission'
import './assets/styles/index.scss'
import './assets/css/table.css'

const app = createApp(App)

app
    .use(SvgIcon)
    .use(store)
    .use(router)
    .use(i18n)
    .use(ElementPlus)
    .mount('#app')


// 分页组件
app.component('Pagination', Pagination)
// 字典组件
app.component('Dict', Dict)
