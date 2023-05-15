export function mergeRecursive(source: any, target: any) {
    for (let p in target) {
        try {
            if (target[p].constructor == Object) {
                source[p] = mergeRecursive(source[p], target[p])
            } else {
                source[p] = target[p]
            }
        } catch (e) {
            source[p] = target[p]
        }
    }
    return source
}
