import request, { AjaxResponse, TableResponse } from '@/api/request'

export const info = (roleId: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/role/info',
        params: {
            roleId: roleId
        }
    })
}

export const list = (query: any) : Promise<TableResponse<any>> => {
    return request({
        url: '/system/role/list',
        params: query
    })
}

export const save = (data: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/role/save',
        method: 'POST',
        data: data
    })
}

export const del = (roleId: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/role/del',
        method: 'POST',
        data: roleId
    })
}
