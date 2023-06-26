import { GetterTree } from 'vuex';
import { RootState } from './types';

const getters: GetterTree<RootState, RootState> = {
    token: (state) => state.user.token,
    roles: (state) => state.user.roles,
    perms: (state) => state.user.perms,
    sideType: (state) => state.components.sideType,
    dict: (state) => state.dict.dict,
    activeView: (state) => state.router.activeView,
    viewList: (state) => state.router.viewList,    
};

export default getters;
