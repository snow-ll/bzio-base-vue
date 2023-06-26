import store from '@/store'
import { toRaw } from '@vue/reactivity'

export const setDictData = (dictType: string[]) => {
    dictType.map(item => {
        store.dispatch('dict/setData', item)
            .then((ref: any) => {
                return ref;
            });
    });
};

export const getDictData = (dictType: string, dictValue: string) => {
    const d = toRaw(store.getters.dict).get(dictType);
    const list: any[] | undefined = toRaw(d);
    if (typeof list !== "undefined") {
        return list.map(item => {
            if (!dictValue.toString().indexOf(item.dictValue)) {
                return item.dictLabel;
            }
        });
    }
};
