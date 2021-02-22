const pkg = require('./package')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'æternal',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    continuous: true,
    color: '#FF0D6A'
  },

  /*
  ** Global CSS
  */
  css: [
    { src: 'styles/index.scss', lang: 'scss' },
    {
      src: 'vue-multiselect/dist/vue-multiselect.min.css',
      lang: 'css'
    }
  ],
  env: {
    middlewareURL: process.env.NUXT_APP_NODE_URL || 'https://mainnet.aeternity.io/mdw',
    middlewareWS: process.env.NUXT_APP_NODE_WS || 'ws://mainnet.aeternity.io/mdw/websocket',
    networkName: process.env.NUXT_APP_NETWORK_NAME || 'MAIN NET',
    swaggerHub: process.env.NUXT_APP_SWAGGER_HUB || 'https://app.swaggerhub.com/apis/sshekhar/aeternal/1.0',
    enableFaucet: process.env.NUXT_APP_ENABLE_FAUCET || false,
    faucetAPI: process.env.NUXT_APP_FAUCET_API || 'https://testnet.faucet.aepps.com/account'
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/directives/copyToClipboard.js' },
    { src: '~/plugins/directives/removeSpacesOnCopy.js' },
    { src: '~/plugins/directives/vueSliderComponent.js', mode: 'client' },
    { src: '~/store/plugins/initMiddleware.js', ssr: false }
  ],
  /*
    ** Router config
    */
  router: {
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link'
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/svg-sprite'
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    transpile: ['@aeternity/aepp-sdk/es/utils/swagger'],

    postcss: {
      plugins: {
        autoprefixer: {}
      }
    },
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        const options = {
          exclude: ['node_modules'],
          fix: true,
          extensions: ['.js', '.vue']
        }
        const EslintPlugin = require('eslint-webpack-plugin')
        config.plugins.push(new EslintPlugin(options))
      }
    }
  }
}
