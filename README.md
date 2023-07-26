# longi-工程管理平台-v2-web

## 部署说明

- 部署内网环境
  - 打包之前修改 `/deploy/intranet/nginx_package.sh` 文件中的 `AppName` 变量
  - 进入服务器目录 `/home/haojinke/package_images/vue`
    - 删除该目录下的 `dist` 目录，命令 `rm -rf dist`
    - 将打包之后的 `dist` 文件夹放到该目录下
    - 执行脚本部署：`sh ./{{name}}/deploy/intranet/nginx_package.sh`
    - 内网访问：`http://10.0.88.198:9098/${AppName}/#/`

## 项目目录

```js
|-- .env.XXX // 打包环境配置文件
|-- .prettierignore // 无需校验代码格式的文件在此设置
|-- .prettierrc.js // 代码风格
|-- .husky // 为 git 客户端增加 hook 的工具
|-- deploy // 部署配置
|-- src
    |-- api // api接口，可以根据模块，或者功能分类，小驼峰命名
    |   |-- index.js
    |   |-- user.js
    |-- assets // 静态资源
    |   |-- iconfonts // 阿里巴巴矢量图或者其他字体文件
    |   |-- images
    |   |-- style
    |       |-- common.less // 公共样式
    |       |-- variables.module.less  // 公共less变量，可以在此导出变量在js中使用
    |-- components // 公共组件，局部组件放在功能目录下即可，大驼峰命名
    |-- config // 项目配置
    |   |-- theme.js // 主题配置
    |-- directives // 自定义指令
    |-- hooks // 自定义hooks，命名小驼峰命名，使用useXXXX命名，比如useTable
    |-- layouts // 布局文件，.vue文件大驼峰命名
    |   |-- BasicLayout.vue // 上、中(左右布局，有左侧菜单)、下布局
    |   |-- UpperMiddleLayout.vue // 上、中(无左侧菜单)、下布局
    |   |-- UserLayout.vue // 用户相关页面布局
    |-- lib // 封装第三方库、第三方库文件
    |   |-- axios.js // 封装axios请求
    |-- plugins
    |-- router
    |   |-- dynamicRouter.js // 动态路由
    |   |-- index.js
    |   |-- staticRouter.js // 静态路由
    |-- store
    |-- utils
    |   |-- const.js // 常量，命名使用大写字母+下划线
    |-- views // 页面。文件夹名称最好是单个单词，多个单词时使用小驼峰命名

```

## 安装依赖

```
npm install
```

### 本地开发

```
npm run serve
```

### 打包

```html
<!-- 打包生产环境 -->
npm run build
<!-- 打包预发环境 -->
npm run build:pre
<!-- 打包测试环境 -->
npm run build:stage
```

# 组件文档

## SearchForm

### 属性

| 参数          | 说明                           | 类型           | 默认值                                | 备注 |
| ------------- | ------------------------------ | -------------- | ------------------------------------- | ---- |
| formConfig    | 搜索配置，具体参考 ColumnProps | Array          |                                       |      |
| searchParam   | 所有的搜索参数，不包含分页     | Object         |                                       |      |
| searchFormCol | 响应式栅格属性                 | Number、Object | { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 } |      |

#### ColumnProps

| 参数   | 说明               | 类型   | 默认值 | 备注                                                                                |
| ------ | ------------------ | ------ | ------ | ----------------------------------------------------------------------------------- |
| label  | 字段说明           | String |        |
| value  | 字段名             | String |        |
| el     | 当前项搜索框的类型 | String |        | 支持：input、input-number、select、date-picker、time-picker,cascader,tree-select 等 |
| render | 自定义搜索表单项   | String |        |                                                                                     |
| col    | 栅格配置           |        |        | 支持：span、offset、xs、sm、md、lg、xl                                              |
| props  | 表单元素属性       |        |        | 支持：allowClear、placeholder、fieldNames:{ label: "label", value: "value" }        |

### 事件

| 事件名称           | 说明               | 回调参数 | 备注 |
| ------------------ | ------------------ | -------- | ---- |
| search             | 查询               | params   |      |
| reset              | 重置               | params   |      |
| formatSearchParams | 自定义查询参数格式 | params   |      |
