import request, {AjaxResponse} from '../request'

export const login = (data: any) => {
    return request({
        url: '/auth/login',
        method: 'POST',
        data
    })
}

export const getInfo = () => {
    return request({
        url: '/auth/getInfo',
        method: 'GET',
    })
}

export const register = (data: any) => {
    return request({
        url: '/auth/register',
        method: 'POST',
        data
    })
}

export const getCodeImg = () => {
    return request({
        url: 'code',
        method: 'GET',
    })
}

export const getRouter = () : Promise<AjaxResponse<any>> => {
    return request({
        url: '/auth/getRouter',
    })
}

export const refreshToken = () : Promise<AjaxResponse<any>> => {
    return request({
        url: '/auth/refreshToken',
        method: 'POST'
    })
}
