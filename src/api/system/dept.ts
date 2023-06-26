import request, { AjaxResponse, TableResponse } from '../request'

export const info = (deptId: string) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/dept/info',
        method: 'GET',
        params: {
            deptId: deptId
        }
    })
}
export const tree = (query: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/dept/tree',
        params: query
    })
}
export const list = (query: any) : Promise<TableResponse<any>> => {
    return request({
        url: '/system/dept/list',
        method: 'GET',
        params: query
    })
}

export const save = (data: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/dept/save',
        method: 'POST',
        data: data
    })
}

export const delBatch = (deptIds: string[]) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/dept/delBatch',
        method: 'POST',
        data: deptIds
    })
}
