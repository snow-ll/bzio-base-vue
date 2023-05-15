const { defineConfig } = require('@vue/cli-service')


const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = defineConfig({
    transpileDependencies: true,

    devServer: {
        https: false,
        hot: false,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:9080/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },

    css: {
        loaderOptions: {
            sass: {
                // 8版本用prependData
                additionalData:
                    `
                    // scss文件地址
                    @import "@/assets/styles/variables.scss";
                    // scss文件地址
                    @import "@/assets/styles/mixin.scss";
                    `
            }
        }
    },

    chainWebpack(config) {
        // 设置 svg-sprite-loader
        // config 为 webpack 配置对象
        // config.module 表示创建一个具名规则，以后用来修改规则
        config.module
            // 规则
            .rule('svg')
            // 忽略
            .exclude.add(resolve('src/assets/icons'))
            // 结束
            .end()
        // config.module 表示创建一个具名规则，以后用来修改规则
        config.module
            // 规则
            .rule('icons')
            // 正则，解析 .svg 格式文件
            .test(/\.svg$/)
            // 解析的文件
            .include.add(resolve('src/assets/icons'))
            // 结束
            .end()
            // 新增了一个解析的loader
            .use('svg-sprite-loader')
            // 具体的loader
            .loader('svg-sprite-loader')
            // loader 的配置
            .options({
                symbolId: 'icon-[name]'
            })
            // 结束
            .end()
    },
})
