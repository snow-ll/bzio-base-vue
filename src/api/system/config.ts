import request, { AjaxResponse, TableResponse } from '../request'

export const info = (configId: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/config/info',
        method: 'GET',
        params: {
            configId: configId
        }
    })
}

export const list = (query: any) : Promise<TableResponse<any>> => {
    return request({
        url: '/system/config/list',
        method: 'GET',
        params: query
    })
}

export const save = (data: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/config/save',
        method: 'POST',
        data: data
    })
}

export const del = (configId: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/config/del',
        method: 'POST',
        data: configId
    })
}
