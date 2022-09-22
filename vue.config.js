module.exports = {
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/scss/global";'
      }
    }
  }
}
