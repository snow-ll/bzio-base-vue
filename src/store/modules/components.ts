import { Module } from 'vuex'
import { RootState } from '../types'

export interface ComponentsState {
    sideType: boolean
}


const componentsModule: Module<ComponentsState, RootState> = {
    state: () => ({
        sideType: true    
    }),
    mutations: {
        CHANGE_SIDE_TYPE(state) {
            state.sideType = !state.sideType
        }
    },
    actions: {
        
    }
}

export default componentsModule
