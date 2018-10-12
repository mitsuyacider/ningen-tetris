module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'tetris',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://unpkg.com/vue-p5@0.7.x' }
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev }) {
      if (isDev && process.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  // modules: [
  // ['nuxt-sass-resources-loader', [
  //   'assets/scss/variables_for_vue.scss',
  // ]]],
  css: [
  'bootstrap/dist/css/bootstrap.min.css',
  'bootstrap-vue/dist/bootstrap-vue.css',
  ],
  plugins: [
    '@/plugins/plugin',
  ]
}
