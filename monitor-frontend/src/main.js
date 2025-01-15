import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/version',
      component: () => import('./views/Version.vue')
    },
    {
      path: '/loader',
      component: () => import('./views/Loader.vue')
    }
  ]
})

// 创建应用
const app = createApp(App)

// 使用插件
app.use(router)
app.use(createPinia())
app.use(ElementPlus)

// 挂载应用
app.mount('#app') 