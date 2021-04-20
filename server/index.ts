const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const koaBody = require('koa-body')
import ws from './ws/'
import * as a from './log'
console.log('a', a)
import logger from './log'
const log = logger('http')

const app = new Koa()
const port = 3107
const maxage = 30 * 24 * 60 * 60 * 1000 // 30天

// 异常捕捉中间件
app.use(async (ctx: any, next: any) => {
  try {
    await next()
  } catch (e) {
    ctx.app.emit('error', e)
    ctx.body = {
      code: -1,
      msg: 'server error'
    }
    ctx.status = e.status || 500
  }
})

app.use(serve(path.join(__dirname, './../public/'), {
  maxage: maxage
}))

app.use(koaBody({
  multipart: false,
  formidable: {
    maxFieldsSize: 3 * 1024 * 1024 // 3M（同 JAVA 端配置），设置上传文件大小最大限制，默认 2M
  }
}))

app.use(async (ctx: any, next: any) => {
  const start: number = new Date().getTime()
  await next()
  const end: number = new Date().getTime()
  const ms: number = end - start
  if (ctx.status === 200) {
    log.trace(`"${ctx.request.method} ${ctx.request.url}" ${ctx.status} ${ms}ms "${ctx.request.header['user-agent']}"`)
  } else {
    log.error(`"${ctx.request.method} ${ctx.request.url}" ${ctx.status} ${ms}ms "${ctx.request.header['user-agent']}"`)
  }
})

// 启动 websocket 服务
ws.init()

app.on('error', (err: any) => {
  log.error('server error:', err)
})

process.on('unhandledRejection', (message: string, stack: string): void => {
  log.error('未捕捉的Promise错误：', stack)
})

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}/`)
})
