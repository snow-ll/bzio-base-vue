import { isTokenExpired } from '@/util/auth';
import {ElMessage, ElMessageBox} from 'element-plus';
import axios from 'axios'
import store from '@/store'

export interface AjaxResponse<T> {
    code: string;
    msg: string;
    data: T | null;
}

export interface TableResponse<T> {
    code: string;
    msg: string;
    rows: T[];
    total: number;
}

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
})

service.interceptors.request.use(config => {
    if (sessionStorage.getItem('token')) {
        if (isTokenExpired()) {
            store.dispatch('logout')
                .then(r => {
                    
                })
            return Promise.reject(new Error('token失效了！'))
        } else {
        }
    }
    
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})

// response拦截器
service.interceptors.response.use(res => {
    const { data } = res

    if (data.code === 200) {
        return data
    } else {
        ElMessage.error(data.msg)
        return Promise.reject(new Error(data.msg))
    }
}, error => {
    return Promise.reject(new Error(error.response.data.msg))
})
export default service
