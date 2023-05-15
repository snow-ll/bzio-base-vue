import { Module } from 'vuex'
import { RootState } from '../types'
import { login as loginApi } from '@/api/system/login'
import router from '@/router'
import { setTokenTime } from '@/util/auth'

export interface UserState {
    token: string
    sideType: boolean
}

const authModule: Module<UserState, RootState> = {
    state: () => ({
        token: sessionStorage.getItem('token')!,
        sideType: true
    }),
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            sessionStorage.setItem('token', token)
        },
        CHANGE_SIDE_TYPE(state) {
            state.sideType = !state.sideType
        }
    },
    actions: {
        login({ commit }, userInfo) {
            return new Promise<void>((resolve, reject) => {
                loginApi(userInfo)
                    .then((res: any) => {
                        commit('SET_TOKEN', res.data.key);
                        setTokenTime();
                        router.replace('/');
                        resolve();
                    })
                    .catch((err: any) => {
                        reject(err);
                    });
            }); 
        },
        logout({ commit }) {
            commit('SET_TOKEN', '')
            sessionStorage.clear()
            router.replace('/login')
        }
    }
}

export default authModule
