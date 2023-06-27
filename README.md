# vue-project-template

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### TODO

- 权限（菜单（静态路由+动态路由），按钮：自定义指令，缓存）
- tab 页（权限、缓存）

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
