module.exports = {
  transpileDependencies: true,
  configureWebpack:{
    resolve: {
      fallback: { path: require.resolve("path-browserify") },
    },
  }
}
