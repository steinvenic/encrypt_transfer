module.exports = {
  transpileDependencies: true,
  configureWebpack:{
    resolve: {
      fallback: { path: require.resolve("path-browserify") },
    },
  },
  pluginOptions: {
    electronBuilder: {
      // List native deps here if they don't work
      externals: ['file-aes-crypt'],
      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      nodeModulesPath: ['../../node_modules', './node_modules']
    }
  }
}
