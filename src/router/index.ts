import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import systemMenuRouter from './system'
import store from '@/store'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '/',
        component: () => import('../layout/index.vue'),
        children: [
            ...systemMenuRouter
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/register.vue')
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('../views/test.vue')
    },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
    if (!to.meta.noKeepAlive) {
        // 添加标签
        store.commit('router/SET_VIEW', to)
        // 将路由缓存
    }
    // 路由扁平化
    next()
})

export default router
