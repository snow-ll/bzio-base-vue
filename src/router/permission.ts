import { getRouter } from '@/api/system/login'
import { RouteRecordRaw } from 'vue-router'
import { isNull } from '@/util/object'
import router from '@/router/index'
import store from '@/store'

const whiteList: string[] = ['/login', '/register']

router.beforeEach((to, from, next) => {
    if (store.getters.token) {
        // 登录成功不需要进入登录页
        if (to.path === '/login') {
            next('/')
        } else {
            store.dispatch('setUserInfo').then(() => {
                // 添加动态路由
                if (isNull(store.getters.router)) {
                    getRouter()
                        .then(res => {
                            addRouter(res.data)
                        })
                }
            })

            next()
        }
    } else if (whiteList.includes(to.path)) {
        next()
    } else {
        next('/login')
    }
})

/**
 * 动态添加所有配置的路由
 */
export const addRouter = (routeData: any[]) => {
    store.dispatch('router/addRouter', routeData)

    routeData.forEach(item => {
        let route : RouteRecordRaw = {
            path: `/${item.path}`,
            name: item.path,
            component: () => import(`@/views/${item.component}/index.vue`),
        }

        if (!item.pid) {
            route = {
                path: `/${item.path}`,
                name: item.path,
                component: () => import('@/layout/index.vue'),
            }
        }


        // 子菜单不为空，遍历添加子菜单
        if (item.children) {
            addChildren(route, item.children)
        }

        // 添加路由
        router.addRoute(route)
    })
}

/**
 * 建立路由父子关系
 */
const addChildren = (route: RouteRecordRaw, children: any[]) => {
    route.children = []

    children.forEach(childItem => {
        const childRoute: RouteRecordRaw = {
            path: `/${childItem.path}`,
            name: childItem.path,
            component: () => import(`@/views${childItem.component}/index.vue`),
        };

        route.children?.push(childRoute)

        // 递归添加子菜单的子菜单
        if (childItem.children) {
            addChildren(childRoute, childItem.children)
        }
    })
}

/**
 * 刷新页面时先加载路由
 */
export const loadingRouter = (): Promise<void> => {
    return new Promise<void>((resolve) => {
        // 未登录情况下不执行该操作
        if (!store.getters.token) {
            resolve()
            return
        }
        if (!isNull(store.getters.router)) {
            // 已加载路由的情况不执行该操作
            resolve()
            return
        } else {
            // 加载用户信息
            store.dispatch('setUserInfo').then(() => {
                // 未加载路由的情况，进行加载
                getRouter()
                    .then(res => {
                        if (res) {
                            addRouter(res.data)
                        }
                        resolve()
                    })
            })
        }
    })
}
