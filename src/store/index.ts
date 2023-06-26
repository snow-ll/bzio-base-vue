import { createStore, Store } from 'vuex'
import { RootState } from './types'
import getters from '@/store//getters'
import userModule from '@/store/modules/user'
import dictModule from '@/store/modules/dict'
import routerModule from '@/store/modules/router'
import componentsModule from '@/store/modules/components'

const store: Store<RootState> = createStore<RootState>({
    modules: {
        user: userModule,
        dict: dictModule,
        router: routerModule,
        components: componentsModule,
    },
    getters
});

export default store;
