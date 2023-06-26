import router from '@/router/index'
import store from '@/store'

const whiteList: string[] = ['/login', '/register']

router.beforeEach((to, from, next) => {
    if (store.getters.token) {
        // 登录成功不需要进入登录页
        if (to.path === '/login') {
            next('/')
        } else {
            store.dispatch('setUserInfo')
            next()
        }
    } else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            next('/login')
        }
    }
})
