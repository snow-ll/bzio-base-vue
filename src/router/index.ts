import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import systemMenuRouter from './system'
import store from '@/store'

const dynamicImport = (path: string) => () => import(`../views/${path}.vue`);

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
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/register.vue')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/test.vue')
    },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
    if (!to.meta.noKeepAlive && to.path!=='/login') {
        // 添加标签
        store.commit('router/SET_VIEW', to)
        // 将路由缓存
    }
    // 路由扁平化
    next()
})

export default router
