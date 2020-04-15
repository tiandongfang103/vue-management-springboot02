module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false
    devServer: {
        proxy: {
            '/rest': {
                target: 'http://localhost:9090',
                changeOrigin: true,
                pathRewrite: {
                    '/rest': ''
                }
            }
        }
    }
}