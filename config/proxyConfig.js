module.exports = {
    proxy: {
        '/apis': {    //将www.exaple.com印射为/apis
            target: 'http://192.168.14.83:8080',  // 接口域名   吴迪
            // target: 'http://192.168.14.71:8081',  // 接口域名   张春雨
            // target: 'http://192.168.14.81:8081',  //  李铖涵
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true,  //是否跨域
            pathRewrite: {
                '^/apis': ''   //需要rewrite的,
            }
        }
    }
}