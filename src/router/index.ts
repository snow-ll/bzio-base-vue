import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'

// 静态路由
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '/',
        component: () => import('../layout/index.vue'),
        children: [
            {
                path: '/data/:dictType',
                name: 'data',
                component: () => import('@/views/system/dict/data.vue')
            },
            {
                path: '/auth/:roleId',
                name: 'auth',
                component: () => import('@/views/system/role/components/auth/info.vue')
            },
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
