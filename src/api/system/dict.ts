import request from '../request'

export const type = (query: any) => {
    return request({
        url: '/system/dict/data/type',
        method: 'GET',
        params: query
    })
}

export const value = (query: any) => {
    return request({
        url: '/system/dict/data/value',
        method: 'GET',
        params: query
    })
}
