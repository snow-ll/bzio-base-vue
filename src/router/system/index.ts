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
                path: '/assignRole',
                name: 'assignRole',
                component: () => import('@/views/system/role/components/assignRole.vue')
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
            }
        ]
    },
    
]

export default systemMenuRouter
