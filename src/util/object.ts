export function isNull(o: any) {
    if (o == null) return true
    if (!o) return true
    if (o == '') return true
    if (o == '{}') return true
    if (o == '[]') return true
    if (o.length === 0) return true
    if (o.size === 0) return true
    
    return false
}
