import { Module, useStore } from 'vuex'
import { RootState } from '../types'
import { RouteRecord, RouteRecordName } from 'vue-router'
import router from '@/router'

export interface RouterState {
    activeView: string
    viewList: View[]
}

interface View {
    name: string,
    label: string,
    path: string,
}


const store = useStore()

const routerModule: Module<RouterState, RootState> = {
    namespaced: true,
    state: () => ({
        activeView: '/',
        viewList: [{ name: '/', label: '首页', path: "/"}]
    }),
    mutations: {
        SET_VIEW(state, route: RouteRecord) {
            const routePath = route.path! as string
            const routeName = route.name! as string
            const routeLabel = route.meta!.label as string
            // 判断路由是否已经存在
            const isViewExist = state.viewList.some((view: any) => view.name === routeName)
            const isPathExist = state.viewList.some((view: any) => view.path === routePath)
            // 路由不存在则将路由加入viewList
            let view: View = { name: routeName, label: routeLabel, path: routePath }
            if (!isViewExist) {
                state.viewList.push(view)
            } else if(!isPathExist) {
                const viewIndex = state.viewList.findIndex((view: View) => view.name === routeName)
                // 删除该路由
                state.viewList.splice(viewIndex, 1)
                state.viewList.push(view)
            }
            // 将激活路由切换为该路由
            state.activeView = routeName
        },
        REMOVE_VIEW(state, routeName: string | RouteRecordName) {
            // 如果传进来的路由是工作台，则不继续进行
            if (routeName === '/') return
            // 获取该view的索引值
            const viewIndex = state.viewList.findIndex((view: View) => view.name === routeName)
            // 删除该路由
            state.viewList.splice(viewIndex, 1)
            // 如果该路由并未激活，则无需关心后续问题
            if (state.activeView !== routeName) {
                return
            }
            if (viewIndex >= state.viewList.length) {
                // 如果该路由的索引值不小于删除后的viewList长度，则将激活路由设置为viewList中最后一个路由
                state.activeView = state.viewList[state.viewList.length - 1].name
            } else {
                // 反之，仍将激活路由设置为原索引值对应的路由
                state.activeView = state.viewList[viewIndex].name
            }
            // 跳转路由
            router.push({ name: state.activeView })
        },
        REVERT_VIEW(state) {
            state.activeView= '/'
            state.viewList = [{ name: '/', label: '首页', path: "/"}]
        }
    },
    actions: {
        
    }
}

export default routerModule
