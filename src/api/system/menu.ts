import request, { AjaxResponse } from '../request'

export const tree = (query: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/menu/tree',
        params: query
    })
}

export const info = (menuId: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/menu/info',
        params: {
            menuId: menuId
        }
    })
}

export const save = (data: any) :Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/menu/save',
        method: 'POST',
        data: data
    })
}

export const del = (menuIds: string[]) => {
    return request({
        url: '/system/menu/del',
        method: 'POST',
        data: menuIds
    })
}
