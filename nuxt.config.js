const pkg = require('./package')

module.exports = {
  target: process.env.NUXT_TARGET || 'static',
  ssr: process.env.NUXT_SSR === 'true' || false,
  generate: {
    exclude: [/^\/.+/], // only pregenerate the index page
    crawler: false
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'æternity Explorer',
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
    nodeURL: process.env.NUXT_APP_NODE_URL || 'https://mainnet.aeternity.io/v3',
    middlewareURL: process.env.NUXT_APP_MDW_URL || 'https://mainnet.aeternity.io/mdw',
    middlewareWS: process.env.NUXT_APP_NODE_WS || 'wss://mainnet.aeternity.io/mdw/websocket',
    networkName: process.env.NUXT_APP_NETWORK_NAME || 'MAINNET',
    otherDeployments: process.env.NUXT_APP_OTHER_DEPLOYMENTS || 'TESTNET@https://explorer.testnet.aeternity.io',
    enableFaucet: process.env.NUXT_APP_ENABLE_FAUCET === 'true' || false,
    faucetAPI: process.env.NUXT_APP_FAUCET_API || 'https://testnet.faucet.aepps.com/account',
    APIDocs: process.env.NUXT_APP_API_DOCS || 'https://github.com/aeternity/ae_mdw#http-endpoints',
    version: process.env.npm_package_version
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/directives/copyToClipboard.js' },
    { src: '~/plugins/directives/removeSpacesOnCopy.js' },
    { src: '~/plugins/ws.js' }
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
    '@nuxtjs/svg-sprite',
    '@nuxtjs/moment'
  ],

  buildModules: [
    '@nuxtjs/style-resources',
    '@nuxt/postcss8',
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    transpile: ['@aeternity/aepp-sdk/es/utils/swagger', '@aeternity/aepp-sdk/es/utils/crypto'],

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
