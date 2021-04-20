
// ws
const init = () : void => {
  const WebSocket = require('ws')
  const wss = new WebSocket.Server({ 
    port: 3008,
  })

  wss.on('connection', function connection(ws: any) {
    ws.send('测试连接，初次发送')
    ws.on('message', (message: string) => {
      console.log('received: %s', message)
      // 仅发给当前客户端
      // ws.send(message)
      // 广播给全部客户端
      wss.clients.forEach((client: any) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    })
  })
}

export default {
  init,
}