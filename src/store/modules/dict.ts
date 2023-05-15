import { Module } from 'vuex'
import { RootState } from '../types'
import { type } from '@/api/system/dict'

export interface DictState {
    dict: Map<string, any>
    dictTypes: string[]
}

const dictModule: Module<DictState, RootState> = {
    namespaced: true,
    state: () => ({
        dict: new Map(),
        dictTypes: []
    }),
    mutations: {
        SET_DATA(state, { key, value }: { key: string; value: any }) {
            state.dict.set(key, value)
        },
        SET_TYPES(state, key: string) {
            state.dictTypes.push(key)
        }
    },
    actions: {
        setData({ commit, state }, dictType: string) {
            return new Promise<void>((resolve, reject) => {
                type({ dictType })
                    .then((r) => {
                        commit('SET_DATA', { key: dictType, value: r.data })
                        r.data.forEach((item: any) => {
                            resolve(item)
                        })
                    })
                    .catch(() => {
                        reject('')
                    })
            })
        }
    }
}

export default dictModule
