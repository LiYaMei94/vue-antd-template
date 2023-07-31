const { defineConfig } = require('@vue/cli-service');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: __dirname + '/deploy',
            to: __dirname + `/dist/${process.env.VUE_APP_outputDir}/deploy`
          }
        ]
      })
    );
  },
  devServer: {
    hot: false,
    liveReload: false,
    open: false,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API, //要代理的本地api地址，也可以换成线上测试地址
        changeOrigin: true, //允许跨域
        pathRewrite: { '^/api': '' } //将/api开头替换为/api
      }
    }
  }
});
