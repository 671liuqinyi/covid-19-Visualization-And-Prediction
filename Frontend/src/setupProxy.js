const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    // 腾讯接口
    proxy.createProxyMiddleware('/api1', { //遇见/api1前缀的请求，就会触发该代理配置
      target: 'https://api.inews.qq.com', //请求转发目标
      changeOrigin: true,//控制服务器收到的请求头中Host的值
      pathRewrite: { '^/api1': '' } //重写请求路径,去除请求路径中'/api1'
    }),
    // 丁香园
    proxy.createProxyMiddleware('/api2', {
      target: 'https://file1.dxycdn.com',
      changeOrigin: true,
      pathRewrite: { '^/api2': '' }
    }),
    // 丁香园新闻等数据接口
    proxy.createProxyMiddleware('/api3', {
      target: 'https://lab.isaaclin.cn',
      changeOrigin: true,
      pathRewrite: { '^/api3': '' }
    }),
    // 风险地区数据
    proxy.createProxyMiddleware('/api', {
      target: 'https://wechat.wecity.qq.com',
      changeOrigin: true,
    }),
    // 卫健委数据
    // proxy.createProxyMiddleware('/api4', {
    //   target: 'https://bmfw.www.gov.cn',
    //   changeOrigin: true,
    //   pathRewrite: { '^/api4': '' }
    // }),
  )
}