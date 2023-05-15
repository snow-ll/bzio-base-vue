import { App } from 'vue'
import SvgIcon from '@/components/svgIcon/index.vue'

const svgRequired = require.context('./svg', false, /\.svg$/)
svgRequired.keys().forEach((item) => svgRequired(item))

const install = (app: App): void => {
    app.component('svg-icon', SvgIcon)
}

export default { install }
