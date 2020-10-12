
* 针对表单提供24栅格化布局
* 自带收起展开功能
* 根据屏幕分辨率自动排版

```js
import {
  useYFormLog,
  extendRules,
  YForm,
  YField,
  YButton,
  YQueryTable,
  YTable,
  YLayout,
  YCol,
} from '@yform/vue/lib/element-ui/index.umd'


Vue.use(YLayout, {
  // 定义区块不同屏幕尺寸，必须由小向大
  breakpointWidth: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  }
})

Vue.use(YCol, {
  collapseButtonComponent: {
    // 渲染收起展开的按钮
    tag: 'YButton',
    props: {
      type: 'text',
    }
  }
})

```

## YLayout

#### Attributes

| 参数 | 说明 | 类型       | 可选值      |  默认值  |
| ---- | ---- | --------- | ---------- | ------- |
| gutter | 	栅格间隔  | Number  | —— | 8 | 

## YCol

#### Attributes

| 参数 | 说明 | 类型       | 可选值      |  默认值  |
| ---- | ---- | --------- | ---------- | ------- |
| offset | 栅格左侧的间隔格数  | Number  | —— | —— |     
| pull | 栅格向左移动格数  | Number  | —— | —— |     
| push | 栅格向右移动格数 | Number  | —— | —— |     
| span | 栅格占据的列数  | Number  | —— | —— |     
| layouts | 该字段可以定义不同`breakpointWidth`尺寸下的 `offset`、`pull`、`push`、`span` | Object  | —— | —— |
| collapse | 展开收起功能块  | Boolean  | —— | —— |     
