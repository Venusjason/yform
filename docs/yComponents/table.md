* table 使用需要先全局注册

```js
  Vue.use(YTable, option)
```

### option api

| 参数 | 说明 | 类型       | 可选值      |  默认值  |
| ---- | ---- | --------- | ---------- | ------- |
| name | 	组件名称  | `String`  | —— | YTable | 
| columnTypes | 自定义columnItem上的type类型,用来解决项目中需要复用的字段格式化（该api只在jsx模式生效）  | `Object`  | —— | {} | 
| EmptyComponnet | 	列表为空时渲染(高于0.1.35版本)  | VNode  | —— | —— |
| defaultProps | 	table默认配置(高于0.1.35版本)  | `Object`  | —— | —— | 

::: warning WARNING
YTable 全局设置的参数 也会在 YQueryTable组件上生效，因为 `YQueryTable = YTable + Pagination`
:::

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
    },
    // 其他type，如 图片渲染，状态渲染等
  },
  EmptyComponnet: () => <div>好像没有数据~</div>
})
```

```jsx
const columns = [
  { label: '金额', prop: 'price', type: 'y-money' }
]

<YTable cloumns={cloumns} />

<YQueryTable cloumns={cloumns} />
```

:::demo
```vue
<template>
<div>

  <el-button @click="toggleList" >切换列表数据</el-button>

  <p>使用默认（或全局自定义）空状态</p>
  <YTable :data="list" :columns="columns">
  </YTable>

  <el-divider></el-divider>
  <p>使用局部自定义空状态</p>
  <YTable :data="list" :columns="columns">
    <template slot="empty">
      <div>自定义列表空状态</div>
    </template>
  </YTable>
</div>
</template>
<script>

const list = [
  { name: '中华香烟', price: 2, date: '2020-10-10', channel: '抖音'  },
  { name: '茅台', price: 2, date: '2020-10-10', channel: '抖音'  },
  { name: '五粮液', price: 2, date: '2020-10-10', channel: '抖音'  },
]

export default {
  data() {
    return {
      list: [],
      columns: [
        { label: '名称', prop: 'name' },
        { label: '价格', prop: 'price' },
        { label: '出厂日期', prop: 'date' },
        { label: '渠道', prop: 'channel' },
      ],
      useDefaultEmpty: false,
    }
  },
  methods: {
    toggleList() {
      this.list = this.list.length ? [] : list
    }
  }
}
</script>
```
:::

::: danger WARNING
columnTypes 内声明的type方法只会在 columns以jsx模式时才能生效，如果您使用 table slot方式开发，并不能享受该便利
:::