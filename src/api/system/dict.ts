import request, {AjaxResponse, TableResponse} from '../request'

export const info = (dictId: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/dict/dict/info',
        params: {
            dictId: dictId
        }
    })
}

export const list = (query: any) : Promise<TableResponse<any>> => {
    return request({
        url: '/system/dict/dict/list',
        params: query
    })
}

export const save = (data: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/dict/dict/save',
        method: 'POST',
        data: data
    })
}

export const del = (dictType: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/dict/dict/del',
        method: 'POST',
        data: dictType
    })
}

export const dataInfo = (dictCode: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/dict/data/info',
        params: {
            dictCode: dictCode
        }
    })
}

export const dataList = (query: any) : Promise<TableResponse<any>> => {
    return request({
        url: '/system/dict/data/list',
        params: query
    })
}

export const saveData = (data: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/dict/data/save',
        method: 'POST',
        data: data
    })
}

export const delData = (dictCode: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/dict/data/del',
        method: 'POST',
        data: dictCode
    })
}

export const type = (query: any) => {
    return request({
        url: '/system/dict/data/type',
        method: 'GET',
        params: query
    })
}
