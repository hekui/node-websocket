const config = {
  env: process.env.runEnv || 'dev', // 服务环境：本地,loc; 开发,dev; 测试,test; 生产,prod
  webUrl: process.env.webUrl || 'htttp://localhost:3000', // 本服务访问域名，使用 redis 时必须配置
  timeout: 5000 // 超时时间
}

module.exports = config
