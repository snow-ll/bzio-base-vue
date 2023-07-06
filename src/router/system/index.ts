const systemMenuRouter = [
    {
        path: '/system',
        name: 'system',
        component: () => import('@/layout/index.vue'),
        children: [
            {
                path: '/user',
                name: 'user',
                component: () => import('@/views/system/user/index.vue')
            },
            {
                path: '/role',
                name: 'role',
                component: () => import('@/views/system/role/index.vue'),
            },
            {
                path: '/auth/:roleId',
                name: 'auth',
                component: () => import('@/views/system/role/components/auth/info.vue')
            },
            {
                path: '/dept',
                name: 'dept',
                component: () => import('@/views/system/dept/index.vue')
            },
            {
                path: '/menu',
                name: 'menu',
                component: () => import('@/views/system/menu/index.vue')
            },
            {
                path: '/dict',
                name: 'dict',
                component: () => import('@/views/system/dict/index.vue')
            },
            {
                path: '/data/:dictType',
                name: 'data',
                component: () => import('@/views/system/dict/data.vue')
            },
            {
                path: '/config',
                name: 'config',
                component: () => import('@/views/system/config/index.vue')
            },
        ]
    },
    
]

export default systemMenuRouter
