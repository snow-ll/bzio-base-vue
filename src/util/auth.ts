import {TOKEN_TIME, TOKEN_TIME_VALUE} from '@/util/constant'

// 设置token开始时效
export const setTokenTime = () => {
    sessionStorage.setItem(TOKEN_TIME, Date.now().toString());
};

// 获取token开始时效
export const getTokenTime = () => {
    return parseInt(sessionStorage.getItem(TOKEN_TIME) || '0');
};

// 判断token是否过期
export const isTokenExpired = () => {
    return Date.now() - getTokenTime() > TOKEN_TIME_VALUE; // 将 TOKEN_TIME_VALUE 转换为毫秒单位
};

// 判断token是否需要刷新
export const isTokenRefresh = () => {
    return Date.now() - getTokenTime() > TOKEN_TIME_VALUE - 1000 * 30; // 将 TOKEN_TIME_VALUE 转换为毫秒单位
};
