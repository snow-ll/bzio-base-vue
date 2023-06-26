import request, { AjaxResponse, TableResponse } from '../request'

export const info = (userId: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/user/info',
        method: 'GET',
        params: {
            userId: userId
        }
    })
}

export const list = (query: any) : Promise<TableResponse<any>> => {
    return request({
        url: '/system/user/list',
        method: 'GET',
        params: query
    })
}

export const save = (data: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/user/save',
        method: 'POST',
        data: data
    })
}

export const del = (username: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/user/del',
        method: 'POST',
        data: username
    })
}

export const changeStatus = (userId: string, status: number) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/user/changeStatus',
        method: 'POST',
        data: {
            userId: userId,
            status: status
        }
    })
}
