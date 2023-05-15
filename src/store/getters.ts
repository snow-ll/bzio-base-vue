import { GetterTree } from 'vuex';
import { RootState } from './types';

const getters: GetterTree<RootState, RootState> = {
    token: (state) => state.user.token,
    sideType: (state) => state.user.sideType,
    dict: (state) => state.dict.dict,
    activeView: (state) => state.router.activeView,
    viewList: (state) => state.router.viewList,    
};

export default getters;
