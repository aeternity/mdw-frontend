import camelcaseKeysDeep from 'camelcase-keys-deep'
/**
 * AE.mdw VueJs websocket client
 * channel: "Transactions" | "MicroBlocks" | "KeyBlocks"
 *
 * $ws()
 *  .listen(channel, callback (payload) => ...)
 *  .listen(channel, callback (payload) => ...)
 */
export default async ({ app, env }, inject) => {
  inject('ws', () => {
    class AeWebsocket {
      isConnected = false
      queueChannels = []
      supportedChannels = ['Transactions', 'MicroBlocks', 'KeyBlocks']

      constructor () {
        console.info('INIT WS')
        this.socket = new WebSocket(env.middlewareWS)

        this.socket.onopen = (e) => {
          console.info('connected', this.queueChannels)
          this.isConnected = true

          this.queueChannels.forEach((cb) => cb())
        }
      }

      listen (channel, cb = (payload) => console.info(channel, '=>', payload)) {
        if (!this.supportedChannels.includes(channel)) {
          throw new Error(
            `${channel} is not supported, try ${this.supportedChannels.join(
              ', '
            )}`
          )
        }
        if (this.isConnected) {
          this.socket.send(`{"op":"Subscribe", "payload": "${channel}"}`)
        } else {
          this.queueChannels.push(() => {
            this.socket.send(`{"op":"Subscribe", "payload": "${channel}"}`)
          })
        }

        this.socket.onmessage = (e) => {
          if (e.data && e.data.includes('payload')) {
            let data = camelcaseKeysDeep(JSON.parse(e.data))
            if (data.subscription === channel) {
              cb(data.payload)
            }
          }
        }

        return this
      }
    }

    return new AeWebsocket()
  })
}
