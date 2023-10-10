const { defineConfig } = require('@vue/cli-service');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

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

    // svg 使用
    const dir = path.resolve(__dirname, 'src/assets/iconSvg');
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(dir)
      .end() // 包含 icons 目录
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ extract: false })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .tap((options) => ({
        ...options,
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              // attrs: '(fill|stroke)'
              attrs: '(fill)'
            }
          }
        ]
      }))
      .end();
    config.plugin('svg-sprite').use(require('svg-sprite-loader/plugin'), [{ plainSprite: true }]);
    config.module.rule('svg').exclude.add(dir); // 其他 svg loader 排除 iconSvg 目录
  },
  configureWebpack: (config) => {
    // 打包体积分析
    // config.plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: false }));
    // config.plugins.push(
    //   new CopyWebpackPlugin({
    //     patterns: [
    //       {
    //         from: __dirname + '/deploy',
    //         to: __dirname + `/dist/${process.env.VUE_APP_outputDir}/deploy`
    //       }
    //     ]
    //   })
    // );
    config.plugins.push(
      AutoImport({
        resolvers: [ElementPlusResolver()]
      })
    );
    config.plugins.push(
      Components({
        resolvers: [ElementPlusResolver()]
      })
    );
  },
  devServer: {
    client: {
      overlay: false // 关闭 错误 遮罩页面
    },
    allowedHosts: 'all', // 本地内网穿透
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
