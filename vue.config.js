const { defineConfig } = require('@vue/cli-service');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  publicPath: process.env.VUE_APP_publicPath,
  outputDir: `dist/${process.env.VUE_APP_outputDir}`,
  css: {
    loaderOptions: {
      less: {
        // 注入less全局变量
        additionalData: `@import "~/src/assets/style/variables.module.less";`
      }
    }
  },
  chainWebpack: (config) => {
    // 生产环境删除console、debugger、注释
    if (process.env.NODE_ENV === 'production') {
      const terser = config.optimization.minimizer('terser');
      terser.tap((args) => {
        const { terserOptions } = args[0];
        Object.assign(terserOptions, {
          compress: {
            ...terserOptions.compress,
            drop_console: true,
            drop_debugger: true
          },
          format: {
            comments: /@license/i
          }
        });
        return args;
      });
    }
  },
  configureWebpack: (config) => {
    // 打包体积分析
    // config.plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: false }));
  }
});
