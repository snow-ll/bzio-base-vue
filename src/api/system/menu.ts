import request, { AjaxResponse } from '../request'

export const info = (menuId: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/menu/info',
        params: {
            menuId: menuId
        }
    })
}

export const tree = (query: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/menu/tree',
        params: query
    })
}

export const save = (data: any) :Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/menu/save',
        method: 'POST',
        data: data
    })
}

export const delBatch = (menuIds: string[]) => {
    return request({
        url: '/system/menu/delBatch',
        method: 'POST',
        data: menuIds
    })
}
