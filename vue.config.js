module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
    outputDir: 'dist', //构建输出目录
    assetsDir: '', //静态资源目录(js,css,img,fonts)
    lintOnSave: false, //是否开启eslint保存检测, 有效值：true || false || 'error'



    devServer: {
        open: true,
        host: 'localhost',
        port: 3000,
        https: false,
        hotOnly: false,
        proxy: {
            //配置跨域
            '/busposition': {
                target: 'http://www.darren1112.com',
                ws: true,
                changOrigin: true,
                pathRewrite: { '^/busposition': '/busposition' }
            }
        }
    }
}