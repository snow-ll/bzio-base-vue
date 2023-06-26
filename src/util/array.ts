/**
 * 判断一个集合中是否包含另一个集合中某元素
 * @param srcArr
 * @param desArr
 */
export function includesAny(srcArr: any[], desArr: any[]) {
    for (let value of desArr) {
        if (srcArr.includes(value)) {
            return true
        }
    }
    return false
}
