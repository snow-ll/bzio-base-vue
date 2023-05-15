import request from '../request'

export const login = (data: any) => {
    return request({
        url: '/auth/login',
        method: 'POST',
        data
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
