module.exports = {
  transpileDependencies: true,
  configureWebpack:{
    resolve: {
      fallback: { path: require.resolve("path-browserify") },
    },
  },
  pluginOptions: {
    electronBuilder: {
      externals: ['file-aes-crypt','request'],
      nodeModulesPath: ['../../node_modules', './node_modules'],
      builderOptions: {
        "productName": "文件加密传输",
        win: {
            icon: './public/icon.ico'
        },
        linux: {
          icon: './public/icon.ico',
          target: ["AppImage"]
        }
    }
    }
  }
}
