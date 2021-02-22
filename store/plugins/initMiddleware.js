import { initMiddleware } from '../utils'

export default function ({ app, store }) {
  app.router.onReady(() => store.commit('setMiddleware', initMiddleware()))
}
