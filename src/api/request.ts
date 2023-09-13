import { isTokenExpired, isTokenRefresh } from '@/util/auth'
import { refreshToken } from '@/api/system/login'
import { setTokenTime } from '@/util/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
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

// 标志位，记录是否已经提示过登录失效
let isTokenExpiredAlerted = false

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
})

service.interceptors.request.use(config => {
    if (sessionStorage.getItem('token')) {
        // token过期
        if (isTokenExpired()) {
            store.dispatch('logout')
                .then(r => {
                    
                })
            return Promise.reject(new Error('token失效了！'))
        } else {
            // token未过期，判断是否需要刷新token
            if (isTokenRefresh()) {
                setTokenTime()
                refreshToken().then(res => {
                    console.log("刷新token成功！")
                })
            }
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
    if (error.response.status == 403) {
        if (!isTokenExpiredAlerted) {
            isTokenExpiredAlerted = true

            ElMessageBox.alert('登录已失效，请重新登录', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                    store.dispatch('logout')
                }
            })
        }
    }
})
export default service
