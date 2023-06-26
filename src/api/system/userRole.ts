import request, { AjaxResponse, TableResponse } from '../request'

export const queryUserByRole = (query: any) : Promise<TableResponse<any>> => {
    return request({
        url: '/system/userRole/queryUserByRole',
        method: 'GET',
        params: query
    })
}

export const authUser = (data: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/userRole/authUser',
        method: 'POST',
        data: data
    })
}
    
export const cancel = (data: any) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/userRole/cancel',
        method: 'POST',
        data: data
    })
}
