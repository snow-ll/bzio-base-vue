import { Module } from 'vuex'
import { RootState } from '../types'
import { login as loginApi, getInfo } from '@/api/system/login'
import { setTokenTime } from '@/util/auth'
import { isNull } from '@/util/object'
import router from '@/router'
import store from '@/store'

export interface UserState {
    token: string
    info: object
    roles: string[]
    perms: string[]
}

const authModule: Module<UserState, RootState> = {
    state: () => ({
        token: sessionStorage.getItem('token')!,
        info: {},
        roles: [],
        perms: [],
    }),
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            sessionStorage.setItem('token', token)
        },
        SET_USER_INFO(state, userInfo) {
            state.info = userInfo.user
            state.roles = userInfo.roles
            state.perms = userInfo.perms
        }
    },
    actions: {
        login({ commit }, userInfo) {
            return new Promise<void>((resolve, reject) => {
                loginApi(userInfo)
                    .then((res: any) => {
                        commit('SET_TOKEN', res.data)
                        setTokenTime()
                        router.replace('/')
                        resolve()
                    })
                    .catch((err: any) => {
                        reject(err)
                    })
            })
        },
        setUserInfo({ commit }) {
            if (isNull(store.getters.router)) {
                getInfo().then(res => {
                    commit('SET_USER_INFO', res.data)
                })
            }
        },
        logout({ commit }) {
            commit('SET_TOKEN', '')
            sessionStorage.clear()
            commit('router/REVERT_VIEW')
            router.replace('/login')
        }
    }
}

export default authModule
