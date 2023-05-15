const req: __WebpackModuleApi.RequireContext = require.context('@/assets/icons/svg', false, /\.svg$/)

const requireAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys()

const re = /\.\/(.*)\.svg/

const icons = requireAll(req).map((i: any) => {
    return i.match(re)[1]
})

export default icons
