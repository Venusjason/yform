* table 使用需要先全局注册

```js
  Vue.use(YTable, option)
```

### option api

| 参数 | 说明 | 类型       | 可选值      |  默认值  |
| ---- | ---- | --------- | ---------- | ------- |
| name | 	组件名称  | `String`  | —— | YTable | 
| columnTypes | 自定义columnItem上的type类型,用来解决项目中需要复用的字段格式化（该api只在jsx模式生效）  | `Object`  | —— | {} | 

### columnTypesItem: fuction 参数
| 参数 | 说明 | 类型       | 可选值      |  默认值  |
| ---- | ---- | --------- | ---------- | ------- |
| value | prop字段对应的数据值  | `any`  | —— | - | 
| scopedValue | column组件 作用域插槽值  | { row, $index, column }  | —— | - | 
| columnProps | column组件上传入的props   | `object`  | —— | - | 

#### example

```js
Vue.use(YTable, {
  name: 'YTable',
  columnTypes: {
    'y-money': (value, scopedValue, columnProps) => {
      console.log(value, scopedValue, columnProps)
      return `￥${value}`
    }
  }
})
```

```jsx
const columns = [
  { label: '金额', prop: 'price', type: 'y-money' }
]

<YTable cloumns={cloumns} />

<YQueryTable cloumns={cloumns} />
```

::: danger WARNING
columnTypes 内声明的type方法只会在 columns以jsx模式时才能生效，如果您使用 table slot方式开发，并不能享受该便利
:::